const DB = {
  currentUser: null,
  
  logout() {
    DB.currentUser = null;
    localStorage.removeItem('je_user');
    // Works whether called from pages/ or root
    const isInPages = window.location.pathname.includes('/pages/');
    window.location.href = isInPages ? 'login.html' : 'jazz-events/pages/login.html';
  },

  async getUser() {
    if (COOKIES.hasEmail()) {
      try {
        const response = await fetch("../scripts/user.php", {
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
    console.log(event)
    
    fetch("../scripts/add_event.php", {
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
    // TODO: replace with PUT /api/events/:id
    await delay(300);
    let all = getDataOrDefault('events', DEFAULT_EVENTS);
    all = all.map(e => e.id === id ? { ...e, ...updates } : e);
    localStorage.setItem('je_events', JSON.stringify(all));
    return { ok: true };
  },

  async deleteEvent(id) {
    // TODO: replace with DELETE /api/events/:id
    await delay(300);
    let all = getDataOrDefault('events', DEFAULT_EVENTS);
    all = all.filter(e => e.id !== id);
    localStorage.setItem('je_events', JSON.stringify(all));
    return { ok: true };
  },

  /* ── TASKS ──────────────────────────────────────────────── */
  async getTasks() {
    // TODO: replace with GET /api/tasks
    await delay(250);
    return getDataOrDefault('tasks', DEFAULT_TASKS);
  },

  async createTask(task) {
    await delay(300);
    const all = getDataOrDefault('tasks', DEFAULT_TASKS);
    const newTask = { ...task, id: uid(), done: false };
    all.push(newTask);
    localStorage.setItem('je_tasks', JSON.stringify(all));
    return { ok: true, data: newTask };
  },

  async toggleTask(id) {
    await delay(200);
    let all = getDataOrDefault('tasks', DEFAULT_TASKS);
    all = all.map(t => t.id === id ? { ...t, done: !t.done } : t);
    localStorage.setItem('je_tasks', JSON.stringify(all));
    return { ok: true };
  },

  async deleteTask(id) {
    await delay(200);
    let all = getDataOrDefault('tasks', DEFAULT_TASKS);
    all = all.filter(t => t.id !== id);
    localStorage.setItem('je_tasks', JSON.stringify(all));
    return { ok: true };
  },

  /* ── STATS ──────────────────────────────────────────────── */
  async getStats() {
    // TODO: replace with GET /api/stats
    await delay(250);
    return getDataOrDefault('je_stats', DEFAULT_STATS);
  },

  /* ── BOOKINGS ───────────────────────────────────────────── */
  async submitBooking(formData) {
    // TODO: replace with POST /api/bookings
    await delay(700);
    const all = getDataOrDefault('je_bookings', []);
    all.push({ ...formData, id: uid(), submittedAt: new Date().toISOString(), status: 'pending' });
    localStorage.setItem('je_bookings', JSON.stringify(all));
    return { ok: true };
  }
};

/* ── Helpers ─────────────────────────────────────────────── */
function delay(ms) { return new Promise(r => setTimeout(r, ms)); }
function uid() { return Math.random().toString(36).slice(2, 10); }

async function getDataOrDefault(key, def) {
  try {
    const response = await fetch("../scripts/" + key + ".php", {
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

/* ── Seed data (used if localStorage is empty) ───────────── */
const DEFAULT_EVENTS = [
  { id: '1', name: 'Golden Anniversary Gala',      type: 'Corporate Dinner',  guests: 120, client: 'Pat',     clientInitials: 'P', date: '2026-12-28', venue: 'Shang-ri La',         status: 'confirmed',  amount: 349000, emoji: '🎊' },
  { id: '2', name: 'Garden Wedding',                type: 'Wedding',           guests: 200, client: 'Emma',    clientInitials: 'E', date: '2026-07-15', venue: 'Fernwood Gardens',     status: 'pending',    amount: 599000, emoji: '💐' },
  { id: '3', name: "New Year's Executive Retreat",  type: 'Corporate',         guests: 50,  client: 'Michael', clientInitials: 'M', date: '2025-10-02', venue: 'Mountain Lodge Resort',status: 'completed',  amount: 109000, emoji: '🏢' },
  { id: '4', name: '50th Birthday Celebration',     type: 'Private Party',     guests: 80,  client: 'Sarah',   clientInitials: 'S', date: '2026-11-20', venue: 'Rooftop Terrace',     status: 'confirmed',  amount: 289000, emoji: '🎂' },
  { id: '5', name: 'Silver Wedding Anniversary',    type: 'Wedding',           guests: 150, client: 'Jose',    clientInitials: 'J', date: '2026-09-10', venue: 'Crimson Hotel',        status: 'pending',    amount: 420000, emoji: '💍' },
  { id: '6', name: 'Debut Celebration',             type: 'Private Party',     guests: 100, client: 'Lea',     clientInitials: 'L', date: '2026-08-05', venue: 'Diamond Events Place', status: 'confirmed',  amount: 180000, emoji: '🌸' },
];

const DEFAULT_TASKS = [
  { id: 't1', name: 'Confirm catering menu with Chef',          due: 'Dec 28, 2026',   location: 'Shang-ri La',      done: false },
  { id: 't2', name: 'Arrange floral decorations delivery',      due: 'July 15, 2026',  location: 'Fernwood Gardens', done: false },
  { id: 't3', name: 'Process payment for Corporate Retreat',    due: 'Oct 2, 2025',    location: '',                 done: true  },
  { id: 't4', name: 'Send contract to Emma for Garden Wedding', due: 'June 1, 2026',   location: '',                 done: false },
];

const DEFAULT_STATS = {
  totalRevenue:  { value: '48,295',  change: '+12.5%', sub: 'vs. 42,950 last month' },
  activeEvents:  { value: '24',       change: '+3',      sub: '8 events this week'     },
  pendingPayments:{ value: '12,450', change: null,      sub: '6 invoices awaiting'    },
  satisfaction:  { value: '98.5%',    change: '+2.1%',   sub: 'Based on 142 reviews'   },
};
