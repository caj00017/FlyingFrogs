// FlyingFrogs App Routing
// Authors: Chris Jones
// Version: April 14 2026

// app.js
const express = require('express');
const { 
  createMember, readMember, readAllMembers, updateMember, deleteMember,
  createMembership, readMembership, readAllMemberships, updateMembership, deleteMembership,
  createInstructor, readInstructor, readAllInstructors, updateInstructor, deleteInstructor,
  createClass, readClass, readAllClasses, updateClass, deleteClass,
  createBooking, readBooking, readAllBookings, updateBooking, deleteBooking
} = require('./crud');

const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.json());

// Serve CSS files from root
app.get('/css/:file', (req, res) => {
  res.sendFile(__dirname + '/public/' + req.params.file);
});

// Serve JS files from root
app.get('/js/:file', (req, res) => {
  res.sendFile(__dirname + '/public/' + req.params.file);
});

// Render pages
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// render login page
app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/public/login.html');
});

// render member
app.get('/member.html', (req, res) => {
  res.sendFile(__dirname + '/public/member.html');
});

// render staff page
app.get('/staff.html', (req, res) => {
  res.sendFile(__dirname + '/public/staff.html');
});

// Error handling wrapper
function handleRoute(handler) {
  return async (req, res) => {
    try {
      const result = handler(req, res);
      if (result !== undefined) {
        res.json(result);
      }
    } catch (error) {
      console.error('Route error:', error);
      res.status(500).json({ error: error.message });
    }
  };
}

///// API ROUTES /////

///// MEMBERS /////

// POST endpoint for creating new members
app.post('/api/members', (req, res) => {
  try {
    const { first_name, last_name, email, phone, dob } = req.body;
    const result = createMember(first_name, last_name, email, phone, dob);
    res.json({ member_id: result, message: 'Member created successfully' });
  } catch (error) {
    console.error('Error creating member:', error);
    res.status(500).json({ error: error.message });
  }
});

