// public/script.js - Complete Frontend Logic
const API_BASE = '/api';

// Data stores
let members = [];
let memberships = [];
let instructors = [];
let classes = [];
let bookings = [];

// Tab switching
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        
        btn.classList.add('active');
        document.getElementById(btn.dataset.tab).classList.add('active');
        
        refreshActiveTab(btn.dataset.tab);
    });
});

function refreshActiveTab(tabId) {
    switch(tabId) {
        case 'members': loadMembers(); break;
        case 'memberships': loadMemberships(); break;
        case 'instructors': loadInstructors(); break;
        case 'classes': loadClasses(); loadInstructors(); break;
        case 'bookings': loadBookings(); loadMembers(); loadClasses(); break;
    }
}

// Helper Functions
function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

function showModal(content) {
    document.getElementById('modal-body').innerHTML = content;
    document.getElementById('modal').style.display = 'block';
}

// Close modal on outside click
window.onclick = (e) => {
    if (e.target === document.getElementById('modal')) {
        closeModal();
    }
};

// ============ MEMBERS ============
async function loadMembers() {
    try {
        const response = await fetch(`${API_BASE}/members`);
        if (!response.ok) throw new Error('Failed to load members');
        members = await response.json();
        renderMembersTable();
    } catch (error) {
        document.getElementById('members-tbody').innerHTML = 
            '<tr><td colspan="7" class="error">Error loading members</td></tr>';
    }
}

function renderMembersTable() {
    const tbody = document.getElementById('members-tbody');
    if (!members.length) {
        tbody.innerHTML = '<tr><td colspan="7">No members found</td></tr>';
        return;
    }
    tbody.innerHTML = members.map(m => `
        <tr>
            <td>${m.member_id}</td>
            <td>${escapeHtml(m.first_name)}</td>
            <td>${escapeHtml(m.last_name)}</td>
            <td>${escapeHtml(m.email)}</td>
            <td>${m.phone}</td>
            <td>${m.dob}</td>
            <td>
                <button class="btn btn-edit" onclick="editMember(${m.member_id})">Edit</button>
                <button class="btn btn-delete" onclick="deleteMember(${m.member_id})">Delete</button>
            </td>
        </tr>
    `).join('');
}

function showAddMemberModal() {
    showModal(`
        <h2>Add New Member</h2>
        <form id="member-form">
            <div class="form-group">
                <label>First Name</label>
                <input type="text" name="first_name" required>
            </div>
            <div class="form-group">
                <label>Last Name</label>
                <input type="text" name="last_name" required>
            </div>
            <div class="form-group">
                <label>Email</label>
                <input type="email" name="email" required>
            </div>
            <div class="form-group">
                <label>Phone</label>
                <input type="tel" name="phone" required>
            </div>
            <div class="form-group">
                <label>Date of Birth</label>
                <input type="date" name="dob" required>
            </div>
            <button type="submit" class="btn btn-submit">Add Member</button>
        </form>
    `);
    
    document.getElementById('member-form').onsubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        
        try {
            const response = await fetch(`${API_BASE}/members`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (response.ok) {
                closeModal();
                await loadMembers();
                alert('Member added successfully!');
            } else {
                alert('Error adding member');
            }
        } catch (error) {
            alert('Error adding member');
        }
    };
}

