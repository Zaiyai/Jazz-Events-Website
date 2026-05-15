/* useBookings.js – fetches bookings from the jazz_events database via PHP API */

const useBookings = {
  /** Fetch all bookings from the database */
  async getBookings() {
    try {
      const response = await fetch('../scripts/bookings/get_bookings.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) throw new Error('HTTP error: ' + response.status);

      const data = await response.json();

      if (data.ok && !data.empty) {
        // Map DB columns to the shape the UI expects
        return data.bookings.map(b => ({
          id:          b.booking_id,
          clientName:  b.client_name,
          email:       b.email,
          phone:       b.phone,
          eventName:   b.name,
          eventType:   b.type,
          eventDate:   b.date_from,
          dateTo:      b.date_to,
          guests:      b.no_of_guests,
          venue:       b.venue,
          theme:       b.theme,
          status:      b.status,
          budget:      parseFloat(b.budget) || 0,
          createdAt:   b.created_at,
          updatedAt:   b.updated_at
        }));
      }
      return [];
    } catch (error) {
      console.error('useBookings.getBookings failed:', error);
      return [];
    }
  },

  /** Update a booking's fields by its ID */
  async updateBooking(id, updates) {
    try {
      const response = await fetch('../scripts/bookings/update_booking.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ booking_id: id, ...updates })
      });

      if (!response.ok) throw new Error('HTTP error: ' + response.status);
      return await response.json();
    } catch (error) {
      console.error('useBookings.updateBooking failed:', error);
      return { ok: false };
    }
  },

  /** Change just the status of a booking */
  async changeStatus(id, newStatus) {
    return useBookings.updateBooking(id, { status: newStatus });
  },

  /** Accept a booking: convert to event and delete */
  async acceptBooking(id) {
    try {
      const response = await fetch('../scripts/bookings/accept_booking.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ booking_id: id })
      });

      if (!response.ok) throw new Error('HTTP error: ' + response.status);
      return await response.json();
    } catch (error) {
      console.error('useBookings.acceptBooking failed:', error);
      return { ok: false };
    }
  },

  /** Delete a booking */
  async deleteBooking(id) {
    try {
      const response = await fetch('../scripts/bookings/delete_booking.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ booking_id: id })
      });

      if (!response.ok) throw new Error('HTTP error: ' + response.status);
      return await response.json();
    } catch (error) {
      console.error('useBookings.deleteBooking failed:', error);
      return { ok: false };
    }
  }
};

// Expose globally
window.useBookings = useBookings;
