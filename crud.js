// Functions for Create, Read, Update, and Delete
// Authors: Nathan McDonald, Noah Yoak

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
 * retrieves a single member
 * 
 * @param member_id the ID Of the member
 * @returns {Array<Objects>} an array of all member rows (empty if none exist)
 */
export function readMember(member_id){
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
export function readAllMembers() {
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
export function createMembership(member_id, name, price, type, start_date, expire_date) {
  const sql = `
    INSERT INTO Memberships (member_id, name, price, type, start_date, expire_date)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  return;
}



function updateMember(id, first_name, last_name, email, phone, dob){
  let sql = "UPDATE Members SET first_name = ?, last_name = ?, email = ?, phone = ? WHERE id = ?"


}