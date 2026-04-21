// FlyingFrogs App Routing
// Authors: Chris Jones
// Version: April 14 2026

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

// Middleware
app.use(express.static('public'));
app.use(express.json()); // This is CRITICAL - parses JSON request bodies

// render home page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/login.html');
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

// get Member by ID
app.get('/api/members/:id', (req,res) => {
  // get the member from crud.readMember(id)
  const member = readMember(parseInt(req.params.id));

  // output that member's data in json format
  res.json(member);
})

// get Memberships
app.get('/api/memberships', (req, res) => {
  try {
    const memberships = readAllMemberships();
    res.json(memberships);
  } catch (error) {
    console.error('Error fetching memberships:', error);
    res.status(500).json({ error: error.message });
  }
});

// get Membership by ID
app.get('/api/memberships/:id', (req,res) => {
  // get the membership from crud.readMemberships(id)
  const membership = readMembership(parseInt(req.params.id));

  // output that membership's data in json format
  res.json(membership);
})

// get Instructors
app.get('/api/instructors', (req, res) => {
  try {
    const instructors = readAllInstructors();
    res.json(instructors);
  } catch (error) {
    console.error('Error fetching instructors:', error);
    res.status(500).json({ error: error.message });
  }
});

// get Instructor by ID
app.get('/api/instructors/:id', (req,res) => {
  // get the instructor from crud.readInstructor(id)
  const instructor = readInstructor(parseInt(req.params.id));

  // output that instructor's data in json format
  res.json(instructor);
})

// get Classes
app.get('/api/classes', (req, res) => {
  try {
    const classes = readAllClasses();
    res.json(classes);
  } catch (error) {
    console.error('Error fetching classes:', error);
    res.status(500).json({ error: error.message });
  }
});

// get class by ID
app.get('/api/classes/:id', (req,res) => {
  // get the class from crud.readClass(id)
  // NOTE: called "classObject" because "class" is a reserved word.
  const classObject = readClass(parseInt(req.params.id)); 

  // output that class's data in json format
  res.json(classObject);
})

// get Bookings
app.get('/api/bookings', (req, res) => {
  try {
    const bookings = readAllBookings();
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: error.message });
  }
});

// get booking by ID
app.get('/api/bookings/:id', (req,res) => {
  // get the booking from crud.readBooking(id)
  const booking = readBooking(parseInt(req.params.id)); 

  // output that booking's data in json format
  res.json(booking);
})

//////////////////////

// Start server listening
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
  console.log(`Visit http://localhost:${port}`);
});