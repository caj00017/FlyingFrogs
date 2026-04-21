// public/script.js
// API Base URL
const API_BASE = '/api';

// Current data stores
let members = [];
let memberships = [];
let instructors = [];
let classes = [];
let bookings = [];

// Tab switching
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const tabId = btn.dataset.tab;
        
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        document.getElementById(tabId).classList.add('active');
        
        refreshActiveTab(tabId);
    });
});

function refreshActiveTab(tabId) {
    switch(tabId) {
        case 'members':
            loadMembers();
            break;
        case 'memberships':
            loadMembers();
            loadMemberships();
            break;
        case 'instructors':
            loadInstructors();
            break;
        case 'classes':
            loadInstructors();
            loadClasses();
            break;
        case 'bookings':
            loadMembers();
            loadClasses();
            loadBookings();
            break;
    }
}

// Load Members
async function loadMembers() {
    try {
        const response = await fetch(`${API_BASE}/members`);
        members = await response.json();
        renderMembersTable();
    } catch (error) {
        console.error('Error loading members:', error);
        document.getElementById('members-tbody').innerHTML = '<tr><td colspan="7" class="error">Error loading members</td></tr>';
    }
}

function renderMembersTable() {
    const tbody = document.getElementById('members-tbody');
    if (!members.length) {
        tbody.innerHTML = '<tr><td colspan="7">No members found</td></tr>';
        return;
    }
    
    tbody.innerHTML = members.map(member => `
        <tr>
            <td>${member.member_id}</td>
            <td>${escapeHtml(member.first_name)}</td>
            <td>${escapeHtml(member.last_name)}</td>
            <td>${escapeHtml(member.email)}</td>
            <td>${member.phone}</td>
            <td>${member.dob}</td>
            <td>
                <button class="btn btn-edit" onclick="editMember(${member.member_id})">Edit</button>
                <button class="btn btn-delete" onclick="deleteMember(${member.member_id})">Delete</button>
            </td>
        </tr>
    `).join('');
}

// Load Memberships
async function loadMemberships() {
    try {
        const response = await fetch(`${API_BASE}/memberships`);
        memberships = await response.json();
        renderMembershipsTable();
    } catch (error) {
        console.error('Error loading memberships:', error);
        document.getElementById('memberships-tbody').innerHTML = '<tr><td colspan="8" class="error">Error loading memberships</td></tr>';
    }
}

function renderMembershipsTable() {
    const tbody = document.getElementById('memberships-tbody');
    if (!memberships.length) {
        tbody.innerHTML = '<tr><td colspan="8">No memberships found</td></tr>';
        return;
    }
    
    tbody.innerHTML = memberships.map(membership => {
        const member = members.find(m => m.member_id === membership.member_id);
        const memberName = member ? `${member.first_name} ${member.last_name}` : `Member ID: ${membership.member_id}`;
        return `
        <tr>
            <td>${membership.membership_id}</td>
            <td>${memberName}</td>
            <td>${escapeHtml(membership.name)}</td>
            <td>$${membership.price}</td>
            <td>${escapeHtml(membership.type)}</td>
            <td>${membership.start_date}</td>
            <td>${membership.expire_date}</td>
            <td>
                <button class="btn btn-edit" onclick="editMembership(${membership.membership_id})">Edit</button>
                <button class="btn btn-delete" onclick="deleteMembership(${membership.membership_id})">Delete</button>
            </td>
        </tr>
    `}).join('');
}

// Load Instructors
async function loadInstructors() {
    try {
        const response = await fetch(`${API_BASE}/instructors`);
        instructors = await response.json();
        renderInstructorsTable();
    } catch (error) {
        console.error('Error loading instructors:', error);
        document.getElementById('instructors-tbody').innerHTML = '<tr><td colspan="7" class="error">Error loading instructors</td></tr>';
    }
}

