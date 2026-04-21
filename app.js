// FlyingFrogs App Routing
// Authors: Chris Jones
// Version: April 14 2026

const express = require('express');
const { 
  readAllMembers, 
  readAllMemberships, 
  readAllInstructors, 
  readAllClasses, 
  readAllBookings,
  createMember,
  readMember,
  updateMember,
  deleteMember,
  createMembership,
  updateMembership,
  deleteMembership,
  createInstructor,
  readInstructor,
  updateInstructor,
  deleteInstructor,
  createClass,
  readClass,
  updateClass,
  deleteClass,
  createBooking,
  readBooking,
  updateBooking,
  deleteBooking
} = require('./crud');
const app = express();
const port = 3000;

// Middleware
app.use(express.static('public'));
app.use(express.json()); // This is CRITICAL - parses JSON request bodies

// render home page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

///// API ROUTES /////

// ============ MEMBERS ============
// GET all members
app.get('/api/members', (req, res) => {
  try {
    const members = readAllMembers();
    res.json(members);
  } catch (error) {
    console.error('Error fetching members:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET single member
app.get('/api/members/:id', (req, res) => {
  try {
    const member = readMember(req.params.id);
    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }
    res.json(member);
  } catch (error) {
    console.error('Error fetching member:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST create new member
app.post('/api/members', (req, res) => {
  try {
    const { first_name, last_name, email, phone, dob } = req.body;
    const newId = createMember(null, first_name, last_name, email, phone, dob);
    res.status(201).json({ id: newId, message: 'Member created successfully' });
  } catch (error) {
    console.error('Error creating member:', error);
    res.status(500).json({ error: error.message });
  }
});

// PUT update member
app.put('/api/members/:id', (req, res) => {
  try {
    const { first_name, last_name, email, phone, dob } = req.body;
    const result = updateMember(req.params.id, first_name, last_name, email, phone, dob);
    res.json({ message: 'Member updated successfully' });
  } catch (error) {
    console.error('Error updating member:', error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE member
app.delete('/api/members/:id', (req, res) => {
  try {
    const result = deleteMember(req.params.id);
    res.json({ message: 'Member deleted successfully' });
  } catch (error) {
    console.error('Error deleting member:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============ MEMBERSHIPS ============
// GET all memberships
app.get('/api/memberships', (req, res) => {
  try {
    const memberships = readAllMemberships();
    res.json(memberships);
  } catch (error) {
    console.error('Error fetching memberships:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST create new membership
app.post('/api/memberships', (req, res) => {
  try {
    const { member_id, name, price, type, start_date, expire_date } = req.body;
    const newId = createMembership(member_id, name, price, type, start_date, expire_date);
    res.status(201).json({ id: newId, message: 'Membership created successfully' });
  } catch (error) {
    console.error('Error creating membership:', error);
    res.status(500).json({ error: error.message });
  }
});

// PUT update membership
app.put('/api/memberships/:id', (req, res) => {
  try {
    const { member_id, name, price, type, start_date, expire_date } = req.body;
    const result = updateMembership(req.params.id, member_id, name, price, type, start_date, expire_date);
    res.json({ message: 'Membership updated successfully' });
  } catch (error) {
    console.error('Error updating membership:', error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE membership
app.delete('/api/memberships/:id', (req, res) => {
  try {
    const result = deleteMembership(req.params.id);
    res.json({ message: 'Membership deleted successfully' });
  } catch (error) {
    console.error('Error deleting membership:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============ INSTRUCTORS ============
// GET all instructors
app.get('/api/instructors', (req, res) => {
  try {
    const instructors = readAllInstructors();
    res.json(instructors);
  } catch (error) {
    console.error('Error fetching instructors:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST create new instructor
app.post('/api/instructors', (req, res) => {
  try {
    const { first_name, last_name, email, phone, status } = req.body;
    const newId = createInstructor(null, first_name, last_name, email, phone, status);
    res.status(201).json({ id: newId, message: 'Instructor created successfully' });
  } catch (error) {
    console.error('Error creating instructor:', error);
    res.status(500).json({ error: error.message });
  }
});

// PUT update instructor
app.put('/api/instructors/:id', (req, res) => {
  try {
    const { first_name, last_name, email, phone, status } = req.body;
    const result = updateInstructor(req.params.id, first_name, last_name, email, phone, status);
    res.json({ message: 'Instructor updated successfully' });
  } catch (error) {
    console.error('Error updating instructor:', error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE instructor
app.delete('/api/instructors/:id', (req, res) => {
  try {
    const result = deleteInstructor(req.params.id);
    res.json({ message: 'Instructor deleted successfully' });
  } catch (error) {
    console.error('Error deleting instructor:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============ CLASSES ============
// GET all classes
app.get('/api/classes', (req, res) => {
  try {
    const classes = readAllClasses();
    res.json(classes);
  } catch (error) {
    console.error('Error fetching classes:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST create new class
app.post('/api/classes', (req, res) => {
  try {
    const { class_name, instructor_id, date_time } = req.body;
    const newId = createClass(class_name, instructor_id, date_time);
    res.status(201).json({ id: newId, message: 'Class created successfully' });
  } catch (error) {
    console.error('Error creating class:', error);
    res.status(500).json({ error: error.message });
  }
});

// PUT update class
app.put('/api/classes/:id', (req, res) => {
  try {
    const { instructor_id, class_name, date_time, num_members } = req.body;
    // Note: Your updateClass function signature might be different
    // You may need to adjust based on your actual updateClass implementation
    const result = updateClass(req.params.id, instructor_id, class_name, date_time, num_members);
    res.json({ message: 'Class updated successfully' });
  } catch (error) {
    console.error('Error updating class:', error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE class
app.delete('/api/classes/:id', (req, res) => {
  try {
    const result = deleteClass(req.params.id);
    res.json({ message: 'Class deleted successfully' });
  } catch (error) {
    console.error('Error deleting class:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============ BOOKINGS ============
// GET all bookings
app.get('/api/bookings', (req, res) => {
  try {
    const bookings = readAllBookings();
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST create new booking
app.post('/api/bookings', (req, res) => {
  try {
    const { member_id, class_id, status } = req.body;
    // booking_id is auto-generated, booking_datetime defaults to CURRENT_TIMESTAMP
    const newId = createBooking(null, member_id, class_id, null, null, status || 'confirmed');
    res.status(201).json({ id: newId, message: 'Booking created successfully' });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: error.message });
  }
});

// PUT update booking
app.put('/api/bookings/:id', (req, res) => {
  try {
    const { member_id, class_id, status } = req.body;
    const result = updateBooking(req.params.id, member_id, class_id, status);
    res.json({ message: 'Booking updated successfully' });
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE booking
app.delete('/api/bookings/:id', (req, res) => {
  try {
    const result = deleteBooking(req.params.id);
    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({ error: error.message });
  }
});

// Start server listening
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
  console.log(`Visit http://localhost:${port}`);
});