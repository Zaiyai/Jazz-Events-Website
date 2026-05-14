const COOKIES = {
  setCookie(email, user_type, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = "email=" + email + ";" + expires + ";path=/";
    document.cookie = "user_type=" + user_type + ";" + expires + ";path=/";
  },

  removeCookie(cname) {
     document.cookie = cname + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"; 
  },
  
  getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let cookie = ca[i];
      while (cookie.charAt(0) == ' ') {
        cookie = cookie.substring(1);
      }
      if (cookie.indexOf(name) == 0) {
        return cookie.substring(name.length, cookie.length);
      }
    }
    return "";
  },

  hasEmail() {
    return COOKIES.getCookie("email") != "";
  }
}

const DB = {
  currentUser: null,
  
  logout() {
    DB.currentUser = null;
    COOKIES.removeCookie("email");
    COOKIES.removeCookie("user_type");
    window.location.href = 'http://localhost/jazz%20events%20website/home.html';
  },
  
  // Returns id, email, name, and initials of user as json
  async getUser() {
    if (COOKIES.hasEmail()) {
      try {
        const response = await fetch("/jazz%20events%20website/scripts/user.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ email: COOKIES.getCookie("email") }), 
        });

        if (!response.ok) throw new Error("HTTP error: " + response.status);

        const data = await response.json();

        if (data.status == "success") {
          DB.currentUser = data;
          return DB.currentUser;
        } else {
          console.warn("Something went wrong with getting the user");
          return null;
        }
      } catch (error) {
        console.error("Fetch failed:", error);
        return null;
      }
    }

    return null;
  },

  async getClients({ page = 1, perPage = 20 } = {}) {
    const response = await fetch("/jazz%20events%20website/scripts/clients/get_clients.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    });
    const all = await response.json();
    const start = (page - 1) * perPage;
    console.log("Fetched clients:", all.clients[0]);
    return {
      data: all.clients.slice(start, start + perPage),
      total: all.clients.length,
      page,
      perPage
    };;
  },

  /* ── BOOKINGS ─────────────────────────────────────────────── */
  async createBooking(event) {
    fetch("/Jazz%20Events%20Website/scripts/bookings/add_booking.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(event), 
    })
    .then(response => {
      if (!response.ok) throw new Error("HTTP error: " + response.status);
      setTimeout(()=>{window.location.href = 'booking_success.html';}, 1500);
      return response.json();
    });

    return { ok: true, data: event };
  },

  async getUserBookings() {
    let user = await DB.getUser();

    const response = await fetch("../scripts/bookings/user_booking.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user)
    });

    if (!response.ok) throw new Error("HTTP error: " + response.status);

    const data = await response.json();

    if (data.ok && !data.empty) {
      return data.bookings[0]; 
    } else {
      return [];
    }
  },

  async getBookingById(booking_id) {
    const response = await fetch("../scripts/bookings/get_bookings.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ booking_id: booking_id })
    });

    if (!response.ok) throw new Error("HTTP error: " + response.status);

    const data = await response.json();

    if (data.ok && !data.empty) {
      return data.bookings[0]; 
    } else {
      return null;
    }
  },

  /* ── EVENTS ─────────────────────────────────────────────── */
  async getEvents(page = 1, perPage = 4) {
    const all = await getData('events');
    const start = (page - 1) * perPage;
    return {
      data: all.slice(start, start + perPage),
      total: all.length,
      page,
      perPage
    };
  },

  async createEvent(event) {
    const all = await getData('events');
    
    all.unshift(event);
    
    fetch("../scripts/events/add_event.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(event), 
    })
    .then(response => {
      if (!response.ok) throw new Error("HTTP error: " + response.status);
      return response.json();
    });

    return { ok: true, data: event };
  },

  async updateEvent(id, updates) {
    let event = { event_id: id, ...updates };
    
    fetch("../scripts/events/edit_event.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(event), 
    })
    .then(response => {
      if (!response.ok) throw new Error("HTTP error: " + response.status);
      return response.json();
    });

    return { ok: true };
  },

  async deleteEvent(id) {
    fetch("../scripts/events/remove_event.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ event_id: id }), 
    })
    .then(response => {
      if (!response.ok) throw new Error("HTTP error: " + response.status);
      return response.json();
    });

    return { ok: true };
  },

  async changePassword(currentPassword, newPassword) {
    const email = COOKIES.getCookie("email");
    if (!email) throw new Error("User not logged in");

    const response = await fetch("../scripts/change_password.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: email,
        current_password: currentPassword,
        new_password: newPassword
      })
    });

    if (!response.ok) throw new Error("HTTP error: " + response.status);
    return await response.json();
  },

  /* ── STATS ──────────────────────────────────────────────── */
  async getStats() {
    return getData('je_stats');
  }
};

/* ── Helpers ─────────────────────────────────────────────── */
async function getData(key) {
  try {
    const response = await fetch("../scripts/events/" + key + ".php", {
      method: "POST",
      headers: { "Content-Type": "application/json" }
    });

    if (!response.ok) throw new Error("HTTP error: " + response.status);

    const data = await response.json();

    if (data.ok && !data.empty) {
      return data.events[0]; 
    } else {
      return [];
    }
  } catch (error) {
    console.warn(key + " fetch failed, Error:", error);
    return [];
  }
}