// get Members
app.get('/api/members', (req, res) => {
  try {
    const members = readAllMembers();
    res.json(members);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// get Member by ID
app.get('/api/members/:id', (req, res) => {
  try {
    const member = readMember(parseInt(req.params.id));
    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }
    res.json(member);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT endpoint for updating Members
app.put('/api/members/:id', (req, res) => {
  try {
    const { first_name, last_name, email, phone, dob } = req.body;
    const result = updateMember(parseInt(req.params.id), first_name, last_name, email, phone, dob);
    res.json({ changes: result, message: 'Member updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// delete endpoint for deleting members by ID
app.delete('/api/members/:id', (req, res) => {
  try {
    const result = deleteMember(parseInt(req.params.id));
    res.json({ changes: result, message: 'Member deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

///////////////////

///// MEMBERSHIPS /////

// POST endpoint for creating new memberships
app.post('/api/memberships', (req, res) => {
  try {
    const { member_id, name, price, type, start_date, expire_date } = req.body;
    const result = createMembership(member_id, name, price, type, start_date, expire_date);
    res.json({ membership_id: result, message: 'Membership created successfully' });
  } catch (error) {
    console.error('Error creating membership:', error);
    res.status(500).json({ error: error.message });
  }
});

// get Memberships
app.get('/api/memberships', (req, res) => {
  try {
    const memberships = readAllMemberships();
    res.json(memberships);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// get Membership by ID
app.get('/api/memberships/:id', (req, res) => {
  try {
    const membership = readMembership(parseInt(req.params.id));
    if (!membership) {
      return res.status(404).json({ error: 'Membership not found' });
    }
    res.json(membership);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT endpoint for updating Memberships
app.put('/api/memberships/:id', (req, res) => {
  try {
    const { member_id, name, price, type, start_date, expire_date } = req.body;
    const result = updateMembership(parseInt(req.params.id), member_id, name, price, type, start_date, expire_date);
    res.json({ changes: result, message: 'Membership updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// delete endpoint for deleting memberships by ID
app.delete('/api/memberships/:id', (req, res) => {
  try {
    const result = deleteMembership(parseInt(req.params.id));
    res.json({ changes: result, message: 'Membership deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

///////////////////////

///// INSTRUCTORS /////

// POST endpoint for creating new instructors
app.post('/api/instructors', (req, res) => {
  try {
    const { first_name, last_name, email, phone, dob, status } = req.body;
    const result = createInstructor(first_name, last_name, email, phone, dob, status || 'active');
    res.json({ instructor_id: result, message: 'Instructor created successfully' });
  } catch (error) {
    console.error('Error creating instructor:', error);
    res.status(500).json({ error: error.message });
  }
});

// get Instructors
app.get('/api/instructors', (req, res) => {
  try {
    const instructors = readAllInstructors();
    res.json(instructors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// get Instructor by ID
app.get('/api/instructors/:id', (req, res) => {
  try {
    const instructor = readInstructor(parseInt(req.params.id));
    if (!instructor) {
      return res.status(404).json({ error: 'Instructor not found' });
    }
    res.json(instructor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT endpoint for updating Instructors
app.put('/api/instructors/:id', (req, res) => {
  try {
    const { first_name, last_name, email, phone, status } = req.body;
    const result = updateInstructor(parseInt(req.params.id), first_name, last_name, email, phone, status);
    res.json({ changes: result, message: 'Instructor updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// delete endpoint for deleting instructors by ID
app.delete('/api/instructors/:id', (req, res) => {
  try {
    const result = deleteInstructor(parseInt(req.params.id));
    res.json({ changes: result, message: 'Instructor deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

///////////////////////

///// CLASSES /////

// POST endpoint for creating new classes
app.post('/api/classes', (req, res) => {
  try {
    const { class_name, instructor_id, date_time } = req.body;
    const result = createClass(class_name, instructor_id, date_time);
    res.json({ class_id: result, message: 'Class created successfully' });
  } catch (error) {
    console.error('Error creating class:', error);
    res.status(500).json({ error: error.message });
  }
});

// get Classes
app.get('/api/classes', (req, res) => {
  try {
    const classes = readAllClasses();
    res.json(classes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// get class by ID
app.get('/api/classes/:id', (req, res) => {
  try {
    const classObj = readClass(parseInt(req.params.id));
    if (!classObj) {
      return res.status(404).json({ error: 'Class not found' });
    }
    res.json(classObj);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT endpoint for updating Classes
app.put('/api/classes/:id', (req, res) => {
  try {
    const { instructor_id, name, schedule, capacity } = req.body;
    const result = updateClass(parseInt(req.params.id), instructor_id, name, schedule, capacity || 0);
    res.json({ changes: result, message: 'Class updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// delete endpoint for deleting classes by ID
app.delete('/api/classes/:id', (req, res) => {
  try {
    const result = deleteClass(parseInt(req.params.id));
    res.json({ changes: result, message: 'Class deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

///// BOOKINGS /////

// POST endpoint for creating new bookings
app.post('/api/bookings', (req, res) => {
  try {
    const { member_id, class_id, booking_time, cancellation_time, status } = req.body;
    const result = createBooking(member_id, class_id, booking_time, cancellation_time, status || 'confirmed');
    
    // Increment num_members in Classes table
    const Database = require('better-sqlite3');
    const db = new Database('source.db');
    db.pragma('foreign_keys = ON');
    
    if (status === 'confirmed') {
      db.prepare('UPDATE Classes SET num_members = num_members + 1 WHERE class_id = ?').run(class_id);
    }
    
    res.json({ booking_id: result, message: 'Booking created successfully' });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: error.message });
  }
});

// get Bookings
app.get('/api/bookings', (req, res) => {
  try {
    const bookings = readAllBookings();
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// get booking by ID
app.get('/api/bookings/:id', (req, res) => {
  try {
    const booking = readBooking(parseInt(req.params.id));
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT endpoint for updating Bookings
app.put('/api/bookings/:id', (req, res) => {
  try {
    const Database = require('better-sqlite3');
    const db = new Database('source.db');
    db.pragma('foreign_keys = ON');
    
    const bookingId = parseInt(req.params.id);
    const { member_id, class_id, booking_date, status } = req.body;
    
    // Get old booking to compare status
    const oldBooking = db.prepare('SELECT * FROM Bookings WHERE booking_id = ?').get(bookingId);
    
    const result = updateBooking(bookingId, member_id, class_id, booking_date);
    
    // Update num_members if status changed
    if (status && oldBooking) {
      if (status === 'confirmed' && oldBooking.status !== 'confirmed') {
        db.prepare('UPDATE Classes SET num_members = num_members + 1 WHERE class_id = ?').run(class_id);
      } else if (status !== 'confirmed' && oldBooking.status === 'confirmed') {
        db.prepare('UPDATE Classes SET num_members = MAX(0, num_members - 1) WHERE class_id = ?').run(class_id);
      }
    }
    
    res.json({ changes: result, message: 'Booking updated successfully' });
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({ error: error.message });
  }
});

// delete endpoint for deleting bookings by ID
app.delete('/api/bookings/:id', (req, res) => {
  try {
    const Database = require('better-sqlite3');
    const db = new Database('source.db');
    db.pragma('foreign_keys = ON');
    
    // Get the booking first to know the class_id and status
    const booking = db.prepare('SELECT * FROM Bookings WHERE booking_id = ?').get(parseInt(req.params.id));
    
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    const result = deleteBooking(parseInt(req.params.id));
    
    // Decrement num_members if booking was confirmed
    if (booking.status === 'confirmed') {
      db.prepare('UPDATE Classes SET num_members = MAX(0, num_members - 1) WHERE class_id = ?').run(booking.class_id);
    }
    
    res.json({ changes: result, message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({ error: error.message });
  }
});

// Fix enrollment numbers on startup
(function fixEnrollmentNumbers() {
  try {
    const Database = require('better-sqlite3');
    const db = new Database('source.db');
    db.pragma('foreign_keys = ON');
    
    console.log('Fixing enrollment numbers...');
    
    const classes = db.prepare('SELECT class_id FROM Classes').all();
    const updateStmt = db.prepare('UPDATE Classes SET num_members = ? WHERE class_id = ?');
    const countStmt = db.prepare('SELECT COUNT(*) as count FROM Bookings WHERE class_id = ? AND status IN (\'confirmed\', \'attended\')');
    
    const transaction = db.transaction(() => {
      for (const cls of classes) {
        const { count } = countStmt.get(cls.class_id);
        updateStmt.run(count, cls.class_id);
      }
    });
    
    transaction();
    console.log('Enrollment numbers updated');
  } catch (error) {
    console.error('Error fixing enrollment:', error.message);
  }
})();

// Start server listening
app.listen(port, () => {
  console.log(`🐸 Flying Frogs server listening on http://localhost:${port}`);
});