// Flying Frogs - Member Dashboard Logic

// public/member.js
(function () {
  // Get user info from sessionStorage
  const userEmail = sessionStorage.getItem('userEmail');
  const userName = sessionStorage.getItem('userName') || 'Member';
  
  // Redirect to login if no user info
  if (!userEmail) {
    window.location.href = '/login';
    return;
  }

  // Display user email in navbar
  const userNameElement = document.getElementById('user-name');
  if (userNameElement) {
    userNameElement.textContent = userEmail;
  }
  
  document.getElementById('welcome-text').textContent =
    `Welcome back, ${userEmail}! Manage your memberships and classes below.`;

  document.getElementById('logout-btn').addEventListener('click', () => {
    sessionStorage.clear();
    window.location.href = '/login';
  });

  // Store the current member's ID once we find it
  let currentMemberId = null;
  let classesData = [];
  let allInstructors = [];
  let myMembershipsData = [];
  let myBookingsData = [];
  let allClassesData = [];
  let isInitialized = false;

  // Pagination state
  const ITEMS_PER_PAGE = 10;
  let currentPages = {
    memberships: 1,
    classes: 1,
    bookings: 1
  };

  // ============ PAGINATION HELPER ============
  function renderPagination(tableId, totalItems, currentPage, onPageChange) {
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    if (totalPages <= 1) return '';

    let html = '<div class="pagination">';
    html += `<button ${currentPage === 1 ? 'disabled' : ''} onclick="${onPageChange}(${currentPage - 1})">← Previous</button>`;
    
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
        html += `<button class="${i === currentPage ? 'active' : ''}" onclick="${onPageChange}(${i})">${i}</button>`;
      } else if (i === currentPage - 3 || i === currentPage + 3) {
        html += '<span class="page-info">...</span>';
      }
    }
    
    html += `<button ${currentPage === totalPages ? 'disabled' : ''} onclick="${onPageChange}(${currentPage + 1})">Next →</button>`;
    html += `<span class="page-info">Page ${currentPage} of ${totalPages}</span>`;
    html += '</div>';
    return html;
  }

  function getPaginatedData(data, page) {
    const start = (page - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return data.slice(start, end);
  }

  // Find the member by email
  async function findCurrentMember() {
    try {
      const res = await fetch('/api/members');
      const members = await res.json();
      const currentMember = members.find(m => m.email === userEmail);
      
      if (currentMember) {
        currentMemberId = currentMember.member_id;
        return currentMember;
      } else {
        document.getElementById('memberships-tbody').innerHTML = 
          '<tr><td colspan="6">No member account found for this email. Please contact staff.</td></tr>';
        document.getElementById('classes-tbody').innerHTML = 
          '<tr><td colspan="5">No member account found. Staff need to create your member profile first.</td></tr>';
        document.getElementById('bookings-tbody').innerHTML = 
          '<tr><td colspan="6">No member account found.</td></tr>';
        return null;
      }
    } catch (error) {
      console.error('Error finding member:', error);
      return null;
    }
  }

  // Load Memberships
  async function loadMemberships() {
    if (!currentMemberId) return;
    
    try {
      const res = await fetch('/api/memberships');
      const allMemberships = await res.json();
      // Filter to only show current member's memberships
      myMembershipsData = allMemberships.filter(m => m.member_id === currentMemberId);
      
      currentPages.memberships = 1;
      renderMembershipsTable();
    } catch (error) {
      document.getElementById('memberships-tbody').innerHTML = '<tr><td colspan="6" class="error">Error loading memberships</td></tr>';
    }
  }

  function renderMembershipsTable() {
    const tbody = document.getElementById('memberships-tbody');
    tbody.innerHTML = '';

    if (myMembershipsData.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6">You don\'t have any memberships yet. Contact staff to get set up.</td></tr>';
      document.getElementById('memberships-pagination').innerHTML = '';
      return;
    }

    const paginatedData = getPaginatedData(myMembershipsData, currentPages.memberships);
    
    tbody.innerHTML = paginatedData.map(m => {
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

    document.getElementById('memberships-pagination').innerHTML = 
      renderPagination('memberships', myMembershipsData.length, currentPages.memberships, 'changeMembershipsPage');
  }

  window.changeMembershipsPage = function(page) {
    currentPages.memberships = page;
    renderMembershipsTable();
  };


  // Load Classes
  async function loadClasses() {
    try {
      const [classesRes, instructorsRes] = await Promise.all([
        fetch('/api/classes'),
        fetch('/api/instructors')
      ]);
      
      classesData = await classesRes.json();
      allInstructors = await instructorsRes.json();
      
      currentPages.classes = 1;
      renderClassesTable();
    } catch (error) {
      document.getElementById('classes-tbody').innerHTML = '<tr><td colspan="5" class="error">Error loading classes</td></tr>';
    }
  }

  function renderClassesTable() {
    const tbody = document.getElementById('classes-tbody');
    tbody.innerHTML = '';

    if (classesData.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5">No classes available at this time.</td></tr>';
      document.getElementById('classes-pagination').innerHTML = '';
      return;
    }

    const paginatedData = getPaginatedData(classesData, currentPages.classes);
    
    tbody.innerHTML = paginatedData.map(c => {
      const instructor = allInstructors.find(i => i.instructor_id === c.instructor_id);
      const instructorName = instructor ? `${instructor.first_name} ${instructor.last_name}` : 'TBD';
      const dt = new Date(c.date_time).toLocaleString();
      return `<tr>
        <td>${c.class_name}</td>
        <td>${instructorName}</td>
        <td>${dt}</td>
        <td>${c.num_members || 0}</td>
        <td><button class="btn btn-outline btn-sm" onclick="bookClass(${c.class_id})">Book</button></td>
      </tr>`;
    }).join('');

    document.getElementById('classes-pagination').innerHTML = 
      renderPagination('classes', classesData.length, currentPages.classes, 'changeClassesPage');
  }

  window.changeClassesPage = function(page) {
    currentPages.classes = page;
    renderClassesTable();
  };

  // Load Bookings
  async function loadBookings() {
    if (!currentMemberId) return;
    
    try {
      const [bookingsRes, classesRes] = await Promise.all([
        fetch('/api/bookings'),
        fetch('/api/classes')
      ]);
      
      const allBookings = await bookingsRes.json();
      allClassesData = await classesRes.json();
      
      myBookingsData = allBookings.filter(b => b.member_id === currentMemberId);
      
      currentPages.bookings = 1;
      renderBookingsTable();
    } catch (error) {
      document.getElementById('bookings-tbody').innerHTML = '<tr><td colspan="6" class="error">Error loading bookings</td></tr>';
    }
  }

  function renderBookingsTable() {
    const tbody = document.getElementById('bookings-tbody');
    tbody.innerHTML = '';

    if (myBookingsData.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6">You haven\'t booked any classes yet.</td></tr>';
      document.getElementById('bookings-pagination').innerHTML = '';
      return;
    }

    const paginatedData = getPaginatedData(myBookingsData, currentPages.bookings);
    
    tbody.innerHTML = paginatedData.map(b => {
      const classItem = allClassesData.find(c => c.class_id === b.class_id);
      const instructor = classItem ? allInstructors.find(i => i.instructor_id === classItem.instructor_id) : null;
      const className = classItem ? classItem.class_name : `Class #${b.class_id}`;
      const instructorName = instructor ? `${instructor.first_name} ${instructor.last_name}` : 'TBD';
      const classDate = classItem ? new Date(classItem.date_time).toLocaleString() : 'TBD';
      const bookedAt = new Date(b.booking_time).toLocaleString();
      
      return `<tr>
        <td>${className}</td>
        <td>${instructorName}</td>
        <td>${classDate}</td>
        <td>${bookedAt}</td>
        <td><span class="badge badge-${b.status}">${b.status}</span></td>
        <td>${b.status === 'confirmed' ? `<button class="btn btn-danger btn-sm" onclick="cancelBooking(${b.booking_id})">Cancel</button>` : ''}</td>
      </tr>`;
    }).join('');

    document.getElementById('bookings-pagination').innerHTML = 
      renderPagination('bookings', myBookingsData.length, currentPages.bookings, 'changeBookingsPage');
  }

  window.changeBookingsPage = function(page) {
    currentPages.bookings = page;
    renderBookingsTable();
  };

  // Booking functions
 window.bookClass = async function(classId) {
    if (!currentMemberId) return;
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          member_id: currentMemberId,
          class_id: classId,
          booking_time: new Date().toISOString().replace('T', ' ').slice(0, 19),
          cancellation_time: null,
          status: 'confirmed'
        })
      });
      if (res.ok) {
        // Reload both bookings and classes to update enrollment count
        await Promise.all([loadBookings(), loadClasses()]);
        alert('Class booked successfully!');
      } else {
        const error = await res.json();
        alert('Error: ' + (error.error || 'Could not book class'));
      }
    } catch (error) {
      alert('Error booking class');
    }
  };


  window.cancelBooking = async function(bookingId) {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, { method: 'DELETE' });
      if (res.ok) {
        // Reload both bookings and classes to update enrollment count
        await Promise.all([loadBookings(), loadClasses()]);
        alert('Booking cancelled successfully!');
      }
    } catch (error) {
      alert('Error cancelling booking');
    }
  };

  // Initialize once
  async function initialize() {
    if (isInitialized) return;
    isInitialized = true;
    
    const member = await findCurrentMember();
    if (member) {
      await Promise.all([
        loadMemberships(),
        loadClasses(),
        loadBookings()
      ]);
    }
  }

  initialize();
})();