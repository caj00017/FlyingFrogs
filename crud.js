// Functions for Create, Read, Update, and Delete
// Authors: Nathan McDonald, Noah Yoak, Chris Jones
// Version: April 14 2026

// databasesync is like a constructor that opens and talks to database files
const Database = require('better-sqlite3');

// opens the sqlite database file. sqlite creates it if it doesn't exist i believe
const db = new Database('source.db');

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Clean up WAL files on exit
process.on('exit', () => {
  db.pragma('wal_checkpoint(TRUNCATE)');
  db.close();
});

process.on('SIGINT', () => {
  db.pragma('wal_checkpoint(TRUNCATE)');
  db.close();
  process.exit();
});

// MEMBERS

/**
 * holy shit vs code auto adds the params in nodejs. That's fucking awesome
 * @param {*} first_name - members first name
 * @param {*} last_name members last name
 * @param {*} email members email address (must be unique)
 * @param {*} phone memebrs phone number
 * @param {*} dob memebers date of birth (YYY-MM-DD)
 */
function createMember(first_name, last_name, email, phone, dob) {
  const sql = `
  INSERT INTO Members (first_name, last_name, email, phone, dob)
  VALUES (?, ?, ?, ?, ?)
  `;

  console.log(`Creating member: ${first_name} ${last_name}`);

  // apparently this stops sql injections to which is pretty cool becuase it compiles the sql structure before user data touches it
  const stmt = db.prepare(sql);

  const result = stmt.run(first_name, last_name, email, String(phone), dob);

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

/**
 * 
 * @param {*} id the ID of the member to update
 * @param {*} first_name the member's first name
 * @param {*} last_name the member's last name
 * @param {*} email the member's email
 * @param {*} phone the member's phone #
 * @param {*} dob the member's birthday
 * @returns 
 */
function updateMember(id, first_name, last_name, email, phone, dob){
   const sql = `
    UPDATE Members
    SET first_name = ?, last_name = ?, email = ?, phone = ?, dob = ?
    WHERE member_id = ?
  `;
  console.log("Attempting to executre query: " + sql);

  const stmt = db.prepare(sql);

  const result = stmt.run(first_name, last_name, email, String(phone), dob, id);
  return result.changes;

}

/**
 * @param {*} id the ID of the member to delete
 * @author Chris Jones
 */
function deleteMember(id) {

  // Since memberships and bookings are dependent on their respective member,
  // we must delete the associated membership and booking first
  // Without this, we'll get a FOREIGN KEY RESTRAINT error when trying to delete a member.

  // Delete each of this Member's bookings
  const deleteBookings = db.prepare("DELETE FROM Bookings WHERE member_id = ?");
  
  // delete each of this member's memberships
  const deleteMemberships = db.prepare("DELETE FROM Memberships WHERE member_id = ?");
  
  // delete the member themselves
  const deleteMemberStmt = db.prepare("DELETE FROM Members WHERE member_id = ?");

  // these 3 deletions should be packaged into a single transaction where the dependents are removed first
  const transaction = db.transaction((memberId) => {

    // run each of the prepared statements
    deleteBookings.run(memberId);
    deleteMemberships.run(memberId);
    const result = deleteMemberStmt.run(memberId);

    // return the result of member deletion
    return result.changes;
  });

  // pass the id to the transaction so it can run each statement and then return the result
  return transaction(id);
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

  console.log(`Creating membership: ${name} for member ${member_id}`);

  const stmt = db.prepare(sql);

  const result = stmt.run(member_id, name, Number(price), type, start_date, expire_date);
  return result.lastInsertRowid;
}

/**
 * @param {*} membership_id the ID of the membership to read
 * @author Chris Jones
 */
function readMembership(membership_id) {
  // prepare query to select a specific Member based on their id
  const sql = "SELECT * FROM Memberships WHERE membership_id = ?";

  // notify query execution and compile query
  console.log("Attempting to execute query: " + sql);
  const stmt = db.prepare(sql);

  // run the query and return the result
  return stmt.get(membership_id);
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

/**
 * Updates an existing membership record.
 *
 * @param {number} membership_id - The ID of the membership to update
 * @param {number} member_id - Updated reference to the owning member
 * @param {string} name - Updated display name
 * @param {number} price - Updated price
 * @param {string} type - Updated membership category
 * @param {string} start_date - Updated start date (YYYY-MM-DD)
 * @param {string} expire_date - Updated expiry date (YYYY-MM-DD)
 * @returns {number} Number of rows affected (0 means no membership with that ID was found)
 */
function updateMembership(membership_id, member_id, name, price, type, start_date, expire_date) {
  const sql = `
    UPDATE Memberships
    SET member_id = ?, name = ?, price = ?, type = ?, start_date = ?, expire_date = ?
    WHERE membership_id = ?
  `;
 
  console.log("Attempting to execute query: " + sql);
 
  const stmt = db.prepare(sql);
 
  const result = stmt.run(member_id, name, Number(price), type, start_date, expire_date, membership_id);
 
  return result.changes;
}
 
/**
 * Deletes a membership record from the database.
 *
 * @param {number} membership_id - The ID of the membership to delete
 * @returns {number} Number of rows affected (0 means no membership with that ID was found)
 */
function deleteMembership(membership_id) {
  const sql = `DELETE FROM Memberships WHERE membership_id = ?`;
 
  console.log("Attempting to execute query: " + sql);
 
  const stmt = db.prepare(sql);
 
  const result = stmt.run(membership_id);
 
  return result.changes;
}


///// INSTRUCTORS /////

function createInstructor(first_name, last_name, email, phone, dob, status) {
  // prepare query to create an instructor based on the given values
  const sql = `INSERT INTO Instructors (first_name, last_name, email, phone, dob, status)
  VALUES (?, ?, ?, ?, ?, ?)`;

  // notify query execution and compile the query
  console.log(`Creating instructor: ${first_name} ${last_name}`);
  const stmt = db.prepare(sql);

  // execute the query
  const result = stmt.run(first_name, last_name, email, String(phone), dob, status);

  // return the result of the query execution
  return result.lastInsertRowid;
}

/**
 * 
 * @param {*} instructor_id the ID of the instructor to read
 */
function readInstructor(instructor_id) {
  // prepare query to select a specific Instructor based on their id
  const sql = "SELECT * FROM Instructors WHERE instructor_id = ?";

  // notify query execution and compile query
  console.log("Attempting to execute query: " + sql);
  const stmt = db.prepare(sql);

  // run the query and return the result
  return stmt.get(instructor_id);
}

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

/**
 * Updates an existing instructor record.
 * Note: update this function's params to match your actual Instructors table columns.
 *
 * @param {number} instructor_id - The ID of the instructor to update
 * @param {string} first_name - Updated first name
 * @param {string} last_name - Updated last name
 * @param {string} email - Updated email address
 * @param {string} phone - Updated phone number
 * @returns {number} Number of rows affected (0 means no instructor with that ID was found)
 * @author Nathan McDonald
 */
function updateInstructor(instructor_id, first_name, last_name, email, phone, status) {
  const sql = `
    UPDATE Instructors
    SET first_name = ?, last_name = ?, email = ?, phone = ?, status = ?
    WHERE instructor_id = ?
  `;
 
  console.log(`Updating instructor ${instructor_id}: status to ${status}`);
 
  const stmt = db.prepare(sql);
 
  const result = stmt.run(first_name, last_name, email, String(phone), status, instructor_id);
 
  return result.changes;
}
 
/**
 * Deletes an instructor from the database.
 *
 * @param {number} instructor_id - The ID of the instructor to delete
 * @returns {number} Number of rows affected (0 means no instructor with that ID was found)
 * @author Nathan McDonald, Chris Jones
 */
function deleteInstructor(instructor_id) {

  // delete the bookings associated with this instructor
  const deleteBookings = db.prepare("DELETE FROM Bookings WHERE class_id IN (SELECT class_id FROM Classes WHERE instructor_id = ?)");
  
  // delete the classes associated with this instructor
  const deleteClasses = db.prepare("DELETE FROM Classes WHERE instructor_id = ?");
  
  // delete the instructor themself
  const deleteInstructorStmt = db.prepare("DELETE FROM Instructors WHERE instructor_id = ?");

  // create transaction
  const transaction = db.transaction((id) => {

    // run bookings deletion statement
    deleteBookings.run(id);

    // run classes deletion statement
    deleteClasses.run(id);

    // run instructor deletion statement
    const result = deleteInstructorStmt.run(id);

    // return the changes 
    return result.changes;
  });

  // run the transaction and return the result
  return transaction(instructor_id);
}

///////////////////////

///// CLASSES /////
/**
 * Inserts a new class ang assigns it to an instructor
 * num_members is omitted intentionally 
 * it should be incremented separately as bookings are made
 * 
 * @param {string} class_name name of class
 * @param {number} instructor_id instructor teaching
 * @param {string} date_time scheduled date and time
 * @returns {number} auto gen class_id of the new row
 */
function createClass(class_name, instructor_id, date_time){
  const sql = `
  INSERT INTO Classes (class_name, instructor_id, date_time)
  VALUES (?, ?, ?)
  `;

  console.log(`Creating class: ${class_name}`);

  const stmt = db.prepare(sql);
  const result = stmt.run(class_name, instructor_id, date_time);

  return result.lastInsertRowid;
}

/**
 * retrieves a signle class by its primary key
 * 
 * @param {number} class_id id of the class to look up
 * @returns {Object|undefined} the matching class row, or undefiend if not found
 */
function readClass(class_id){
  const sql = `SELECT * FROM Classes WHERE class_id = ?`;

  console.log("Attempting to execute query: " + sql);

  const stmt = db.prepare(sql);
  return stmt.get(class_id);
}

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

/**
 * Updates an existing class record.
 * Note: update this function's params to match your actual Classes table columns.
 *
 * @param {number} class_id - The ID of the class to update
 * @param {number} instructor_id - Updated reference to the instructor teaching the class
 * @param {string} name - Updated class name
 * @param {string} schedule - Updated schedule (e.g. "Mon/Wed 9:00 AM")
 * @param {number} capacity - Updated max number of attendees
 * @returns {number} Number of rows affected (0 means no class with that ID was found)
 * @author Nathan McDonald
 */
function updateClass(class_id, instructor_id, name, schedule, capacity) {
  const sql = `
    UPDATE Classes
    SET instructor_id = ?, class_name = ?, date_time = ?, num_members = ?
    WHERE class_id = ?
  `;
 
  console.log("Attempting to execute query: " + sql);
 
  const stmt = db.prepare(sql);
 
  const result = stmt.run(instructor_id, name, schedule, capacity, class_id);
 
  return result.changes;
}
 
/**
 * Deletes a class from the database.
 *
 * @param {number} class_id - The ID of the class to delete
 * @returns {number} Number of rows affected (0 means no class with that ID was found)
 * @author Nathan McDonald, Chris Jones
 */
function deleteClass(class_id) {

  const deleteBookings = db.prepare("DELETE FROM Bookings WHERE class_id = ?");
  const deleteClassStmt = db.prepare("DELETE FROM Classes WHERE class_id = ?");

  const transaction = db.transaction((classId) => {
    // run each of the prepared statements
    deleteBookings.run(classId);
    const result = deleteClassStmt.run(classId);

    // return the result of class deletion
    return result.changes;
  });

  // pass the id to the transaction so it can run each statement and then return the result
  return transaction(class_id);
}

///////////////////

///// BOOKINGS /////

function createBooking(member_id, class_id, booking_time, cancellation_time, status) {
  // prepare query to create a Booking based on the given values
  const sql = `
    INSERT INTO Bookings (member_id, class_id, booking_time, cancellation_time, status)
    VALUES (?, ?, ?, ?, ?)
  `;

  // notify query execution and compile query
  console.log(`Creating booking: member ${member_id} for class ${class_id}`);
  const stmt = db.prepare(sql);

  // execute the query and return result
  const result = stmt.run(member_id, class_id, booking_time, cancellation_time || null, status);
  return result.lastInsertRowid;
}

/**
 * @param {*} booking_id the ID of the class booking to read
 */
function readBooking(booking_id) {
  // prepare query to select a specific Booking based on its id
  const sql = "SELECT * FROM Bookings WHERE booking_id = ?";

  // notify query execution and compile query
  console.log("Attempting to execute query: " + sql);
  const stmt = db.prepare(sql);

  // run the query and return the result
  return stmt.get(booking_id);
}

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

/**
 * Updates an existing booking record.
 * Note: update this function's params to match your actual Bookings table columns.
 *
 * @param {number} booking_id - The ID of the booking to update
 * @param {number} member_id - Updated reference to the member who made the booking
 * @param {number} class_id - Updated reference to the booked class
 * @param {string} booking_date - Updated booking date (YYYY-MM-DD)
 * @returns {number} Number of rows affected (0 means no booking with that ID was found)
 * @author Nathan McDonald
 */
function updateBooking(booking_id, member_id, class_id, booking_date) {
  const sql = `
    UPDATE Bookings
    SET member_id = ?, class_id = ?, booking_time = ?
    WHERE booking_id = ?
  `;
 
  console.log("Attempting to execute query: " + sql);
 
  const stmt = db.prepare(sql);
 
  const result = stmt.run(member_id, class_id, booking_date, booking_id);
 
  return result.changes;
}
 
/**
 * Deletes a booking from the database.
 *
 * @param {number} booking_id - The ID of the booking to delete
 * @returns {number} Number of rows affected (0 means no booking with that ID was found)
 * @author Nathan McDonald
 */
function deleteBooking(booking_id) {
  const sql = `DELETE FROM Bookings WHERE booking_id = ?`;
 
  console.log("Attempting to execute query: " + sql);
 
  const stmt = db.prepare(sql);
 
  const result = stmt.run(booking_id);
 
  return result.changes;
}

////////////////////

// Export modules, this is CommonJS syntax (package.json shows type: commonjs).
// The export keyword is used in "ES module" syntax (used by React, etc.)
// The app was crashing here before, so hopefully this fixes it
module.exports = {
  createMember, readMember, readAllMembers, updateMember, deleteMember,
  createMembership, readMembership, readAllMemberships, updateMembership, deleteMembership,
  createInstructor, readInstructor, readAllInstructors, updateInstructor, deleteInstructor,
  createClass, readClass, readAllClasses, updateClass, deleteClass,
  createBooking, readBooking, readAllBookings, updateBooking, deleteBooking
};