/* =============================================================
   JAZZ EVENTS — db.js
   Mock database layer. Replace fetch() calls with real API
   endpoints (e.g. /api/events, /api/tasks, etc.)
   ============================================================= */

const DB = {
  /* ── AUTH (stub) ────────────────────────────────────────── */
  currentUser: null,

  async login(email, password) {
    // TODO: replace with POST /api/auth/login
    await delay(600);
    if (email && password) {
      DB.currentUser = { name: 'Edrian Albero', role: 'Event Organizer', initials: 'EA' };
      localStorage.setItem('je_user', JSON.stringify(DB.currentUser));
      return { ok: true };
    }
    return { ok: false, message: 'Invalid credentials' };
  },

  // async register(data) {
  //   // TODO: replace with POST /api/auth/register
  //   await delay(800);
  //   return { ok: true };
  // },

  logout() {
    DB.currentUser = null;
    localStorage.removeItem('je_user');
    // Works whether called from pages/ or root
    const isInPages = window.location.pathname.includes('/pages/');
    window.location.href = isInPages ? 'login.html' : 'jazz-events/pages/login.html';
  },

  getUser() {
    if (DB.currentUser) return DB.currentUser;
    const stored = localStorage.getItem('je_user');
    if (stored) { DB.currentUser = JSON.parse(stored); return DB.currentUser; }
    return null;
  },

  /* ── EVENTS ─────────────────────────────────────────────── */
  async getEvents(page = 1, perPage = 4) {
    // TODO: replace with GET /api/events?page=X&per_page=Y
    await delay(300);
    const all = getLocalOrDefault('je_events', DEFAULT_EVENTS);
    const start = (page - 1) * perPage;
    return {
      data: all.slice(start, start + perPage),
      total: all.length,
      page,
      perPage
    };
  },

  async createEvent(event) {
    // TODO: replace with POST /api/events
    await delay(400);
    const all = getLocalOrDefault('je_events', DEFAULT_EVENTS);
    const newEvent = { ...event, id: uid(), createdAt: new Date().toISOString() };
    all.unshift(newEvent);
    localStorage.setItem('je_events', JSON.stringify(all));
    return { ok: true, data: newEvent };
  },

  async updateEvent(id, updates) {
    // TODO: replace with PUT /api/events/:id
    await delay(300);
    let all = getLocalOrDefault('je_events', DEFAULT_EVENTS);
    all = all.map(e => e.id === id ? { ...e, ...updates } : e);
    localStorage.setItem('je_events', JSON.stringify(all));
    return { ok: true };
  },

  async deleteEvent(id) {
    // TODO: replace with DELETE /api/events/:id
    await delay(300);
    let all = getLocalOrDefault('je_events', DEFAULT_EVENTS);
    all = all.filter(e => e.id !== id);
    localStorage.setItem('je_events', JSON.stringify(all));
    return { ok: true };
  },

  /* ── TASKS ──────────────────────────────────────────────── */
  async getTasks() {
    // TODO: replace with GET /api/tasks
    await delay(250);
    return getLocalOrDefault('je_tasks', DEFAULT_TASKS);
  },

  async createTask(task) {
    await delay(300);
    const all = getLocalOrDefault('je_tasks', DEFAULT_TASKS);
    const newTask = { ...task, id: uid(), done: false };
    all.push(newTask);
    localStorage.setItem('je_tasks', JSON.stringify(all));
    return { ok: true, data: newTask };
  },

  async toggleTask(id) {
    await delay(200);
    let all = getLocalOrDefault('je_tasks', DEFAULT_TASKS);
    all = all.map(t => t.id === id ? { ...t, done: !t.done } : t);
    localStorage.setItem('je_tasks', JSON.stringify(all));
    return { ok: true };
  },

  async deleteTask(id) {
    await delay(200);
    let all = getLocalOrDefault('je_tasks', DEFAULT_TASKS);
    all = all.filter(t => t.id !== id);
    localStorage.setItem('je_tasks', JSON.stringify(all));
    return { ok: true };
  },

  /* ── TEAM ───────────────────────────────────────────────── */
  async getTeam() {
    // TODO: replace with GET /api/team
    await delay(200);
    return getLocalOrDefault('je_team', DEFAULT_TEAM);
  },

  async updateTeamMember(id, updates) {
    await delay(300);
    let all = getLocalOrDefault('je_team', DEFAULT_TEAM);
    all = all.map(m => m.id === id ? { ...m, ...updates } : m);
    localStorage.setItem('je_team', JSON.stringify(all));
    return { ok: true };
  },

  /* ── STATS ──────────────────────────────────────────────── */
  async getStats() {
    // TODO: replace with GET /api/stats
    await delay(250);
    return getLocalOrDefault('je_stats', DEFAULT_STATS);
  },

  /* ── BOOKINGS ───────────────────────────────────────────── */
  async submitBooking(formData) {
    // TODO: replace with POST /api/bookings
    await delay(700);
    const all = getLocalOrDefault('je_bookings', []);
    all.push({ ...formData, id: uid(), submittedAt: new Date().toISOString(), status: 'pending' });
    localStorage.setItem('je_bookings', JSON.stringify(all));
    return { ok: true };
  }
};