function renderInstructorsTable() {
    const tbody = document.getElementById('instructors-tbody');
    if (!instructors.length) {
        tbody.innerHTML = '<tr><td colspan="7">No instructors found</td></tr>';
        return;
    }
    
    tbody.innerHTML = instructors.map(instructor => `
        <tr>
            <td>${instructor.instructor_id}</td>
            <td>${escapeHtml(instructor.first_name)}</td>
            <td>${escapeHtml(instructor.last_name)}</td>
            <td>${escapeHtml(instructor.email)}</td>
            <td>${instructor.phone}</td>
            <td class="status-${instructor.status}">${escapeHtml(instructor.status)}</td>
            <td>
                <button class="btn btn-edit" onclick="editInstructor(${instructor.instructor_id})">Edit</button>
                <button class="btn btn-delete" onclick="deleteInstructor(${instructor.instructor_id})">Delete</button>
            </td>
        </tr>
    `).join('');
}

// Load Classes
async function loadClasses() {
    try {
        const response = await fetch(`${API_BASE}/classes`);
        classes = await response.json();
        renderClassesTable();
    } catch (error) {
        console.error('Error loading classes:', error);
        document.getElementById('classes-tbody').innerHTML = '<tr><td colspan="6" class="error">Error loading classes</td></tr>';
    }
}

function renderClassesTable() {
    const tbody = document.getElementById('classes-tbody');
    if (!classes.length) {
        tbody.innerHTML = '<tr><td colspan="6">No classes found</td></tr>';
        return;
    }
    
    tbody.innerHTML = classes.map(cls => {
        const instructor = instructors.find(i => i.instructor_id === cls.instructor_id);
        const instructorName = instructor ? `${instructor.first_name} ${instructor.last_name}` : `ID: ${cls.instructor_id}`;
        return `
        <tr>
            <td>${cls.class_id}</td>
            <td>${escapeHtml(cls.class_name)}</td>
            <td>${instructorName}</td>
            <td>${cls.date_time}</td>
            <td>${cls.num_members || 0}</td>
            <td>
                <button class="btn btn-edit" onclick="editClass(${cls.class_id})">Edit</button>
                <button class="btn btn-delete" onclick="deleteClass(${cls.class_id})">Delete</button>
            </td>
        </tr>
    `}).join('');
}

// Load Bookings
async function loadBookings() {
    try {
        const response = await fetch(`${API_BASE}/bookings`);
        bookings = await response.json();
        renderBookingsTable();
    } catch (error) {
        console.error('Error loading bookings:', error);
        document.getElementById('bookings-tbody').innerHTML = '<tr><td colspan="6" class="error">Error loading bookings</td></tr>';
    }
}

function renderBookingsTable() {
    const tbody = document.getElementById('bookings-tbody');
    if (!bookings.length) {
        tbody.innerHTML = '<tr><td colspan="6">No bookings found</td></tr>';
        return;
    }
    
    tbody.innerHTML = bookings.map(booking => {
        const member = members.find(m => m.member_id === booking.member_id);
        const memberName = member ? `${member.first_name} ${member.last_name}` : `ID: ${booking.member_id}`;
        const classItem = classes.find(c => c.class_id === booking.class_id);
        const className = classItem ? classItem.class_name : `ID: ${booking.class_id}`;
        return `
        <tr>
            <td>${booking.booking_id}</td>
            <td>${memberName}</td>
            <td>${className}</td>
            <td>${booking.booking_time || booking.booking_datetime}</td>
            <td>${escapeHtml(booking.status)}</td>
            <td>
                <button class="btn btn-edit" onclick="editBooking(${booking.booking_id})">Edit</button>
                <button class="btn btn-delete" onclick="deleteBooking(${booking.booking_id})">Delete</button>
            </td>
        </tr>
    `}).join('');
}

// Modal functions
const modal = document.getElementById('modal');
const closeBtn = document.querySelector('.close');

closeBtn.onclick = () => {
    modal.style.display = 'none';
};

window.onclick = (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};

function showModal(content) {
    document.getElementById('modal-body').innerHTML = content;
    modal.style.display = 'block';
}