function editMember(id) {
    const member = members.find(m => m.member_id === id);
    if (!member) return;
    
    showModal(`
        <h2>Edit Member</h2>
        <form id="member-form">
            <div class="form-group">
                <label>First Name</label>
                <input type="text" name="first_name" value="${escapeHtml(member.first_name)}" required>
            </div>
            <div class="form-group">
                <label>Last Name</label>
                <input type="text" name="last_name" value="${escapeHtml(member.last_name)}" required>
            </div>
            <div class="form-group">
                <label>Email</label>
                <input type="email" name="email" value="${escapeHtml(member.email)}" required>
            </div>
            <div class="form-group">
                <label>Phone</label>
                <input type="tel" name="phone" value="${member.phone}" required>
            </div>
            <div class="form-group">
                <label>Date of Birth</label>
                <input type="date" name="dob" value="${member.dob}" required>
            </div>
            <button type="submit" class="btn btn-submit">Update Member</button>
        </form>
    `);
    
    document.getElementById('member-form').onsubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        
        try {
            const response = await fetch(`${API_BASE}/members/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (response.ok) {
                closeModal();
                await loadMembers();
                alert('Member updated successfully!');
            } else {
                alert('Error updating member');
            }
        } catch (error) {
            alert('Error updating member');
        }
    };
}

async function deleteMember(id) {
    if (!confirm('Are you sure you want to delete this member? This will also delete their memberships and bookings.')) return;
    try {
        const response = await fetch(`${API_BASE}/members/${id}`, { method: 'DELETE' });
        if (response.ok) {
            await loadMembers();
            alert('Member deleted successfully!');
        } else {
            alert('Error deleting member');
        }
    } catch (error) {
        alert('Error deleting member');
    }
}

// ============ MEMBERSHIPS ============
async function loadMemberships() {
    try {
        const response = await fetch(`${API_BASE}/memberships`);
        if (!response.ok) throw new Error('Failed to load memberships');
        memberships = await response.json();
        renderMembershipsTable();
    } catch (error) {
        document.getElementById('memberships-tbody').innerHTML = 
            '<tr><td colspan="8" class="error">Error loading memberships</td></tr>';
    }
}

function renderMembershipsTable() {
    const tbody = document.getElementById('memberships-tbody');
    if (!memberships.length) {
        tbody.innerHTML = '<tr><td colspan="8">No memberships found</td></tr>';
        return;
    }
    tbody.innerHTML = memberships.map(m => {
        const isActive = new Date(m.expire_date) >= new Date();
        return `
        <tr>
            <td>${m.membership_id}</td>
            <td>${m.member_id}</td>
            <td>${escapeHtml(m.name)}</td>
            <td>$${Number(m.price).toFixed(2)}</td>
            <td style="text-transform:capitalize">${m.type}</td>
            <td>${m.start_date}</td>
            <td>${m.expire_date}</td>
            <td>
                <button class="btn btn-edit" onclick="editMembership(${m.membership_id})">Edit</button>
                <button class="btn btn-delete" onclick="deleteMembership(${m.membership_id})">Delete</button>
            </td>
        </tr>
    `}).join('');
}

function showAddMembershipModal() {
    showModal(`
        <h2>Add New Membership</h2>
        <form id="membership-form">
            <div class="form-group">
                <label>Member ID</label>
                <input type="number" name="member_id" required placeholder="Enter member ID">
            </div>
            <div class="form-group">
                <label>Membership Name</label>
                <input type="text" name="name" required placeholder="e.g. Gold Plan">
            </div>
            <div class="form-group">
                <label>Price</label>
                <input type="number" step="0.01" name="price" required placeholder="0.00">
            </div>
            <div class="form-group">
                <label>Type</label>
                <select name="type" required>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="annual">Annual</option>
                </select>
            </div>
            <div class="form-group">
                <label>Start Date</label>
                <input type="date" name="start_date" required>
            </div>
            <div class="form-group">
                <label>Expire Date</label>
                <input type="date" name="expire_date" required>
            </div>
            <button type="submit" class="btn btn-submit">Add Membership</button>
        </form>
    `);
    
    document.getElementById('membership-form').onsubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        data.member_id = parseInt(data.member_id);
        data.price = parseFloat(data.price);
        
        try {
            const response = await fetch(`${API_BASE}/memberships`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (response.ok) {
                closeModal();
                await loadMemberships();
                alert('Membership added successfully!');
            } else {
                alert('Error adding membership');
            }
        } catch (error) {
            alert('Error adding membership');
        }
    };
}

function editMembership(id) {
    const membership = memberships.find(m => m.membership_id === id);
    if (!membership) return;
    
    showModal(`
        <h2>Edit Membership</h2>
        <form id="membership-form">
            <div class="form-group">
                <label>Member ID</label>
                <input type="number" name="member_id" value="${membership.member_id}" required>
            </div>
            <div class="form-group">
                <label>Membership Name</label>
                <input type="text" name="name" value="${escapeHtml(membership.name)}" required>
            </div>
            <div class="form-group">
                <label>Price</label>
                <input type="number" step="0.01" name="price" value="${membership.price}" required>
            </div>
            <div class="form-group">
                <label>Type</label>
                <select name="type" required>
                    <option value="monthly" ${membership.type === 'monthly' ? 'selected' : ''}>Monthly</option>
                    <option value="quarterly" ${membership.type === 'quarterly' ? 'selected' : ''}>Quarterly</option>
                    <option value="annual" ${membership.type === 'annual' ? 'selected' : ''}>Annual</option>
                </select>
            </div>
            <div class="form-group">
                <label>Start Date</label>
                <input type="date" name="start_date" value="${membership.start_date}" required>
            </div>
            <div class="form-group">
                <label>Expire Date</label>
                <input type="date" name="expire_date" value="${membership.expire_date}" required>
            </div>
            <button type="submit" class="btn btn-submit">Update Membership</button>
        </form>
    `);
    
    document.getElementById('membership-form').onsubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        data.member_id = parseInt(data.member_id);
        data.price = parseFloat(data.price);
        
        try {
            const response = await fetch(`${API_BASE}/memberships/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (response.ok) {
                closeModal();
                await loadMemberships();
                alert('Membership updated successfully!');
            } else {
                alert('Error updating membership');
            }
        } catch (error) {
            alert('Error updating membership');
        }
    };
}

