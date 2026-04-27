// Flying Frogs - Member Dashboard Logic
// Functions do not work yet as the backend is not connected

(function () {
  document.getElementById('user-name').textContent = 'Member';
  document.getElementById('welcome-text').textContent =
    'Welcome back! Manage your memberships and classes below.';

  document.getElementById('logout-btn').addEventListener('click', () => {
    window.location.href = '/';
  });

  // Memberships
  async function loadMemberships() {
    try {
      const res = await fetch('/api/memberships');
      const data = await res.json();
      const tbody = document.querySelector('#memberships-table tbody');
      const empty = document.getElementById('memberships-empty');

      if (data.length === 0) {
        tbody.innerHTML = '';
        empty.style.display = 'block';
        return;
      }
      empty.style.display = 'none';

      tbody.innerHTML = data.map(m => {
        const isActive = new Date(m.expire_date) >= new Date();
        return `<tr>
          <td>${m.name}</td>
          <td style="text-transform:capitalize">${m.type}</td>
          <td>$${Number(m.price).toFixed(2)}</td>
          <td>${m.start_date}</td>
          <td>${m.expire_date}</td>
          <td><span class="badge ${isActive ? 'badge-active' : 'badge-expired'}">${isActive ? 'Active' : 'Expired'}</span></td>
        </tr>`;
      }).join('');
    } catch {
      document.getElementById('memberships-empty').style.display = 'block';
    }
  }

  // Classes

  let classesData = [];

  async function loadClasses() {
    try {
      const res = await fetch('/api/classes');
      classesData = await res.json();
      const tbody = document.querySelector('#classes-table tbody');
      const empty = document.getElementById('classes-empty');

      if (classesData.length === 0) {
        tbody.innerHTML = '';
        empty.style.display = 'block';
        return;
      }
      empty.style.display = 'none';

      tbody.innerHTML = classesData.map(c => {
        const dt = new Date(c.date_time).toLocaleString();
        return `<tr>
          <td>${c.class_name}</td>
          <td>${c.instructor_first || 'TBD'} ${c.instructor_last || ''}</td>
          <td>${dt}</td>
          <td>${c.num_members}</td>
          <td><button class="btn btn-outline btn-sm" onclick="bookClass(${c.class_id})">Book</button></td>
        </tr>`;
      }).join('');
    } catch {
      document.getElementById('classes-empty').style.display = 'block';
    }
  }

  // Book Now modal
  const bookingModal = document.getElementById('booking-modal');

  document.getElementById('book-now-btn').addEventListener('click', () => {
    const select = document.getElementById('booking-class');
    if (classesData.length === 0) {
      select.innerHTML = '<option value="" disabled selected>No classes available</option>';
    } else {
      select.innerHTML = '<option value="" disabled selected>Choose a class...</option>' +
        classesData.map(c => {
          const dt = new Date(c.date_time).toLocaleString();
          return `<option value="${c.class_id}">${c.class_name} — ${dt}</option>`;
        }).join('');
    }
    bookingModal.classList.add('active');
  });

  document.getElementById('cancel-booking').addEventListener('click', () => {
    bookingModal.classList.remove('active');
  });
  bookingModal.addEventListener('click', (e) => {
    if (e.target === bookingModal) bookingModal.classList.remove('active');
  });

  document.getElementById('booking-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const classId = document.getElementById('booking-class').value;
    if (!classId) return;

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ member_id: 1, class_id: Number(classId) })
      });
      if (res.ok) {
        bookingModal.classList.remove('active');
        loadBookings();
        loadClasses();
      }
    } catch { /* backend not connected yet */ }
  });

  window.bookClass = async function (classId) {
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ member_id: 1, class_id: classId })
      });
      if (res.ok) {
        loadBookings();
        loadClasses();
      }
    } catch { /* backend not connected yet */ }
  };

  // Bookings

  async function loadBookings() {
    try {
      const res = await fetch('/api/bookings');
      const data = await res.json();
      const tbody = document.querySelector('#bookings-table tbody');
      const empty = document.getElementById('bookings-empty');

      if (data.length === 0) {
        tbody.innerHTML = '';
        empty.style.display = 'block';
        return;
      }
      empty.style.display = 'none';

      tbody.innerHTML = data.map(b => {
        const classDate = new Date(b.date_time).toLocaleString();
        const bookedAt = new Date(b.booking_time).toLocaleString();
        const badgeClass = `badge-${b.status}`;
        return `<tr>
          <td>${b.class_name || 'Class #' + b.class_id}</td>
          <td>${b.instructor_first || 'TBD'} ${b.instructor_last || ''}</td>
          <td>${classDate}</td>
          <td>${bookedAt}</td>
          <td><span class="badge ${badgeClass}">${b.status}</span></td>
          <td>${b.status === 'confirmed' ? `<button class="btn btn-danger btn-sm" onclick="cancelBooking(${b.booking_id})">Cancel</button>` : ''}</td>
        </tr>`;
      }).join('');
    } catch {
      document.getElementById('bookings-empty').style.display = 'block';
    }
  }

  window.cancelBooking = async function (bookingId) {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, { method: 'DELETE' });
      if (res.ok) loadBookings();
    } catch { /* backend not connected yet */ }
  };

  // Initial load
  loadMemberships();
  loadClasses();
  loadBookings();
})();