// Helper function to escape HTML
function escapeHtml(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// Helper function to create member dropdown
function createMemberDropdown(selectedId = null) {
    let options = '<option value="">Select a member...</option>';
    members.forEach(member => {
        const selected = selectedId == member.member_id ? 'selected' : '';
        options += `<option value="${member.member_id}" ${selected}>${escapeHtml(member.first_name)} ${escapeHtml(member.last_name)} (ID: ${member.member_id})</option>`;
    });
    return `<select name="member_id" required>${options}</select>`;
}

// Helper function to create instructor dropdown
function createInstructorDropdown(selectedId = null) {
    let options = '<option value="">Select an instructor...</option>';
    instructors.forEach(instructor => {
        const selected = selectedId == instructor.instructor_id ? 'selected' : '';
        options += `<option value="${instructor.instructor_id}" ${selected}>${escapeHtml(instructor.first_name)} ${escapeHtml(instructor.last_name)} (ID: ${instructor.instructor_id})</option>`;
    });
    return `<select name="instructor_id" required>${options}</select>`;
}

// Helper function to create class dropdown
function createClassDropdown(selectedId = null) {
    let options = '<option value="">Select a class...</option>';
    classes.forEach(cls => {
        const selected = selectedId == cls.class_id ? 'selected' : '';
        options += `<option value="${cls.class_id}" ${selected}>${escapeHtml(cls.class_name)} (ID: ${cls.class_id})</option>`;
    });
    return `<select name="class_id" required>${options}</select>`;
}

// Member Functions
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
                modal.style.display = 'none';
                loadMembers();
                alert('Member added successfully!');
            } else {
                const error = await response.text();
                alert('Error: ' + error);
            }
        } catch (error) {
            console.error('Error adding member:', error);
            alert('Error adding member.');
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
                modal.style.display = 'none';
                loadMembers();
                alert('Member updated successfully!');
            } else {
                alert('Error updating member');
            }
        } catch (error) {
            console.error('Error updating member:', error);
            alert('Error updating member');
        }
    };
}

async function deleteMember(id) {
    if (confirm('Are you sure you want to delete this member?')) {
        try {
            const response = await fetch(`${API_BASE}/members/${id}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                loadMembers();
                alert('Member deleted successfully!');
            } else {
                alert('Error deleting member');
            }
        } catch (error) {
            console.error('Error deleting member:', error);
            alert('Error deleting member');
        }
    }
}

// Membership Functions (with Member dropdown)
function showAddMembershipModal() {
    showModal(`
        <h2>Add New Membership</h2>
        <form id="membership-form">
            <div class="form-group">
                <label>Member</label>
                ${createMemberDropdown()}
            </div>
            <div class="form-group">
                <label>Membership Name</label>
                <input type="text" name="name" required>
            </div>
            <div class="form-group">
                <label>Price</label>
                <input type="number" step="0.01" name="price" required>
            </div>
            <div class="form-group">
                <label>Type</label>
                <select name="type" required>
                    <option value="monthly">Monthly</option>
                    <option value="annual">Annual</option>
                    <option value="quarterly">Quarterly</option>
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
        
        try {
            const response = await fetch(`${API_BASE}/memberships`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            
            if (response.ok) {
                modal.style.display = 'none';
                loadMemberships();
                alert('Membership added successfully!');
            } else {
                alert('Error adding membership');
            }
        } catch (error) {
            console.error('Error adding membership:', error);
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
                <label>Member</label>
                ${createMemberDropdown(membership.member_id)}
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
                    <option value="annual" ${membership.type === 'annual' ? 'selected' : ''}>Annual</option>
                    <option value="quarterly" ${membership.type === 'quarterly' ? 'selected' : ''}>Quarterly</option>
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
        
        try {
            const response = await fetch(`${API_BASE}/memberships/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            
            if (response.ok) {
                modal.style.display = 'none';
                loadMemberships();
                alert('Membership updated successfully!');
            } else {
                alert('Error updating membership');
            }
        } catch (error) {
            console.error('Error updating membership:', error);
            alert('Error updating membership');
        }
    };
}

async function deleteMembership(id) {
    if (confirm('Are you sure you want to delete this membership?')) {
        try {
            const response = await fetch(`${API_BASE}/memberships/${id}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                loadMemberships();
                alert('Membership deleted successfully!');
            } else {
                alert('Error deleting membership');
            }
        } catch (error) {
            console.error('Error deleting membership:', error);
            alert('Error deleting membership');
        }
    }
}

// Instructor Functions
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
                modal.style.display = 'none';
                loadInstructors();
                alert('Instructor added successfully!');
            } else {
                alert('Error adding instructor');
            }
        } catch (error) {
            console.error('Error adding instructor:', error);
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
                modal.style.display = 'none';
                loadInstructors();
                alert('Instructor updated successfully!');
            } else {
                alert('Error updating instructor');
            }
        } catch (error) {
            console.error('Error updating instructor:', error);
            alert('Error updating instructor');
        }
    };
}