async function deleteMembership(id) {
    if (!confirm('Are you sure you want to delete this membership?')) return;
    try {
        const response = await fetch(`${API_BASE}/memberships/${id}`, { method: 'DELETE' });
        if (response.ok) {
            await loadMemberships();
            alert('Membership deleted successfully!');
        } else {
            alert('Error deleting membership');
        }
    } catch (error) {
        alert('Error deleting membership');
    }
}

// ============ INSTRUCTORS ============
async function loadInstructors() {
    try {
        const response = await fetch(`${API_BASE}/instructors`);
        if (!response.ok) throw new Error('Failed to load instructors');
        instructors = await response.json();
        renderInstructorsTable();
    } catch (error) {
        document.getElementById('instructors-tbody').innerHTML = 
            '<tr><td colspan="7" class="error">Error loading instructors</td></tr>';
    }
}

function renderInstructorsTable() {
    const tbody = document.getElementById('instructors-tbody');
    if (!instructors.length) {
        tbody.innerHTML = '<tr><td colspan="7">No instructors found</td></tr>';
        return;
    }
    tbody.innerHTML = instructors.map(i => `
        <tr>
            <td>${i.instructor_id}</td>
            <td>${escapeHtml(i.first_name)}</td>
            <td>${escapeHtml(i.last_name)}</td>
            <td>${escapeHtml(i.email)}</td>
            <td>${i.phone}</td>
            <td class="status-${i.status}">${i.status}</td>
            <td>
                <button class="btn btn-edit" onclick="editInstructor(${i.instructor_id})">Edit</button>
                <button class="btn btn-delete" onclick="deleteInstructor(${i.instructor_id})">Delete</button>
            </td>
        </tr>
    `).join('');
}

function showAddInstructorModal() {
    showModal(`
        <h2>Add New Instructor</h2>
        <form id="instructor-form">
            <div class="form-group">
                <label>First Name</label>
                <input type="text" name="first_name" required>
            </div>
            <div class="form-group">
                <label>Last Name</label>
                <input type="text" name="last_name" required>
            </div>
            <div class="form-group">
                <label>Email</label>
                <input type="email" name="email" required>
            </div>
            <div class="form-group">
                <label>Phone</label>
                <input type="tel" name="phone" required>
            </div>
            <div class="form-group">
                <label>Date of Birth</label>
                <input type="date" name="dob" required>
            </div>
            <div class="form-group">
                <label>Status</label>
                <select name="status" required>
                    <option value="active">Active</option>
                    <option value="on_leave">On Leave</option>
                    <option value="inactive">Inactive</option>
                </select>
            </div>
            <button type="submit" class="btn btn-submit">Add Instructor</button>
        </form>
    `);
    
    document.getElementById('instructor-form').onsubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        
        try {
            const response = await fetch(`${API_BASE}/instructors`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (response.ok) {
                closeModal();
                await loadInstructors();
                alert('Instructor added successfully!');
            } else {
                alert('Error adding instructor');
            }
        } catch (error) {
            alert('Error adding instructor');
        }
    };
}

