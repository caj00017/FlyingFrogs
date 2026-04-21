// Flying Frogs - Staff Dashboard Logic
// Functions do not work yet as the backend is not connected


(function () {
  document.getElementById('user-name').textContent = 'Staff';
  document.getElementById('welcome-text').textContent =
    'Welcome. Manage members, memberships, and classes below.';

  document.getElementById('logout-btn').addEventListener('click', () => {
    window.location.href = '/';
  });

  const PRICES = {
    'Basic Plan':    { monthly: 19.99, quarterly: 49.99, annual: 179.99 },
    'Standard Plan': { monthly: 34.99, quarterly: 89.99, annual: 329.99 },
    'Premium Plan':  { monthly: 54.99, quarterly: 139.99, annual: 499.99 },
  };

  // Members

  async function loadMembers(query) {
    let url = '/api/members';
    if (query) url = `/api/members/search/${encodeURIComponent(query)}`;

    const res = await fetch(url);
    const data = await res.json();
    const tbody = document.querySelector('#members-table tbody');
    const empty = document.getElementById('members-empty');

    if (data.length === 0) {
      tbody.innerHTML = '';
      empty.style.display = 'block';
      return;
    }
    empty.style.display = 'none';

    tbody.innerHTML = data.map(m => `<tr>
      <td>${m.member_id}</td>
      <td>${m.first_name} ${m.last_name}</td>
      <td>${m.email}</td>
      <td>${m.phone}</td>
      <td>${m.dob}</td>
      <td>${m.membership || '<span class="badge badge-expired">None</span>'}</td>
      <td>
        <button class="btn btn-outline btn-sm" onclick="viewMemberMemberships(${m.member_id})">View</button>
      </td>
    </tr>`).join('');
  }

  document.getElementById('search-btn').addEventListener('click', () => {
    const q = document.getElementById('member-search').value.trim();
    if (q) loadMembers(q);
  });

  document.getElementById('member-search').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const q = e.target.value.trim();
      if (q) loadMembers(q);
    }
  });

  document.getElementById('show-all-btn').addEventListener('click', () => {
    document.getElementById('member-search').value = '';
    loadMembers();
  });

  window.viewMemberMemberships = async function (memberId) {
    const res = await fetch(`/api/members/${memberId}/memberships`);
    const data = await res.json();

    if (data.length === 0) {
      alert(`Member #${memberId} has no memberships.`);
      return;
    }

    let info = `Memberships for Member #${memberId}:\n\n`;
    data.forEach(m => {
      const status = new Date(m.expire_date) >= new Date() ? 'Active' : 'Expired';
      info += `• ${m.name} (${m.type}) — $${Number(m.price).toFixed(2)} — ${m.start_date} to ${m.expire_date} [${status}]\n`;
    });
    alert(info);
  };

  // Memberships

  async function loadMemberships() {
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
        <td>${m.membership_id}</td>
        <td>${m.member_id}</td>
        <td>${m.name}</td>
        <td style="text-transform:capitalize">${m.type}</td>
        <td>$${Number(m.price).toFixed(2)}</td>
        <td>${m.start_date}</td>
        <td>${m.expire_date}</td>
        <td><span class="badge ${isActive ? 'badge-active' : 'badge-expired'}">${isActive ? 'Active' : 'Expired'}</span></td>
        <td>
          <button class="btn btn-secondary btn-sm" onclick="editMembership(${m.membership_id}, ${m.member_id}, '${m.name}', '${m.type}', '${m.start_date}', '${m.expire_date}')">Edit</button>
          <button class="btn btn-danger btn-sm" onclick="removeMembership(${m.membership_id})">Delete</button>
        </td>
      </tr>`;
    }).join('');
  }

  // Create membership modal
  const staffMemModal = document.getElementById('staff-membership-modal');
  document.getElementById('new-staff-membership-btn').addEventListener('click', () => {
    staffMemModal.classList.add('active');
    document.getElementById('staff-mem-start').value = new Date().toISOString().split('T')[0];
  });
  document.getElementById('cancel-staff-membership').addEventListener('click', () => {
    staffMemModal.classList.remove('active');
  });
  staffMemModal.addEventListener('click', (e) => {
    if (e.target === staffMemModal) staffMemModal.classList.remove('active');
  });

  document.getElementById('staff-membership-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('staff-mem-name').value;
    const type = document.getElementById('staff-mem-type').value;
    const body = {
      member_id: Number(document.getElementById('staff-mem-member-id').value),
      name,
      price: PRICES[name][type],
      type,
      start_date: document.getElementById('staff-mem-start').value,
      expire_date: document.getElementById('staff-mem-expire').value,
    };

    const res = await fetch('/api/memberships', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (res.ok) {
      staffMemModal.classList.remove('active');
      document.getElementById('staff-membership-form').reset();
      loadMemberships();
    }
  });

  // Edit membership modal
  const editMemModal = document.getElementById('edit-membership-modal');

  window.editMembership = function (id, memberId, name, type, start, expire) {
    document.getElementById('edit-mem-id').value = id;
    document.getElementById('edit-mem-member-id').value = memberId;
    document.getElementById('edit-mem-name').value = name;
    document.getElementById('edit-mem-type').value = type;
    document.getElementById('edit-mem-start').value = start;
    document.getElementById('edit-mem-expire').value = expire;
    editMemModal.classList.add('active');
  };

  document.getElementById('cancel-edit-membership').addEventListener('click', () => {
    editMemModal.classList.remove('active');
  });
  editMemModal.addEventListener('click', (e) => {
    if (e.target === editMemModal) editMemModal.classList.remove('active');
  });

  document.getElementById('edit-membership-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('edit-mem-id').value;
    const name = document.getElementById('edit-mem-name').value;
    const type = document.getElementById('edit-mem-type').value;
    const body = {
      member_id: Number(document.getElementById('edit-mem-member-id').value),
      name,
      price: PRICES[name][type],
      type,
      start_date: document.getElementById('edit-mem-start').value,
      expire_date: document.getElementById('edit-mem-expire').value,
    };

    const res = await fetch(`/api/memberships/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (res.ok) {
      editMemModal.classList.remove('active');
      loadMemberships();
    }
  });

  window.removeMembership = async function (id) {
    if (!confirm('Are you sure you want to delete this membership?')) return;
    const res = await fetch(`/api/memberships/${id}`, { method: 'DELETE' });
    if (res.ok) loadMemberships();
  };

  // Classes

  async function loadClasses() {
    const res = await fetch('/api/classes');
    const data = await res.json();
    const tbody = document.querySelector('#classes-table tbody');
    const empty = document.getElementById('classes-empty');

    if (data.length === 0) {
      tbody.innerHTML = '';
      empty.style.display = 'block';
      return;
    }
    empty.style.display = 'none';

    tbody.innerHTML = data.map(c => {
      const dt = new Date(c.date_time).toLocaleString();
      return `<tr>
        <td>${c.class_id}</td>
        <td>${c.class_name}</td>
        <td>${c.instructor_first} ${c.instructor_last}</td>
        <td>${dt}</td>
        <td>${c.num_members}</td>
        <td><button class="btn btn-danger btn-sm" onclick="removeClass(${c.class_id})">Delete</button></td>
      </tr>`;
    }).join('');
  }

  // Create class modal
  const classModal = document.getElementById('class-modal');
  document.getElementById('new-class-btn').addEventListener('click', () => {
    classModal.classList.add('active');
  });
  document.getElementById('cancel-class').addEventListener('click', () => {
    classModal.classList.remove('active');
  });
  classModal.addEventListener('click', (e) => {
    if (e.target === classModal) classModal.classList.remove('active');
  });

  document.getElementById('class-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const body = {
      class_name: document.getElementById('class-name').value,
      instructor_id: user.instructor_id,
      date_time: document.getElementById('class-datetime').value,
    };

    const res = await fetch('/api/classes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (res.ok) {
      classModal.classList.remove('active');
      document.getElementById('class-form').reset();
      loadClasses();
    }
  });

  window.removeClass = async function (id) {
    if (!confirm('Are you sure you want to delete this class?')) return;
    const res = await fetch(`/api/classes/${id}`, { method: 'DELETE' });
    if (res.ok) loadClasses();
  };

  // Initial load
  loadMembers();
  loadMemberships();
  loadClasses();
})();
