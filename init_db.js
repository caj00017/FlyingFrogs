// The following Create Table functions are to be executed once
// when initializing a new application (init_db.js)

// Authors: Nathan McDonald, Chris Jones

// init_db.js - Fixed table creation order
const Database = require('better-sqlite3');

// specify the db file, if it doesn't exist already, it's created here
const db = new Database('source.db');

// Enable foreign keys
db.pragma('foreign_keys = ON');

function createMembersTable() {
    // building the query that will create a new table for Members
    let sql = `
        CREATE TABLE IF NOT EXISTS Members (
        member_id INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name VARCHAR NOT NULL,
        last_name VARCHAR NOT NULL,
        email VARCHAR NOT NULL UNIQUE,
        phone VARCHAR NOT NULL,
        dob DATE NOT NULL
        );
    `;

    // logging and executing
    console.log("Creating Members table...");
    db.exec(sql);
}

function createMembershipsTable() {
    // building the query that will create a new table for Memberships
    let sql = `
        CREATE TABLE IF NOT EXISTS Memberships (
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
    console.log("Creating Memberships table...");
    db.exec(sql);
}

function createClassesTable() {
    // building the query that will create a new table for Classes
    let sql = `
        CREATE TABLE IF NOT EXISTS Classes (
        class_id INTEGER PRIMARY KEY AUTOINCREMENT,
        class_name VARCHAR(100) NOT NULL,
        instructor_id INTEGER NOT NULL,
        date_time DATETIME NOT NULL,
        num_members INTEGER NOT NULL DEFAULT 0,
        FOREIGN KEY (instructor_id) REFERENCES Instructors(instructor_id)
        );
    `;

    // logging and executing
    console.log("Creating Classes table...");
    db.exec(sql);
}

function createInstructorsTable() {
    // building the query that will create a new table for Instructors
    let sql = `
        CREATE TABLE IF NOT EXISTS Instructors (
        instructor_id INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name VARCHAR NOT NULL,
        last_name VARCHAR NOT NULL,
        email VARCHAR NOT NULL UNIQUE,
        phone VARCHAR NOT NULL,
        dob VARCHAR NOT NULL,
        status TEXT NOT NULL DEFAULT 'active'
            CHECK (status IN ('active', 'on_leave', 'inactive'))
        );
    `;

    // logging and executing
    console.log("Creating Instructors table...");
    db.exec(sql);
}

function createBookingsTable() {
    // building the query that will create a new table for Bookings
    let sql = `CREATE TABLE IF NOT EXISTS Bookings (
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
    console.log("Creating Bookings table...");
    db.exec(sql);
}

// Create tables in correct order (parent tables first)
createMembersTable();
createInstructorsTable();
createClassesTable();
createMembershipsTable();
createBookingsTable();

console.log('Database initialization complete!');