function editInstructor(id) {
    const instructor = instructors.find(i => i.instructor_id === id);
    if (!instructor) return;
    
    showModal(`
        <h2>Edit Instructor</h2>
        <form id="instructor-form">
            <div class="form-group">
                <label>First Name</label>
                <input type="text" name="first_name" value="${escapeHtml(instructor.first_name)}" required>
            </div>
            <div class="form-group">
                <label>Last Name</label>
                <input type="text" name="last_name" value="${escapeHtml(instructor.last_name)}" required>
            </div>
            <div class="form-group">
                <label>Email</label>
                <input type="email" name="email" value="${escapeHtml(instructor.email)}" required>
            </div>
            <div class="form-group">
                <label>Phone</label>
                <input type="tel" name="phone" value="${instructor.phone}" required>
            </div>
            <div class="form-group">
                <label>Status</label>
                <select name="status" required>
                    <option value="active" ${instructor.status === 'active' ? 'selected' : ''}>Active</option>
                    <option value="on_leave" ${instructor.status === 'on_leave' ? 'selected' : ''}>On Leave</option>
                    <option value="inactive" ${instructor.status === 'inactive' ? 'selected' : ''}>Inactive</option>
                </select>
            </div>
            <button type="submit" class="btn btn-submit">Update Instructor</button>
        </form>
    `);
    
    document.getElementById('instructor-form').onsubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        
        try {
            const response = await fetch(`${API_BASE}/instructors/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (response.ok) {
                closeModal();
                await loadInstructors();
                alert('Instructor updated successfully!');
            } else {
                alert('Error updating instructor');
            }
        } catch (error) {
            alert('Error updating instructor');
        }
    };
}

async function deleteInstructor(id) {
    if (!confirm('Are you sure you want to delete this instructor? This will also delete their classes and bookings.')) return;
    try {
        const response = await fetch(`${API_BASE}/instructors/${id}`, { method: 'DELETE' });
        if (response.ok) {
            await loadInstructors();
            alert('Instructor deleted successfully!');
        } else {
            alert('Error deleting instructor');
        }
    } catch (error) {
        alert('Error deleting instructor');
    }
}

// ============ CLASSES ============
async function loadClasses() {
    try {
        const response = await fetch(`${API_BASE}/classes`);
        if (!response.ok) throw new Error('Failed to load classes');
        classes = await response.json();
        renderClassesTable();
    } catch (error) {
        document.getElementById('classes-tbody').innerHTML = 
            '<tr><td colspan="6" class="error">Error loading classes</td></tr>';
    }
}

function renderClassesTable() {
    const tbody = document.getElementById('classes-tbody');
    if (!classes.length) {
        tbody.innerHTML = '<tr><td colspan="6">No classes found</td></tr>';
        return;
    }
    tbody.innerHTML = classes.map(c => {
        const instructor = instructors.find(i => i.instructor_id === c.instructor_id);
        const instructorName = instructor ? `${instructor.first_name} ${instructor.last_name}` : `ID: ${c.instructor_id}`;
        return `
        <tr>
            <td>${c.class_id}</td>
            <td>${escapeHtml(c.class_name)}</td>
            <td>${escapeHtml(instructorName)}</td>
            <td>${c.date_time}</td>
            <td>${c.num_members || 0}</td>
            <td>
                <button class="btn btn-edit" onclick="editClass(${c.class_id})">Edit</button>
                <button class="btn btn-delete" onclick="deleteClass(${c.class_id})">Delete</button>
            </td>
        </tr>
    `}).join('');
}

function createInstructorDropdown(selectedId = null) {
    let options = '<option value="">Select an instructor...</option>';
    instructors.forEach(instructor => {
        const selected = selectedId == instructor.instructor_id ? 'selected' : '';
        options += `<option value="${instructor.instructor_id}" ${selected}>${instructor.first_name} ${instructor.last_name} (ID: ${instructor.instructor_id})</option>`;
    });
    return `<select name="instructor_id" required>${options}</select>`;
}

function showAddClassModal() {
    showModal(`
        <h2>Add New Class</h2>
        <form id="class-form">
            <div class="form-group">
                <label>Class Name</label>
                <input type="text" name="class_name" required placeholder="e.g. Morning Yoga">
            </div>
            <div class="form-group">
                <label>Instructor</label>
                ${createInstructorDropdown()}
            </div>
            <div class="form-group">
                <label>Date & Time</label>
                <input type="datetime-local" name="date_time" required>
            </div>
            <button type="submit" class="btn btn-submit">Add Class</button>
        </form>
    `);
    
    document.getElementById('class-form').onsubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        data.instructor_id = parseInt(data.instructor_id);
        
        try {
            const response = await fetch(`${API_BASE}/classes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (response.ok) {
                closeModal();
                await loadClasses();
                alert('Class added successfully!');
            } else {
                alert('Error adding class');
            }
        } catch (error) {
            alert('Error adding class');
        }
    };
}

