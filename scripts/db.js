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
      // window.location.href = 'booking_success.html';
      return response.json();
    });

    return { ok: true, data: event };
  },

  /* ── EVENTS ─────────────────────────────────────────────── */
  async getEvents(page = 1, perPage = 4) {
    const all = await getDataOrDefault('events', DEFAULT_EVENTS);
    const start = (page - 1) * perPage;
    return {
      data: all.slice(start, start + perPage),
      total: all.length,
      page,
      perPage
    };
  },

  async createEvent(event) {
    const all = await getDataOrDefault('events', DEFAULT_EVENTS);
    
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

  /* ── STATS ──────────────────────────────────────────────── */
  async getStats() {
    return getDataOrDefault('je_stats', DEFAULT_STATS);
  }
};

/* ── Helpers ─────────────────────────────────────────────── */
async function getDataOrDefault(key, def) {
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
    console.warn("Fetch failed, using defaults. Error:", error);
    return JSON.parse(JSON.stringify(def));
  }
}

const DEFAULT_EVENTS = [
  { id: '1', name: 'Golden Anniversary Gala',      type: 'Corporate Dinner',  guests: 120, client: 'Pat',     clientInitials: 'P', date: '2026-12-28', venue: 'Shang-ri La',         status: 'confirmed',  amount: 349000, emoji: '🎊' },
  { id: '2', name: 'Garden Wedding',                type: 'Wedding',           guests: 200, client: 'Emma',    clientInitials: 'E', date: '2026-07-15', venue: 'Fernwood Gardens',     status: 'pending',    amount: 599000, emoji: '💐' },
  { id: '3', name: "New Year's Executive Retreat",  type: 'Corporate',         guests: 50,  client: 'Michael', clientInitials: 'M', date: '2025-10-02', venue: 'Mountain Lodge Resort',status: 'completed',  amount: 109000, emoji: '🏢' },
  { id: '4', name: '50th Birthday Celebration',     type: 'Private Party',     guests: 80,  client: 'Sarah',   clientInitials: 'S', date: '2026-11-20', venue: 'Rooftop Terrace',     status: 'confirmed',  amount: 289000, emoji: '🎂' },
  { id: '5', name: 'Silver Wedding Anniversary',    type: 'Wedding',           guests: 150, client: 'Jose',    clientInitials: 'J', date: '2026-09-10', venue: 'Crimson Hotel',        status: 'pending',    amount: 420000, emoji: '💍' },
  { id: '6', name: 'Debut Celebration',             type: 'Private Party',     guests: 100, client: 'Lea',     clientInitials: 'L', date: '2026-08-05', venue: 'Diamond Events Place', status: 'confirmed',  amount: 180000, emoji: '🌸' },
];

const DEFAULT_STATS = {
  totalRevenue:  { value: '48,295',  change: '+12.5%', sub: 'vs. 42,950 last month' },
  activeEvents:  { value: '24',       change: '+3',      sub: '8 events this week'     },
  pendingPayments:{ value: '12,450', change: null,      sub: '6 invoices awaiting'    },
  satisfaction:  { value: '98.5%',    change: '+2.1%',   sub: 'Based on 142 reviews'   },
};