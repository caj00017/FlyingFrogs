// Functions for Create, Read, Update, and Delete
// Authors: Nathan McDonald, Noah Yoak

// databasesync is like a constructor that opens and talks to database files
const { DatabaseSync } = require('node:sqlite');

// opens the sqlite database file. sqlite creates it if it doesn't exist i believe
const db = new DatabaseSync('source.db');


/**
 * holy shit vs code auto adds the params in nodejs. That's fucking awesome
 * @param {*} id - Auto generated member_id of the new row (At least I think they're auto gen'd)
 * @param {*} first_name - members first name
 * @param {*} last_name members last name
 * @param {*} email members email address (must be unique)
 * @param {*} phone memebrs phone number
 * @param {*} dob memebers date of birth (YYY-MM-DD)
 */
export function createMember(id, first_name, last_name, email, phone, dob) {
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
 * 
 * Retrieves every member in the members table
 * @returns {Array<Objects>} an array of all member rows (empty if none exist)
 */
export function readMember(){
  // get all columns from every row in members table
  const sql = `SELECT * FROM Members WHERE member_id = ?`;

  console.log("Attempting to execute query: " + sql);

  const stmt = db.prepare(sql);

  // returns all matching rows as a plaina rray of JS objects
  return stmt.all();
}







function updateMember(id, first_name, last_name, email, phone, dob){
  let sql = "UPDATE Members SET first_name = ?, last_name = ?, email = ?, phone = ? WHERE id = ?"


}