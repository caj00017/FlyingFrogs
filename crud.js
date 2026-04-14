// Functions for Create, Read, Update, and Delete
// Authors: Nathan McDonald, Noah Yoak, Chris Jones
// Version: April 14 2026

// databasesync is like a constructor that opens and talks to database files
const { DatabaseSync } = require('node:sqlite');

// opens the sqlite database file. sqlite creates it if it doesn't exist i believe
const db = new DatabaseSync('source.db');


// MEMBERS

/**
 * holy shit vs code auto adds the params in nodejs. That's fucking awesome
 * @param {*} id - Auto generated member_id of the new row (At least I think they're auto gen'd)
 * @param {*} first_name - members first name
 * @param {*} last_name members last name
 * @param {*} email members email address (must be unique)
 * @param {*} phone memebrs phone number
 * @param {*} dob memebers date of birth (YYY-MM-DD)
 */
function createMember(id, first_name, last_name, email, phone, dob) {
  let sql = `
  INSERT INTO Members  (first_name, last_name, email, phone, dob)
  VALUES (?, ?, ?, ?, ?)
  ;`


  console.log("Executing query, let's hoep this works: " + sql);


  // apparently this stops sql injections to which is pretty cool becuase it compiles the sql structure before user data touches it
  const stmt = db.prepare(sql);

  const result = stmt.run(first_name, last_name, email, phone, dob); 

  return result.lastInsertRowid;
}

/**
 * retrieves a single member
 * 
 * @param member_id the ID Of the member
 * @returns {Array<Objects>} an array of all member rows (empty if none exist)
 */
function readMember(member_id){
  // get all columns from every row in members table
  const sql = `SELECT * FROM Members WHERE member_id = ?`;

  console.log("Attempting to execute query: " + sql);

  const stmt = db.prepare(sql);

  return stmt.get(member_id);
}

/**
 * Pretty self explanatory, just retrieves every member in members table
 * 
 * @returns {Array<Object>} all matching rows as an array of plan js objects
 */
function readAllMembers() {
  const sql = `SELECT * FROM Members`;

  console.log("Attempting to execute query: " + sql);

  const stmt = db.prepare(sql);

  return stmt.all();
}


// MEMBERSHIPS

/**
 * Inserts a new membership record and links it to an existing member.
 * A single member can hold multiple memberships over time (e.g. renewals).
 *
 * @param {number} member_id reference to the member who owns this membership
 * @param {string} name Display name for the membership (e.g. "Gold Plan")
 * @param {number} price Cost of the membership (stored as DECIMAL)
 * @param {string} type Membership category (e.g. "monthly", "annual")
 * @param {string} start_date Start date (YYYY-MM-DD)
 * @param {string} expire_date Expiry date (YYYY-MM-DD)
 * @returns {number} The auto-generated membership_id of the new row
 */
function createMembership(member_id, name, price, type, start_date, expire_date) {
  const sql = `
    INSERT INTO Memberships (member_id, name, price, type, start_date, expire_date)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  return;
}



function updateMember(id, first_name, last_name, email, phone, dob){
  let sql = "UPDATE Members SET first_name = ?, last_name = ?, email = ?, phone = ? WHERE id = ?"


}

/**
 * Pretty self explanatory, just retrieves every membership in memberships table
 * 
 * @returns {Array<Object>} all matching rows as an array of plan js objects
 */
function readAllMemberships() {
  const sql = `SELECT * FROM Memberships`;

  console.log("Attempting to execute query: " + sql);

  const stmt = db.prepare(sql);

  return stmt.all();
}


///// INSTRUCTORS /////

/**
 * Retrieve all instructors from the instructors table
 * @returns {Array<Object>} All rows in the Instructors table as an array of JS objects.
 * @author Chris Jones
*/
function readAllInstructors() {

  // select all instructors
  const sql = "SELECT * FROM Instructors";

  // announce query for debugging
  console.log("Attempting to execute query: " + sql);

  // prepare statement
  const stmt = db.prepare(sql);

  // execute and return
  return stmt.all();

}

///////////////////////

///// CLASSES /////

/**
 * Retrieve all classes from the classes table
 * @returns {Array<Object>} All rows in the Classes table as an array of JS objects.
 * @author Chris Jones
*/
function readAllClasses() {

  // select all classes
  const sql = "SELECT * FROM Classes";

  // announce query for debugging
  console.log("Attempting to execute query: " + sql);

  // prepare statement
  const stmt = db.prepare(sql);

  // execute and return
  return stmt.all();
  
}

///////////////////

///// BOOKINGS /////

/**
 * Retrieve all Bookings from the Bookings table
 * @returns {Array<Object>} All rows in the Bookings table as an array of JS objects.
 * @author Chris Jones
*/
function readAllBookings() {

  // select all Bookings
  const sql = "SELECT * FROM Bookings";

  // announce query for debugging
  console.log("Attempting to execute query: " + sql);

  // prepare statement
  const stmt = db.prepare(sql);

  // execute and return
  return stmt.all();

}

////////////////////

// Export modules, this is CommonJS syntax (package.json shows type: commonjs).
// The export keyword is used in "ES module" syntax (used by React, etc.)
// The app was crashing here before, so hopefully this fixes it
module.exports = {
  createMember,
  readMember,
  readAllMembers,
  createMembership,
  readAllMemberships,
  readAllInstructors,
  readAllClasses,
  readAllBookings,
};