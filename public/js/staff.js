// Flying Frogs - Staff Dashboard Logic

// public/staff.js
(function () {
  // Auth check
  const userEmail = sessionStorage.getItem('userEmail');
  const userName = sessionStorage.getItem('userName') || 'Staff';
  
  // Redirect to login if no user info
  if (!userEmail) {
    window.location.href = '/login';
    return;
  }

  // Display user email
  const userNameElement = document.getElementById('user-name');
  if (userNameElement) {
    userNameElement.textContent = userEmail;
  }
  
  document.getElementById('welcome-text').textContent = `Welcome, ${userEmail}. Manage members, instructors, classes, and memberships below.`;

  document.getElementById('logout-btn').addEventListener('click', () => {
    sessionStorage.clear();
    window.location.href = '/login';
  });

  // Pricing data
  const PRICES = {
    'Basic Plan':    { monthly: 19.99, quarterly: 49.99, annual: 179.99 },
    'Standard Plan': { monthly: 34.99, quarterly: 89.99, annual: 329.99 },
    'Premium Plan':  { monthly: 54.99, quarterly: 139.99, annual: 499.99 },
  };

  // Global data stores
  let membersData = [];
  let instructorsData = [];
  let classesData = [];

  // ============ MODAL HELPERS ============
  function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
  }

  function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
  }

  // ============ MEMBERS ============
  async function loadMembers(query = '') {
    try {
      const res = await fetch('/api/members');
      membersData = await res.json();
      
      let filtered = membersData;
      if (query) {
        const q = query.toLowerCase();
        filtered = membersData.filter(m => 
          m.first_name.toLowerCase().includes(q) ||
          m.last_name.toLowerCase().includes(q) ||
          m.email.toLowerCase().includes(q)
        );
      }
      
      renderMembersTable(filtered);
    } catch {
      document.getElementById('members-tbody').innerHTML = 
        '<tr><td colspan="6" class="error">Error loading members</td></tr>';
    }
  }

  function renderMembersTable(members) {
    const tbody = document.getElementById('members-tbody');
    if (!members.length) {
      tbody.innerHTML = '<tr><td colspan="6">No members found.</td></tr>';
      return;
    }
    tbody.innerHTML = members.map(m => `
      <tr>
        <td>${m.member_id}</td>
        <td>${escapeHtml(m.first_name)} ${escapeHtml(m.last_name)}</td>
        <td>${escapeHtml(m.email)}</td>
        <td>${m.phone}</td>
        <td>${m.dob}</td>
        <td>
          <button class="btn btn-outline btn-sm" onclick="editMember(${m.member_id})">Edit</button>
          <button class="btn btn-outline btn-sm" onclick="viewMemberMemberships(${m.member_id})">Memberships</button>
          <button class="btn btn-danger btn-sm" onclick="deleteMember(${m.member_id})">Delete</button>
        </td>
      </tr>
    `).join('');
  }

  // Member search
  document.getElementById('search-btn').addEventListener('click', () => {
    const q = document.getElementById('member-search').value.trim();
    loadMembers(q);
  });

  document.getElementById('member-search').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const q = e.target.value.trim();
      loadMembers(q);
    }
  });

  document.getElementById('show-all-btn').addEventListener('click', () => {
    document.getElementById('member-search').value = '';
    loadMembers();
  });

  // Add Member
  document.getElementById('add-member-btn').addEventListener('click', () => {
    document.getElementById('member-modal-title').textContent = 'Add New Member';
    document.getElementById('member-submit-btn').textContent = 'Add Member';
    document.getElementById('member-id').value = '';
    document.getElementById('member-form').reset();
    openModal('member-modal');
  });

  document.getElementById('cancel-member').addEventListener('click', () => closeModal('member-modal'));
  document.getElementById('member-modal').addEventListener('click', (e) => {
    if (e.target === document.getElementById('member-modal')) closeModal('member-modal');
  });

  document.getElementById('member-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('member-id').value;
    const data = {
      first_name: document.getElementById('member-first').value,
      last_name: document.getElementById('member-last').value,
      email: document.getElementById('member-email').value,
      phone: document.getElementById('member-phone').value,
      dob: document.getElementById('member-dob').value
    };

    try {
      const url = id ? `/api/members/${id}` : '/api/members';
      const method = id ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (res.ok) {
        closeModal('member-modal');
        loadMembers();
        loadMemberDropdown();
        alert(id ? 'Member updated successfully!' : 'Member added successfully!');
      } else {
        const error = await res.text();
        alert('Error: ' + error);
      }
    } catch {
      alert('Error saving member');
    }
  });

  // Edit Member
  window.editMember = function(id) {
    const member = membersData.find(m => m.member_id === id);
    if (!member) return;
    
    document.getElementById('member-modal-title').textContent = 'Edit Member';
    document.getElementById('member-submit-btn').textContent = 'Update Member';
    document.getElementById('member-id').value = member.member_id;
    document.getElementById('member-first').value = member.first_name;
    document.getElementById('member-last').value = member.last_name;
    document.getElementById('member-email').value = member.email;
    document.getElementById('member-phone').value = member.phone;
    document.getElementById('member-dob').value = member.dob;
    openModal('member-modal');
  };

  // Delete Member
  window.deleteMember = async function(id) {
    if (!confirm('Are you sure you want to delete this member? This will also delete their memberships and bookings.')) return;
    try {
      const res = await fetch(`/api/members/${id}`, { method: 'DELETE' });
      if (res.ok) {
        loadMembers();
        loadMemberships();
        loadMemberDropdown();
        alert('Member deleted successfully!');
      } else {
        alert('Error deleting member');
      }
    } catch {
      alert('Error deleting member');
    }
  };

  // View Member Memberships
  window.viewMemberMemberships = async function(memberId) {
    try {
      const res = await fetch('/api/memberships');
      const allMemberships = await res.json();
      const memberMemberships = allMemberships.filter(m => m.member_id === memberId);
      const member = membersData.find(m => m.member_id === memberId);
      const memberName = member ? `${member.first_name} ${member.last_name}` : `Member #${memberId}`;
      
      const content = document.getElementById('member-memberships-content');
      
      if (memberMemberships.length === 0) {
        content.innerHTML = `<p>${memberName} has no memberships.</p>`;
      } else {
        content.innerHTML = `
          <h4>${escapeHtml(memberName)}'s Memberships</h4>
          <table style="width:100%; margin-top:1rem;">
            <thead>
              <tr>
                <th>ID</th>
                <th>Plan</th>
                <th>Type</th>
                <th>Price</th>
                <th>Start</th>
                <th>Expires</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${memberMemberships.map(m => {
                const isActive = new Date(m.expire_date) >= new Date();
                return `<tr>
                  <td>${m.membership_id}</td>
                  <td>${escapeHtml(m.name)}</td>
                  <td style="text-transform:capitalize">${m.type}</td>
                  <td>$${Number(m.price).toFixed(2)}</td>
                  <td>${m.start_date}</td>
                  <td>${m.expire_date}</td>
                  <td><span class="badge ${isActive ? 'badge-active' : 'badge-expired'}">${isActive ? 'Active' : 'Expired'}</span></td>
                </tr>`;
              }).join('')}
            </tbody>
          </table>
        `;
      }
      
      openModal('member-memberships-modal');
    } catch {
      alert('Error loading member memberships');
    }
  };

  document.getElementById('close-member-memberships').addEventListener('click', () => closeModal('member-memberships-modal'));
  document.getElementById('member-memberships-modal').addEventListener('click', (e) => {
    if (e.target === document.getElementById('member-memberships-modal')) closeModal('member-memberships-modal');
  });

  // ============ INSTRUCTORS ============
  async function loadInstructors(query = '') {
    try {
      const res = await fetch('/api/instructors');
      instructorsData = await res.json();
      
      let filtered = instructorsData;
      if (query) {
        const q = query.toLowerCase();
        filtered = instructorsData.filter(i => 
          i.first_name.toLowerCase().includes(q) ||
          i.last_name.toLowerCase().includes(q) ||
          i.email.toLowerCase().includes(q)
        );
      }
      
      renderInstructorsTable(filtered);
      updateInstructorDropdowns();
    } catch {
      document.getElementById('instructors-tbody').innerHTML = 
        '<tr><td colspan="7" class="error">Error loading instructors</td></tr>';
    }
  }

  function renderInstructorsTable(instructors) {
    const tbody = document.getElementById('instructors-tbody');
    if (!instructors.length) {
      tbody.innerHTML = '<tr><td colspan="7">No instructors found. Add one to assign classes.</td></tr>';
      return;
    }
    tbody.innerHTML = instructors.map(i => {
      const statusClass = i.status === 'active' ? 'badge-active' : 
                          i.status === 'on_leave' ? 'badge-warning' : 'badge-expired';
      return `
      <tr>
        <td>${i.instructor_id}</td>
        <td>${escapeHtml(i.first_name)} ${escapeHtml(i.last_name)}</td>
        <td>${escapeHtml(i.email)}</td>
        <td>${i.phone}</td>
        <td>${i.dob}</td>
        <td><span class="badge ${statusClass}">${i.status.replace('_', ' ')}</span></td>
        <td>
          <button class="btn btn-outline btn-sm" onclick="editInstructor(${i.instructor_id})">Edit</button>
          <button class="btn btn-outline btn-sm" onclick="viewInstructorClasses(${i.instructor_id})">Classes</button>
          <button class="btn btn-danger btn-sm" onclick="deleteInstructor(${i.instructor_id})">Delete</button>
        </td>
      </tr>
    `}).join('');
  }

  function updateInstructorDropdowns() {
    const select = document.getElementById('class-instructor');
    if (select) {
      select.innerHTML = '<option value="">Select an instructor...</option>' +
        instructorsData.map(i => `<option value="${i.instructor_id}">${i.first_name} ${i.last_name}</option>`).join('');
    }
  }

  // Instructor search
  document.getElementById('instructor-search-btn').addEventListener('click', () => {
    const q = document.getElementById('instructor-search').value.trim();
    loadInstructors(q);
  });

  document.getElementById('instructor-search').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const q = e.target.value.trim();
      loadInstructors(q);
    }
  });

  document.getElementById('show-all-instructors-btn').addEventListener('click', () => {
    document.getElementById('instructor-search').value = '';
    loadInstructors();
  });

  // Add Instructor
  document.getElementById('add-instructor-btn').addEventListener('click', () => {
    document.getElementById('instructor-modal-title').textContent = 'Add New Instructor';
    document.getElementById('instructor-submit-btn').textContent = 'Add Instructor';
    document.getElementById('instructor-id').value = '';
    document.getElementById('instructor-form').reset();
    openModal('instructor-modal');
  });

  document.getElementById('cancel-instructor').addEventListener('click', () => closeModal('instructor-modal'));
  document.getElementById('instructor-modal').addEventListener('click', (e) => {
    if (e.target === document.getElementById('instructor-modal')) closeModal('instructor-modal');
  });

  document.getElementById('instructor-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('instructor-id').value;
    const data = {
      first_name: document.getElementById('instructor-first').value,
      last_name: document.getElementById('instructor-last').value,
      email: document.getElementById('instructor-email').value,
      phone: document.getElementById('instructor-phone').value,
      dob: document.getElementById('instructor-dob').value,
      status: document.getElementById('instructor-status').value
    };

    try {
      const url = id ? `/api/instructors/${id}` : '/api/instructors';
      const method = id ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (res.ok) {
        closeModal('instructor-modal');
        loadInstructors();
        alert(id ? 'Instructor updated successfully!' : 'Instructor added successfully!');
      } else {
        const error = await res.text();
        alert('Error: ' + error);
      }
    } catch {
      alert('Error saving instructor');
    }
  });

  // Edit Instructor
  window.editInstructor = function(id) {
    const instructor = instructorsData.find(i => i.instructor_id === id);
    if (!instructor) return;
    
    document.getElementById('instructor-modal-title').textContent = 'Edit Instructor';
    document.getElementById('instructor-submit-btn').textContent = 'Update Instructor';
    document.getElementById('instructor-id').value = instructor.instructor_id;
    document.getElementById('instructor-first').value = instructor.first_name;
    document.getElementById('instructor-last').value = instructor.last_name;
    document.getElementById('instructor-email').value = instructor.email;
    document.getElementById('instructor-phone').value = instructor.phone;
    document.getElementById('instructor-dob').value = instructor.dob;
    document.getElementById('instructor-status').value = instructor.status;
    openModal('instructor-modal');
  };

  // Delete Instructor
  window.deleteInstructor = async function(id) {
    if (!confirm('Are you sure you want to delete this instructor? This will also delete their classes and bookings.')) return;
    try {
      const res = await fetch(`/api/instructors/${id}`, { method: 'DELETE' });
      if (res.ok) {
        loadInstructors();
        loadClasses();
        alert('Instructor deleted successfully!');
      } else {
        alert('Error deleting instructor');
      }
    } catch {
      alert('Error deleting instructor');
    }
  };

  // View Instructor Classes
  window.viewInstructorClasses = async function(instructorId) {
    try {
      const res = await fetch('/api/classes');
      const allClasses = await res.json();
      const instructorClasses = allClasses.filter(c => c.instructor_id === instructorId);
      const instructor = instructorsData.find(i => i.instructor_id === instructorId);
      const instructorName = instructor ? `${instructor.first_name} ${instructor.last_name}` : `Instructor #${instructorId}`;
      
      const content = document.getElementById('instructor-classes-content');
      
      if (instructorClasses.length === 0) {
        content.innerHTML = `<p>${escapeHtml(instructorName)} has no classes assigned.</p>`;
      } else {
        content.innerHTML = `
          <h4>${escapeHtml(instructorName)}'s Classes</h4>
          <table style="width:100%; margin-top:1rem;">
            <thead>
              <tr>
                <th>ID</th>
                <th>Class Name</th>
                <th>Date & Time</th>
                <th>Enrolled</th>
              </tr>
            </thead>
            <tbody>
              ${instructorClasses.map(c => {
                const dt = new Date(c.date_time).toLocaleString();
                return `<tr>
                  <td>${c.class_id}</td>
                  <td>${escapeHtml(c.class_name)}</td>
                  <td>${dt}</td>
                  <td>${c.num_members || 0}</td>
                </tr>`;
              }).join('')}
            </tbody>
          </table>
        `;
      }
      
      openModal('instructor-classes-modal');
    } catch {
      alert('Error loading instructor classes');
    }
  };

  document.getElementById('close-instructor-classes').addEventListener('click', () => closeModal('instructor-classes-modal'));
  document.getElementById('instructor-classes-modal').addEventListener('click', (e) => {
    if (e.target === document.getElementById('instructor-classes-modal')) closeModal('instructor-classes-modal');
  });

  // ============ CLASSES ============
  async function loadClasses() {
    try {
      const res = await fetch('/api/classes');
      classesData = await res.json();
      const tbody = document.getElementById('classes-tbody');

      if (classesData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6">No classes yet. Add an instructor first, then create a class.</td></tr>';
        return;
      }

      tbody.innerHTML = classesData.map(c => {
        const instructor = instructorsData.find(i => i.instructor_id === c.instructor_id);
        const instructorName = instructor ? `${instructor.first_name} ${instructor.last_name}` : `ID: ${c.instructor_id}`;
        const dt = new Date(c.date_time).toLocaleString();
        return `<tr>
          <td>${c.class_id}</td>
          <td>${escapeHtml(c.class_name)}</td>
          <td>${escapeHtml(instructorName)}</td>
          <td>${dt}</td>
          <td>${c.num_members || 0}</td>
          <td>
            <button class="btn btn-outline btn-sm" onclick="editClass(${c.class_id})">Edit</button>
            <button class="btn btn-danger btn-sm" onclick="deleteClass(${c.class_id})">Delete</button>
          </td>
        </tr>`;
      }).join('');
    } catch {
      document.getElementById('classes-tbody').innerHTML = 
        '<tr><td colspan="6" class="error">Error loading classes</td></tr>';
    }
  }

  // Add Class
  document.getElementById('add-class-btn').addEventListener('click', () => {
    if (instructorsData.length === 0) {
      alert('Please add an instructor first before creating a class.');
      return;
    }
    document.getElementById('class-modal-title').textContent = 'Create New Class';
    document.getElementById('class-submit-btn').textContent = 'Create Class';
    document.getElementById('class-id').value = '';
    document.getElementById('class-form').reset();
    updateInstructorDropdowns();
    openModal('class-modal');
  });

  document.getElementById('cancel-class').addEventListener('click', () => closeModal('class-modal'));
  document.getElementById('class-modal').addEventListener('click', (e) => {
    if (e.target === document.getElementById('class-modal')) closeModal('class-modal');
  });

  document.getElementById('class-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('class-id').value;
    const data = {
      class_name: document.getElementById('class-name').value,
      instructor_id: Number(document.getElementById('class-instructor').value),
      date_time: document.getElementById('class-datetime').value
    };

    try {
      const url = id ? `/api/classes/${id}` : '/api/classes';
      const method = id ? 'PUT' : 'POST';
      
      const body = id ? {
        instructor_id: data.instructor_id,
        name: data.class_name,
        schedule: data.date_time,
        capacity: classesData.find(c => c.class_id === Number(id))?.num_members || 0
      } : data;
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      
      if (res.ok) {
        closeModal('class-modal');
        loadClasses();
        alert(id ? 'Class updated successfully!' : 'Class created successfully!');
      } else {
        alert('Error saving class');
      }
    } catch {
      alert('Error saving class');
    }
  });

  // Edit Class
  window.editClass = async function(id) {
    try {
      const res = await fetch(`/api/classes/${id}`);
      const cls = await res.json();
      if (!cls) return;
      
      updateInstructorDropdowns();
      
      document.getElementById('class-modal-title').textContent = 'Edit Class';
      document.getElementById('class-submit-btn').textContent = 'Update Class';
      document.getElementById('class-id').value = cls.class_id;
      document.getElementById('class-name').value = cls.class_name;
      document.getElementById('class-instructor').value = cls.instructor_id;
      
      if (cls.date_time) {
        const dt = cls.date_time.replace(' ', 'T');
        document.getElementById('class-datetime').value = dt.slice(0, 16);
      }
      
      openModal('class-modal');
    } catch {
      alert('Error loading class');
    }
  };

  // Delete Class
  window.deleteClass = async function(id) {
    if (!confirm('Delete this class? Bookings for this class will also be deleted.')) return;
    try {
      const res = await fetch(`/api/classes/${id}`, { method: 'DELETE' });
      if (res.ok) {
        loadClasses();
        alert('Class deleted successfully!');
      } else {
        alert('Error deleting class');
      }
    } catch {
      alert('Error deleting class');
    }
  };

  // ============ MEMBERSHIPS ============
  async function loadMemberDropdown() {
    try {
      const res = await fetch('/api/members');
      const members = await res.json();
      const select = document.getElementById('mem-member');
      select.innerHTML = '<option value="">Select a member...</option>' +
        members.map(m => `<option value="${m.member_id}">${m.first_name} ${m.last_name} (ID: ${m.member_id})</option>`).join('');
    } catch {
      console.error('Error loading members for dropdown');
    }
  }

  // Update price when plan/type changes
  document.getElementById('mem-name').addEventListener('change', updatePrice);
  document.getElementById('mem-type').addEventListener('change', updatePrice);

  function updatePrice() {
    const name = document.getElementById('mem-name').value;
    const type = document.getElementById('mem-type').value;
    if (name && type && PRICES[name] && PRICES[name][type]) {
      document.getElementById('mem-price').value = PRICES[name][type];
    }
  }

  async function loadMemberships() {
    try {
      const res = await fetch('/api/memberships');
      const data = await res.json();
      const tbody = document.getElementById('memberships-tbody');

      if (data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9">No memberships found. Add a member first, then create a membership.</td></tr>';
        return;
      }

      // Load members for names
      await loadMembers('');

      tbody.innerHTML = data.map(m => {
        const member = membersData.find(mem => mem.member_id === m.member_id);
        const memberName = member ? `${member.first_name} ${member.last_name}` : `ID: ${m.member_id}`;
        const isActive = new Date(m.expire_date) >= new Date();
        return `<tr>
          <td>${m.membership_id}</td>
          <td>${escapeHtml(memberName)}</td>
          <td>${m.name}</td>
          <td style="text-transform:capitalize">${m.type}</td>
          <td>$${Number(m.price).toFixed(2)}</td>
          <td>${m.start_date}</td>
          <td>${m.expire_date}</td>
          <td><span class="badge ${isActive ? 'badge-active' : 'badge-expired'}">${isActive ? 'Active' : 'Expired'}</span></td>
          <td>
            <button class="btn btn-outline btn-sm" onclick="editMembership(${m.membership_id})">Edit</button>
            <button class="btn btn-danger btn-sm" onclick="deleteMembership(${m.membership_id})">Delete</button>
          </td>
        </tr>`;
      }).join('');
    } catch {
      document.getElementById('memberships-tbody').innerHTML = 
        '<tr><td colspan="9" class="error">Error loading memberships</td></tr>';
    }
  }

  // Add Membership
  document.getElementById('add-membership-btn').addEventListener('click', () => {
    document.getElementById('membership-modal-title').textContent = 'Add Membership';
    document.getElementById('membership-submit-btn').textContent = 'Add Membership';
    document.getElementById('membership-id').value = '';
    document.getElementById('membership-form').reset();
    document.getElementById('mem-start').value = new Date().toISOString().split('T')[0];
    loadMemberDropdown();
    openModal('membership-modal');
  });

  document.getElementById('cancel-membership').addEventListener('click', () => closeModal('membership-modal'));
  document.getElementById('membership-modal').addEventListener('click', (e) => {
    if (e.target === document.getElementById('membership-modal')) closeModal('membership-modal');
  });

  document.getElementById('membership-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('membership-id').value;
    const data = {
      member_id: Number(document.getElementById('mem-member').value),
      name: document.getElementById('mem-name').value,
      price: Number(document.getElementById('mem-price').value),
      type: document.getElementById('mem-type').value,
      start_date: document.getElementById('mem-start').value,
      expire_date: document.getElementById('mem-expire').value
    };

    try {
      const url = id ? `/api/memberships/${id}` : '/api/memberships';
      const method = id ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (res.ok) {
        closeModal('membership-modal');
        loadMemberships();
        alert(id ? 'Membership updated successfully!' : 'Membership added successfully!');
      } else {
        alert('Error saving membership');
      }
    } catch {
      alert('Error saving membership');
    }
  });

  // Edit Membership
  window.editMembership = async function(id) {
    try {
      const res = await fetch(`/api/memberships/${id}`);
      const membership = await res.json();
      if (!membership) return;
      
      await loadMemberDropdown();
      
      document.getElementById('membership-modal-title').textContent = 'Edit Membership';
      document.getElementById('membership-submit-btn').textContent = 'Update Membership';
      document.getElementById('membership-id').value = membership.membership_id;
      document.getElementById('mem-member').value = membership.member_id;
      document.getElementById('mem-name').value = membership.name;
      document.getElementById('mem-type').value = membership.type;
      document.getElementById('mem-price').value = membership.price;
      document.getElementById('mem-start').value = membership.start_date;
      document.getElementById('mem-expire').value = membership.expire_date;
      
      openModal('membership-modal');
    } catch {
      alert('Error loading membership');
    }
  };

  // Delete Membership
  window.deleteMembership = async function(id) {
    if (!confirm('Delete this membership?')) return;
    try {
      const res = await fetch(`/api/memberships/${id}`, { method: 'DELETE' });
      if (res.ok) {
        loadMemberships();
        alert('Membership deleted successfully!');
      } else {
        alert('Error deleting membership');
      }
    } catch {
      alert('Error deleting membership');
    }
  };

  // ============ HELPER ============
  function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // ============ INITIAL LOAD ============
  loadMembers();
  loadInstructors();
  loadClasses();
  loadMemberDropdown();
  loadMemberships();
})();