/* ── Helpers ─────────────────────────────────────────────── */
function delay(ms) { return new Promise(r => setTimeout(r, ms)); }
function uid() { return Math.random().toString(36).slice(2, 10); }
function getLocalOrDefault(key, def) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : JSON.parse(JSON.stringify(def));
  } catch { return JSON.parse(JSON.stringify(def)); }
}

/* ── Seed data (used if localStorage is empty) ───────────── */
const DEFAULT_EVENTS = [
  { id: 'e1', name: 'Golden Anniversary Gala',      type: 'Corporate Dinner',  guests: 120, client: 'Pat',     clientInitials: 'P', date: '2026-12-28', venue: 'Shang-ri La',         status: 'confirmed',  amount: 349000, emoji: '🎊' },
  { id: 'e2', name: 'Garden Wedding',                type: 'Wedding',           guests: 200, client: 'Emma',    clientInitials: 'E', date: '2026-07-15', venue: 'Fernwood Gardens',     status: 'pending',    amount: 599000, emoji: '💐' },
  { id: 'e3', name: "New Year's Executive Retreat",  type: 'Corporate',         guests: 50,  client: 'Michael', clientInitials: 'M', date: '2025-10-02', venue: 'Mountain Lodge Resort',status: 'completed',  amount: 109000, emoji: '🏢' },
  { id: 'e4', name: '50th Birthday Celebration',     type: 'Private Party',     guests: 80,  client: 'Sarah',   clientInitials: 'S', date: '2026-11-20', venue: 'Rooftop Terrace',     status: 'confirmed',  amount: 289000, emoji: '🎂' },
  { id: 'e5', name: 'Silver Wedding Anniversary',    type: 'Wedding',           guests: 150, client: 'Jose',    clientInitials: 'J', date: '2026-09-10', venue: 'Crimson Hotel',        status: 'pending',    amount: 420000, emoji: '💍' },
  { id: 'e6', name: 'Debut Celebration',             type: 'Private Party',     guests: 100, client: 'Lea',     clientInitials: 'L', date: '2026-08-05', venue: 'Diamond Events Place', status: 'confirmed',  amount: 180000, emoji: '🌸' },
];

const DEFAULT_TASKS = [
  { id: 't1', name: 'Confirm catering menu with Chef',          due: 'Dec 28, 2026',   location: 'Shang-ri La',      done: false },
  { id: 't2', name: 'Arrange floral decorations delivery',      due: 'July 15, 2026',  location: 'Fernwood Gardens', done: false },
  { id: 't3', name: 'Process payment for Corporate Retreat',    due: 'Oct 2, 2025',    location: '',                 done: true  },
  { id: 't4', name: 'Send contract to Emma for Garden Wedding', due: 'June 1, 2026',   location: '',                 done: false },
];

const DEFAULT_TEAM = [
  { id: 'm1', name: 'Queen Albero-Velasco', role: 'Founder',             initials: 'QA', online: true  },
  { id: 'm2', name: 'Aj Velasco',           role: 'Founder',             initials: 'AV', online: true  },
  { id: 'm3', name: 'Edrian Albero',        role: 'Event Organizer',     initials: 'EA', online: false },
  { id: 'm4', name: 'Xhyryn Buenaobra',     role: 'Customer Relations',  initials: 'XB', online: false },
];

const DEFAULT_STATS = {
  totalRevenue:  { value: '48,295',  change: '+12.5%', sub: 'vs. 42,950 last month' },
  activeEvents:  { value: '24',       change: '+3',      sub: '8 events this week'     },
  pendingPayments:{ value: '12,450', change: null,      sub: '6 invoices awaiting'    },
  satisfaction:  { value: '98.5%',    change: '+2.1%',   sub: 'Based on 142 reviews'   },
};
