// The following Create Table functions are to be executed once
// when initializing a new application (init_db.js)

// Authors: Nathan McDonald, Chris Jones

// use the DatabaseSync API from the built-in sqlite module.
const Database = require('better-sqlite3');

// specify the db file, if it doesn't exist already, it's created here
const db = new Database('source.db');

function createMembersTable() {
    // building the query that will create a new table for Members
    let sql = `
        CREATE TABLE Members (
        member_id INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name VARCHAR NOT NULL,
        last_name VARCHAR NOT NULL,
        email VARCHAR NOT NULL UNIQUE,
        phone INTEGER NOT NULL,
        dob DATE NOT NULL
        );
    `;

    // logging and executing
    console.log("Attempting to execute query: " + sql);
    db.exec(sql);
}

function createMembershipsTable() {
    // building the query that will create a new table for Memberships
    let sql = `
        CREATE TABLE Memberships (
        membership_id INTEGER PRIMARY KEY AUTOINCREMENT,
        member_id INTEGER NOT NULL,
        name VARCHAR NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        type VARCHAR NOT NULL, 
        start_date DATE NOT NULL,
        expire_date DATE NOT NULL,
        FOREIGN KEY (member_id) REFERENCES Members(member_id)
        );
    `;

    // logging and executing
    console.log("Attempting to execute query: " + sql);
    db.exec(sql);
}

function createClassesTable() {
    // building the query that will create a new table for Classes
    let sql = `
        CREATE TABLE Classes (
        class_id INTEGER PRIMARY KEY AUTOINCREMENT,
        class_name VARCHAR(100) NOT NULL,
        instructor_id INTEGER NOT NULL,
        date_time DATETIME NOT NULL,
        num_members INTEGER NOT NULL DEFAULT 0,
        FOREIGN KEY (instructor_id) REFERENCES Instructors(instructor_id)
        );
    `;

    // logging and executing
    console.log("Attempting to execute query: " + sql);
    db.exec(sql);
}

function createInstructorsTable() {
    // building the query that will create a new table for Instructors
    let sql = `
        CREATE TABLE Instructors (
        instructor_id INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name VARCHAR NOT NULL,
        last_name VARCHAR NOT NULL,
        email VARCHAR NOT NULL UNIQUE,
        phone INTEGER NOT NULL,
        dob VARCHAR NOT NULL,
        status TEXT NOT NULL DEFAULT 'active'
            CHECK (status IN ('active', 'on_leave', 'inactive'))
        );
    `;

    // logging and executing
    console.log("Attempting to execute query: " + sql);
    db.exec(sql);
}

function createBookingsTable() {
    // building the query that will create a new table for Bookings
    let sql = `CREATE TABLE Bookings (
        booking_id INTEGER PRIMARY KEY AUTOINCREMENT,
        member_id INTEGER NOT NULL,
        class_id INTEGER NOT NULL,
        booking_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        status TEXT NOT NULL DEFAULT 'confirmed'
        CHECK (status IN ('confirmed', 'cancelled', 'attended', 'no_show')),
        cancellation_time DATETIME,
        FOREIGN KEY (member_id) REFERENCES Members(member_id),
        FOREIGN KEY (class_id) REFERENCES Classes(class_id)
        );
    `;

    // logging and executing
    console.log("Attempting to execute query: " + sql);
    db.exec(sql);
}

function createIndexes() {
  const sql = `
    -- Foreign keys
    CREATE INDEX IF NOT EXISTS idx_memberships_member_id ON Memberships(member_id);
    CREATE INDEX IF NOT EXISTS idx_classes_instructor_id ON Classes(instructor_id);
    CREATE INDEX IF NOT EXISTS idx_bookings_member_id    ON Bookings(member_id);
    CREATE INDEX IF NOT EXISTS idx_bookings_class_id     ON Bookings(class_id);

    -- Search / filter
    CREATE INDEX IF NOT EXISTS idx_members_last_name        ON Members(last_name  COLLATE NOCASE);
    CREATE INDEX IF NOT EXISTS idx_members_first_name       ON Members(first_name COLLATE NOCASE);
    CREATE INDEX IF NOT EXISTS idx_classes_date_time        ON Classes(date_time);
    CREATE INDEX IF NOT EXISTS idx_memberships_expire_date  ON Memberships(expire_date);

    -- Composites
    CREATE INDEX IF NOT EXISTS idx_bookings_member_status ON Bookings(member_id, status);
    CREATE INDEX IF NOT EXISTS idx_bookings_class_status  ON Bookings(class_id, status);
  `;
  console.log("Creating indexes...");
  db.exec(sql);
}

// create all necessary tables for the app
createMembersTable();
createInstructorsTable();
createClassesTable();
createMembershipsTable();
createBookingsTable();

// export each function to be used in other files
// now that i think about it, this actually might not be necessary, since this
// file is only executed once at the first initialization of the app
module.exports = {
    createMembersTable,
    createMembershipsTable,
    createClassesTable,
    createInstructorsTable,
    createBookingsTable
};