async function deleteInstructor(id) {
    if (confirm('Are you sure you want to delete this instructor?')) {
        try {
            const response = await fetch(`${API_BASE}/instructors/${id}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                loadInstructors();
                alert('Instructor deleted successfully!');
            } else {
                alert('Error deleting instructor');
            }
        } catch (error) {
            console.error('Error deleting instructor:', error);
            alert('Error deleting instructor');
        }
    }
}

// Class Functions (with Instructor dropdown)
function showAddClassModal() {
    showModal(`
        <h2>Add New Class</h2>
        <form id="class-form">
            <div class="form-group">
                <label>Class Name</label>
                <input type="text" name="class_name" required>
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
        
        try {
            const response = await fetch(`${API_BASE}/classes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            
            if (response.ok) {
                modal.style.display = 'none';
                loadClasses();
                alert('Class added successfully!');
            } else {
                alert('Error adding class');
            }
        } catch (error) {
            console.error('Error adding class:', error);
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
        
        try {
            const response = await fetch(`${API_BASE}/classes/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            
            if (response.ok) {
                modal.style.display = 'none';
                loadClasses();
                alert('Class updated successfully!');
            } else {
                alert('Error updating class');
            }
        } catch (error) {
            console.error('Error updating class:', error);
            alert('Error updating class');
        }
    };
}

async function deleteClass(id) {
    if (confirm('Are you sure you want to delete this class?')) {
        try {
            const response = await fetch(`${API_BASE}/classes/${id}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                loadClasses();
                alert('Class deleted successfully!');
            } else {
                alert('Error deleting class');
            }
        } catch (error) {
            console.error('Error deleting class:', error);
            alert('Error deleting class');
        }
    }
}

// Booking Functions (with Member and Class dropdowns)
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
        
        try {
            const response = await fetch(`${API_BASE}/bookings`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            
            if (response.ok) {
                modal.style.display = 'none';
                loadBookings();
                alert('Booking added successfully!');
            } else {
                alert('Error adding booking');
            }
        } catch (error) {
            console.error('Error adding booking:', error);
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
                body: JSON.stringify(data)
            });
            
            if (response.ok) {
                modal.style.display = 'none';
                loadBookings();
                alert('Booking updated successfully!');
            } else {
                alert('Error updating booking');
            }
        } catch (error) {
            console.error('Error updating booking:', error);
            alert('Error updating booking');
        }
    };
}

async function deleteBooking(id) {
    if (confirm('Are you sure you want to delete this booking?')) {
        try {
            const response = await fetch(`${API_BASE}/bookings/${id}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                loadBookings();
                alert('Booking deleted successfully!');
            } else {
                alert('Error deleting booking');
            }
        } catch (error) {
            console.error('Error deleting booking:', error);
            alert('Error deleting booking');
        }
    }
}

// Load initial data
loadMembers();
loadInstructors();
loadClasses();