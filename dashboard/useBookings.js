/* useBookings.js – simple in‑memory store with mock data for Admin Bookings */
const mockBookings = [
  { id: 'b1', clientName: 'Maria', email: 'maria@example.com', eventDate: '2026-07-15', eventType: 'Wedding', status: 'PENDING', notes: '' },
  { id: 'b2', clientName: 'John Doe', email: 'john@example.com', eventDate: '2026-08-01', eventType: 'Corporate', status: 'CONFIRMED', notes: '' },
  { id: 'b3', clientName: 'Alice', email: 'alice@example.com', eventDate: '2026-09-10', eventType: 'Private', status: 'COMPLETED', notes: '' },
  { id: 'b4', clientName: 'Bob', email: 'bob@example.com', eventDate: '2026-10-05', eventType: 'Corporate', status: 'CANCELLED', notes: '' },
  { id: 'b5', clientName: 'Clara', email: 'clara@example.com', eventDate: '2026-11-20', eventType: 'Wedding', status: 'PENDING', notes: '' },
  { id: 'b6', clientName: 'David', email: 'david@example.com', eventDate: '2026-12-12', eventType: 'Private', status: 'CONFIRMED', notes: '' },
  { id: 'b7', clientName: 'Eve', email: 'eve@example.com', eventDate: '2027-01-03', eventType: 'Corporate', status: 'COMPLETED', notes: '' },
  { id: 'b8', clientName: 'Frank', email: 'frank@example.com', eventDate: '2027-02-14', eventType: 'Wedding', status: 'CANCELLED', notes: '' }
];

function getBookings() { return [...mockBookings]; }
function createBooking(data) { const id = 'b' + (mockBookings.length + 1); mockBookings.push({ id, ...data }); }
function updateBooking(id, data) { const idx = mockBookings.findIndex(b => b.id === id); if (idx !== -1) mockBookings[idx] = { ...mockBookings[idx], ...data }; }
function deleteBooking(id) { const idx = mockBookings.findIndex(b => b.id === id); if (idx !== -1) mockBookings.splice(idx, 1); }
function changeStatus(id, newStatus) { const booking = mockBookings.find(b => b.id === id); if (booking) booking.status = newStatus; }

// expose globally
window.useBookings = { getBookings, createBooking, updateBooking, deleteBooking, changeStatus };
