(function () {
  function getPrefix() {
    var path = window.location.pathname.toLowerCase();
    if (
      path.indexOf("/booking/") !== -1 ||
      path.indexOf("/settings/") !== -1 ||
      path.indexOf("/policies/") !== -1 ||
      path.indexOf("/register/") !== -1
    ) {
      return "../";
    }
    return "";
  }

  function buildNavLinks(prefix) {
    var home = prefix + "home.html";
    return [
      { href: home, label: "Home" },
      { href: home + "#services-section", label: "Services" },
      { href: home + "#team-section", label: "Team" },
      { href: home + "#reviews-section", label: "Reviews" },
      { href: home + "#about", label: "About Us" },
      { href: home + "#cta-section", label: "Contact" }
    ];
  }

  function renderLinks(links) {
    return links
      .map(function (link) {
        return '<a href="' + link.href + '">' + link.label + "</a>";
      })
      .join("");
  }

  function renderTopbar() {
    var root = document.getElementById("topbar-root");
    if (!root) return;

    var prefix = getPrefix();
    var links = buildNavLinks(prefix);
    var linkMarkup = renderLinks(links);

    root.innerHTML =
      '<header style="background: rgba(10, 10, 10, 0.9); backdrop-filter: blur(10px);">' +
      '  <div class="nav-container">' +
      '    <button id="burger" class="mobile-btn"><i class="fa-solid fa-bars"></i></button>' +
      '    <nav class="nav-links desktop-nav">' +
      linkMarkup +
      "    </nav>" +
      '    <div class="search-wrapper">' +
      '      <i class="fa-solid fa-magnifying-glass search-icon"></i>' +
      '      <input id="search-input" type="text" placeholder="Search Jazz Events...">' +
      '      <ul id="search-content"></ul>' +
      "    </div>" +
      '    <div id="nav-auth-slot"></div>' +
      "  </div>" +
      "</header>" +
      '<div id="nav-overlay" class="nav-overlay mobile-only">' +
      '  <button id="close-overlay" class="close-btn">✕</button>' +
      '  <nav class="nav-links overlay-links">' +
      linkMarkup +
      "  </nav>" +
      "</div>";
  }

  window.renderTopbar = renderTopbar;

  function setupUserAuth() {
    var slot = document.getElementById('nav-auth-slot');
    if (!slot) return;

    // If logged in, show admin panel or regular user profile dropdown
    if (COOKIES.hasEmail()) {
      var prefix = getPrefix();
      if (COOKIES.getCookie("user_type") == 'ADMIN') {
        const navLinks = document.getElementsByClassName('nav-links')[0];
        
        navLinks.innerHTML = 
          '<a href="' + prefix + 'dashboard/dashboard.html" style="color: #d4af37;">ADMIN PANEL</a>' +
          '<span style="color: #333; margin: 0 10px;">|</span>' +
          '<a href="' + prefix + 'home.html#">Home</a>' +
          '<a href="' + prefix + 'home.html#services-section">Services</a>' +
          '<a href="' + prefix + 'home.html#team-section">Team</a>' +
          '<a href="' + prefix + 'home.html#reviews-section">Reviews</a>' +
          '<a href="' + prefix + 'home.html#about">About Us</a>' +
          '<a href="' + prefix + 'home.html#cta-section">Contact</a>';
      } 
      // Build profile avatar + dropdown for regular users
      slot.innerHTML =
        '<div class="profile-menu-wrap" id="profile-menu-wrap">' +
          '<button class="profile-avatar-btn" id="profile-avatar-btn" title="My Account">' +
            '<span class="profile-avatar-initials" id="profile-avatar-initials"><i class="fa-regular fa-user"></i></span>' +
          '</button>' +
          '<div class="profile-dropdown" id="profile-dropdown">' +
            '<div class="profile-dropdown-header">' +
              '<div class="profile-dropdown-avatar" id="profile-dropdown-avatar"><i class="fa-regular fa-user"></i></div>' +
              '<div class="profile-dropdown-name" id="profile-dropdown-name">My Account</div>' +
            '</div>' +
            '<div class="profile-dropdown-divider"></div>' +
            '<a href="' + prefix + 'settings/client_bookings.html" class="profile-dropdown-item">' +
              '<i class="fa-regular fa-calendar"></i> Bookings' +
            '</a>' +
            '<a href="' + prefix + 'settings/settings-profile.html" class="profile-dropdown-item">' +
              '<i class="fa-solid fa-sliders"></i> Settings' +
            '</a>' +
            '<div class="profile-dropdown-divider"></div>' +
            '<button class="profile-dropdown-logout" onclick="handleProfileLogout()">' +
              '<i class="fa-solid fa-arrow-right-from-bracket"></i> Sign Out' +
            '</button>' +
          '</div>' +
        '</div>';

        // Fetch user info and populate name + initials + profile picture
        DB.getUser().then(function(user) {
          if (user && user.name) {
            var words = user.name.trim().split(/\s+/);
            var initials = words.map(function(w){ return w[0]; }).join('').toUpperCase().substring(0,2);
            
            var profileInitials = document.getElementById('profile-avatar-initials');
            if (user.profile_picture) {
              // Show profile picture
              profileInitials.innerHTML = '<img src="' + user.profile_picture + '" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">';
            } else {
              // Show initials
              profileInitials.textContent = initials;
            }
            
            var profileDropdownAvatar = document.getElementById('profile-dropdown-avatar');
            if (user.profile_picture) {
              profileDropdownAvatar.innerHTML = '<img src="' + user.profile_picture + '" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">';
            } else {
              profileDropdownAvatar.textContent = initials;
            }
            
            document.getElementById('profile-dropdown-name').textContent = user.name;
          }
        });

        // Toggle dropdown on avatar click
        document.getElementById('profile-avatar-btn').addEventListener('click', function(e) {
          e.stopPropagation();
          document.getElementById('profile-dropdown').classList.toggle('open');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
          var dd = document.getElementById('profile-dropdown');
          if (dd && !document.getElementById('profile-menu-wrap').contains(e.target)) {
              dd.classList.remove('open');
          }
        });

    // No Accounts Registered
    } else {
        slot.innerHTML ='<a onclick="displayLogin()" class="btn-nav-login">LOG IN</a>';
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function() {
      renderTopbar();
      setupUserAuth();
    });
  } else {
    renderTopbar();
    setupUserAuth();
  }
})();