function editClass(id) {
    const cls = classes.find(c => c.class_id === id);
    if (!cls) return;
    
    let datetimeValue = '';
    if (cls.date_time) {
        datetimeValue = cls.date_time.replace(' ', 'T').slice(0, 16);
    }
    
    showModal(`
        <h2>Edit Class</h2>
        <form id="class-form">
            <div class="form-group">
                <label>Class Name</label>
                <input type="text" name="class_name" value="${escapeHtml(cls.class_name)}" required>
            </div>
            <div class="form-group">
                <label>Instructor</label>
                ${createInstructorDropdown(cls.instructor_id)}
            </div>
            <div class="form-group">
                <label>Date & Time</label>
                <input type="datetime-local" name="date_time" value="${datetimeValue}" required>
            </div>
            <button type="submit" class="btn btn-submit">Update Class</button>
        </form>
    `);
    
    document.getElementById('class-form').onsubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        data.instructor_id = parseInt(data.instructor_id);
        
        try {
            const response = await fetch(`${API_BASE}/classes/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    instructor_id: data.instructor_id,
                    name: data.class_name,
                    schedule: data.date_time,
                    capacity: cls.num_members
                })
            });
            if (response.ok) {
                closeModal();
                await loadClasses();
                alert('Class updated successfully!');
            } else {
                alert('Error updating class');
            }
        } catch (error) {
            alert('Error updating class');
        }
    };
}

async function deleteClass(id) {
    if (!confirm('Are you sure you want to delete this class? This will also delete associated bookings.')) return;
    try {
        const response = await fetch(`${API_BASE}/classes/${id}`, { method: 'DELETE' });
        if (response.ok) {
            await loadClasses();
            alert('Class deleted successfully!');
        } else {
            alert('Error deleting class');
        }
    } catch (error) {
        alert('Error deleting class');
    }
}

// ============ BOOKINGS ============
async function loadBookings() {
    try {
        const response = await fetch(`${API_BASE}/bookings`);
        if (!response.ok) throw new Error('Failed to load bookings');
        bookings = await response.json();
        renderBookingsTable();
    } catch (error) {
        document.getElementById('bookings-tbody').innerHTML = 
            '<tr><td colspan="6" class="error">Error loading bookings</td></tr>';
    }
}

function renderBookingsTable() {
    const tbody = document.getElementById('bookings-tbody');
    if (!bookings.length) {
        tbody.innerHTML = '<tr><td colspan="6">No bookings found</td></tr>';
        return;
    }
    tbody.innerHTML = bookings.map(b => {
        const member = members.find(m => m.member_id === b.member_id);
        const memberName = member ? `${member.first_name} ${member.last_name}` : `ID: ${b.member_id}`;
        const classItem = classes.find(c => c.class_id === b.class_id);
        const className = classItem ? classItem.class_name : `ID: ${b.class_id}`;
        return `
        <tr>
            <td>${b.booking_id}</td>
            <td>${escapeHtml(memberName)}</td>
            <td>${escapeHtml(className)}</td>
            <td>${b.booking_time}</td>
            <td class="status-${b.status}">${b.status}</td>
            <td>
                <button class="btn btn-edit" onclick="editBooking(${b.booking_id})">Edit</button>
                <button class="btn btn-delete" onclick="deleteBooking(${b.booking_id})">Delete</button>
            </td>
        </tr>
    `}).join('');
}

function createMemberDropdown(selectedId = null) {
    let options = '<option value="">Select a member...</option>';
    members.forEach(member => {
        const selected = selectedId == member.member_id ? 'selected' : '';
        options += `<option value="${member.member_id}" ${selected}>${member.first_name} ${member.last_name} (ID: ${member.member_id})</option>`;
    });
    return `<select name="member_id" required>${options}</select>`;
}

function createClassDropdown(selectedId = null) {
    let options = '<option value="">Select a class...</option>';
    classes.forEach(cls => {
        const selected = selectedId == cls.class_id ? 'selected' : '';
        options += `<option value="${cls.class_id}" ${selected}>${cls.class_name} (ID: ${cls.class_id})</option>`;
    });
    return `<select name="class_id" required>${options}</select>`;
}

function showAddBookingModal() {
    showModal(`
        <h2>Add New Booking</h2>
        <form id="booking-form">
            <div class="form-group">
                <label>Member</label>
                ${createMemberDropdown()}
            </div>
            <div class="form-group">
                <label>Class</label>
                ${createClassDropdown()}
            </div>
            <div class="form-group">
                <label>Status</label>
                <select name="status" required>
                    <option value="confirmed">Confirmed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="attended">Attended</option>
                    <option value="no_show">No Show</option>
                </select>
            </div>
            <button type="submit" class="btn btn-submit">Add Booking</button>
        </form>
    `);
    
    document.getElementById('booking-form').onsubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        data.member_id = parseInt(data.member_id);
        data.class_id = parseInt(data.class_id);
        data.booking_time = new Date().toISOString().replace('T', ' ').slice(0, 19);
        data.cancellation_time = null;
        
        try {
            const response = await fetch(`${API_BASE}/bookings`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (response.ok) {
                closeModal();
                await loadBookings();
                alert('Booking added successfully!');
            } else {
                alert('Error adding booking');
            }
        } catch (error) {
            alert('Error adding booking');
        }
    };
}

function editBooking(id) {
    const booking = bookings.find(b => b.booking_id === id);
    if (!booking) return;
    
    showModal(`
        <h2>Edit Booking</h2>
        <form id="booking-form">
            <div class="form-group">
                <label>Member</label>
                ${createMemberDropdown(booking.member_id)}
            </div>
            <div class="form-group">
                <label>Class</label>
                ${createClassDropdown(booking.class_id)}
            </div>
            <div class="form-group">
                <label>Status</label>
                <select name="status" required>
                    <option value="confirmed" ${booking.status === 'confirmed' ? 'selected' : ''}>Confirmed</option>
                    <option value="cancelled" ${booking.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                    <option value="attended" ${booking.status === 'attended' ? 'selected' : ''}>Attended</option>
                    <option value="no_show" ${booking.status === 'no_show' ? 'selected' : ''}>No Show</option>
                </select>
            </div>
            <button type="submit" class="btn btn-submit">Update Booking</button>
        </form>
    `);
    
    document.getElementById('booking-form').onsubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        
        try {
            const response = await fetch(`${API_BASE}/bookings/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    member_id: parseInt(data.member_id),
                    class_id: parseInt(data.class_id),
                    booking_date: booking.booking_time
                })
            });
            if (response.ok) {
                closeModal();
                await loadBookings();
                alert('Booking updated successfully!');
            } else {
                alert('Error updating booking');
            }
        } catch (error) {
            alert('Error updating booking');
        }
    };
}

async function deleteBooking(id) {
    if (!confirm('Are you sure you want to delete this booking?')) return;
    try {
        const response = await fetch(`${API_BASE}/bookings/${id}`, { method: 'DELETE' });
        if (response.ok) {
            await loadBookings();
            alert('Booking deleted successfully!');
        } else {
            alert('Error deleting booking');
        }
    } catch (error) {
        alert('Error deleting booking');
    }
}

// Initial load
loadMembers();