// FlyingFrogs App Routing
// Authors: Chris Jones
// Version: April 14 2026

// testing testing 1.. 2... 3
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

// render home page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// render login page
app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/public/login.html');
});

// render member
app.get('/me', (req, res) => {
  res.sendFile(__dirname + '/public/member.html');
});

// render staff page
app.get('/staff', (req, res) => {
  res.sendFile(__dirname + '/public/staff.html');
});

///// API ROUTES /////

///// MEMBERS /////

// POST endpoint for creating new members
app.post('/api/members', (req,res) => {
  // get params from request body
  const {first_name, last_name, email, phone, dob} = req.body;

  // pass params to create function
  const result = createMember(first_name, last_name, email, phone, dob);

  // return the result of query execution
  res.json(result);
})

// get Members
app.get('/api/members', (req, res) => {

  // get all members from crud.readAllMembers()
  const members = readAllMembers();

  // output members in a json format
  res.json(members);

});

// get Member by ID
app.get('/api/members/:id', (req,res) => {
  // get the member from crud.readMember(id)
  const member = readMember(parseInt(req.params.id));

  // output that member's data in json format
  res.json(member);
})

// PUT endpoint for updating Members
app.put('/api/members/:id', (req,res) => {

  // get id and parameters from PUT request
  const id = req.params.id;
  const {first_name, last_name, email, phone, dob} = req.body;

  // pass params to updateMember()
  const result = updateMember(id, first_name, last_name, email, phone, dob);

  // return the result 
  res.json(result);

})

///////////////////

///// MEMBERSHIPS /////

// POST endpoint for creating new memberships
app.post('/api/memberships', (req,res) => {
  // get params from request body
  const {member_id, name, price, type, start_date, expire_date} = req.body;

  // pass params to create function
  const result = createMembership(member_id, name, price, type, start_date, expire_date);

  // return the result of query execution
  res.json(result);
})

// get Memberships
app.get('/api/memberships', (req, res) => {

  // get all members from crud.readAllMemberships()
  const memberships = readAllMemberships();

  // output Memberships in a json format
  res.json(memberships);

});

// get Membership by ID
app.get('/api/memberships/:id', (req,res) => {
  // get the membership from crud.readMemberships(id)
  const membership = readMembership(parseInt(req.params.id));

  // output that membership's data in json format
  res.json(membership);
})

// PUT endpoint for updating Memberships
app.put('/api/memberships/:id', (req,res) => {

  // get id and parameters from PUT request
  const id = req.params.id;
  const {member_id, name, price, type, start_date, expire_date} = req.body;

  // pass params to update function
  const result = updateMembership(id, member_id, name, price, type, start_date, expire_date);

  // return the result 
  res.json(result);

})

///////////////////////

///// INSTRUCTORS /////

// POST endpoint for creating new instructors
app.post('/api/instructors', (req,res) => {
  // get params from request body
  const {first_name, last_name, email, phone, dob, status} = req.body;

  // pass params to create function
  const result = createInstructor(first_name, last_name, email, phone, dob, status);

  // return the result of query execution
  res.json(result);
})

// get Instructors
app.get('/api/instructors', (req, res) => {

  // get all Instructors from crud.readAllInstructors()
  const instructors = readAllInstructors();

  // output Instructors in a json format
  res.json(instructors);

});

// get Instructor by ID
app.get('/api/instructors/:id', (req,res) => {
  // get the instructor from crud.readInstructor(id)
  const instructor = readInstructor(parseInt(req.params.id));

  // output that instructor's data in json format
  res.json(instructor);
})

// PUT endpoint for updating Instructors
app.put('/api/instructors/:id', (req,res) => {

  // get id and parameters from PUT request
  const id = req.params.id;
  const {first_name, last_name, email, phone} = req.body;

  // pass params to update function
  const result = updateInstructor(id, first_name, last_name, email, phone);

  // return the result 
  res.json(result);

})

///////////////////////

///// CLASSES /////

// POST endpoint for creating new classes
app.post('/api/classes', (req,res) => {
  // get params from request body
  const {class_name, instructor_id, date_time} = req.body;

  // pass params to create function
  const result = createClass(class_name, instructor_id, date_time);

  // return the result of query execution
  res.json(result);
})

// get Classes
app.get('/api/classes', (req, res) => {

  // get all Instructors from crud.readAllClasses()
  const classes = readAllClasses();

  // output Classes in a json format
  res.json(classes);

});

// get class by ID
app.get('/api/classes/:id', (req,res) => {
  // get the class from crud.readClass(id)
  // NOTE: called "classObject" because "class" is a reserved word.
  const classObject = readClass(parseInt(req.params.id)); 

  // output that class's data in json format
  res.json(classObject);
})

// PUT endpoint for updating Classes
app.put('/api/classes/:id', (req,res) => {

  // get id and parameters from PUT request
  const id = req.params.id;
  const {instructor_id, name, schedule, capacity} = req.body;

  // pass params to update function
  const result = updateClass(id, instructor_id, name, schedule, capacity);

  // return the result 
  res.json(result);

})

///////////////////

///// BOOKINGS /////

// POST endpoint for creating new bookings
app.post('/api/bookings', (req,res) => {
  // get params from request body
  const {member_id, class_id, booking_time, cancellation_time, status} = req.body;

  // pass params to create function
  const result = createBooking(member_id, class_id, booking_time, cancellation_time, status);

  // return the result of query execution
  res.json(result);
})

// get Bookings
app.get('/api/bookings', (req, res) => {

  // get all Instructors from crud.readAllBookings()
  const bookings = readAllBookings();

  // output Bookings in a json format
  res.json(bookings);

});

// get booking by ID
app.get('/api/bookings/:id', (req,res) => {
  // get the booking from crud.readBooking(id)
  const booking = readBooking(parseInt(req.params.id)); 

  // output that booking's data in json format
  res.json(booking);
})

// PUT endpoint for updating Bookings
app.put('/api/bookings/:id', (req,res) => {

  // get id and parameters from PUT request
  const id = req.params.id;
  const {member_id, class_id, booking_date} = req.body;

  // pass params to update function
  const result = updateBooking(id, member_id, class_id, booking_date);

  // return the result 
  res.json(result);

})

////////////////////

//////////////////////

// Start server listening
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
