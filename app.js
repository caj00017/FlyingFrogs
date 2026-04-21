// FlyingFrogs App Routing
// Authors: Chris Jones
// Version: April 14 2026

// testing testing 1.. 2... 3
const express = require('express');
const { readAllMembers, readAllMemberships, readAllInstructors, readAllClasses, readAllBookings } = require('./crud');
const app = express();
const port = 3000;

app.use(express.static('public'));

// render home page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/login.html');
});

///// API ROUTES /////

// get Members
app.get('/api/members', (req, res) => {

  // get all members from crud.readAllMembers()
  const members = readAllMembers();

  // output members in a json format
  res.json(members);

});

// get Memberships
app.get('/api/memberships', (req, res) => {

  // get all members from crud.readAllMemberships()
  const memberships = readAllMemberships();

  // output Memberships in a json format
  res.json(memberships);

});

// get Instructors
app.get('/api/instructors', (req, res) => {

  // get all Instructors from crud.readAllInstructors()
  const instructors = readAllInstructors();

  // output Instructors in a json format
  res.json(instructors);

});

// get Classes
app.get('/api/classes', (req, res) => {

  // get all Instructors from crud.readAllClasses()
  const classes = readAllClasses();

  // output Classes in a json format
  res.json(classes);

});

// get Bookings
app.get('/api/bookings', (req, res) => {

  // get all Instructors from crud.readAllBookings()
  const bookings = readAllBookings();

  // output Bookings in a json format
  res.json(bookings);

});

//////////////////////

// Start server listening
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
