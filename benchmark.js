// benchmark.js
// run with node benchmark.js
const Database = require('better-sqlite3');
const fs = require('fs');

// Use a separate DB so you don't pollute source.db
if (fs.existsSync('benchmark.db')) fs.unlinkSync('benchmark.db');
const db = new Database('benchmark.db');

// build schema copied over from init_db
db.exec(`
  CREATE TABLE Members (
    member_id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name VARCHAR NOT NULL,
    last_name VARCHAR NOT NULL,
    email VARCHAR NOT NULL UNIQUE,
    phone INTEGER NOT NULL,
    dob DATE NOT NULL
  );
  CREATE TABLE Instructors (
    instructor_id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name VARCHAR NOT NULL,
    last_name VARCHAR NOT NULL,
    email VARCHAR NOT NULL UNIQUE,
    phone INTEGER NOT NULL,
    dob VARCHAR NOT NULL,
    status TEXT NOT NULL DEFAULT 'active'
  );
  CREATE TABLE Classes (
    class_id INTEGER PRIMARY KEY AUTOINCREMENT,
    class_name VARCHAR(100) NOT NULL,
    instructor_id INTEGER NOT NULL,
    date_time DATETIME NOT NULL,
    num_members INTEGER NOT NULL DEFAULT 0
  );
  CREATE TABLE Memberships (
    membership_id INTEGER PRIMARY KEY AUTOINCREMENT,
    member_id INTEGER NOT NULL,
    name VARCHAR NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    type VARCHAR NOT NULL,
    start_date DATE NOT NULL,
    expire_date DATE NOT NULL
  );
  CREATE TABLE Bookings (
    booking_id INTEGER PRIMARY KEY AUTOINCREMENT,
    member_id INTEGER NOT NULL,
    class_id INTEGER NOT NULL,
    booking_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status TEXT NOT NULL DEFAULT 'confirmed',
    cancellation_time DATETIME
  );
`);

const NUM_MEMBERS = 5000;
const NUM_INSTRUCTORS = 20;
const NUM_CLASSES = 500;
const NUM_BOOKINGS = 50000;

console.log('Seeding data...');

const insertMember = db.prepare(
  `INSERT INTO Members (first_name, last_name, email, phone, dob) VALUES (?, ?, ?, ?, ?)`
);
const insertInstructor = db.prepare(
  `INSERT INTO Instructors (first_name, last_name, email, phone, dob, status) VALUES (?, ?, ?, ?, ?, 'active')`
);
const insertClass = db.prepare(
  `INSERT INTO Classes (class_name, instructor_id, date_time) VALUES (?, ?, ?)`
);
const insertBooking = db.prepare(
  `INSERT INTO Bookings (member_id, class_id, status) VALUES (?, ?, ?)`
);

const FIRST = ['Lebron','Michael','Kobe','Kareem','Bill','Larry','Jerry','Wilt','Tim','John'];
const LAST  = ['James','Jorden','Bryant','Abdul-Jabar','Russell','Bird','West','Chamberlain','Duncan','Wall'];
const STATUSES = ['confirmed','confirmed','confirmed','cancelled','attended','no_show'];

const seed = db.transaction(() => {
  for (let i = 0; i < NUM_MEMBERS; i++) {
    insertMember.run(
      FIRST[i % FIRST.length],
      LAST[i % LAST.length],
      `member${i}@test.com`,
      5550000000 + i,
      '1990-01-01'
    );
  }
  for (let i = 0; i < NUM_INSTRUCTORS; i++) {
    insertInstructor.run('Inst', `Number${i}`, `inst${i}@test.com`, 5551000000 + i, '1985-01-01');
  }
  for (let i = 0; i < NUM_CLASSES; i++) {
    insertClass.run('Yoga', (i % NUM_INSTRUCTORS) + 1, '2026-06-01 09:00:00');
  }
  for (let i = 0; i < NUM_BOOKINGS; i++) {
    insertBooking.run(
      (i % NUM_MEMBERS) + 1,
      (i % NUM_CLASSES) + 1,
      STATUSES[i % STATUSES.length]
    );
  }
});
seed();
console.log(`Seeded ${NUM_MEMBERS} members, ${NUM_BOOKINGS} bookings.\n`);

// Define the queries to compare
const queries = [
  {
    label: "Lookup member's bookings",
    sql:   "SELECT * FROM Bookings WHERE member_id = ?",
    args:  () => [Math.floor(Math.random() * NUM_MEMBERS) + 1],
  },
  {
    label: "Lookup class's bookings",
    sql:   "SELECT * FROM Bookings WHERE class_id = ?",
    args:  () => [Math.floor(Math.random() * NUM_CLASSES) + 1],
  },
  {
    label: "Confirmed bookings for member",
    sql:   "SELECT * FROM Bookings WHERE member_id = ? AND status = 'confirmed'",
    args:  () => [Math.floor(Math.random() * NUM_MEMBERS) + 1],
  },
  {
    label: "Search members by last name",
    sql:   "SELECT * FROM Members WHERE last_name = ? COLLATE NOCASE",
    args:  () => [LAST[Math.floor(Math.random() * LAST.length)]],
  },
];

// Run each query 1000 times and time it 
function bench(label) {
  console.log(`\n${label}`);
  for (const q of queries) {
    const stmt = db.prepare(q.sql);
    const plan = db.prepare(`EXPLAIN QUERY PLAN ${q.sql}`).all(...q.args());

    const ITER = 1000;
    const start = process.hrtime.bigint();
    for (let i = 0; i < ITER; i++) stmt.all(...q.args());
    const elapsedMs = Number(process.hrtime.bigint() - start) / 1e6;

    console.log(`\n${q.label}`);
    console.log(`  Plan: ${plan.map(p => p.detail).join(' | ')}`);
    console.log(`  Time: ${elapsedMs.toFixed(1)} ms total, ${(elapsedMs / ITER).toFixed(3)} ms/query`);
  }
}

// no indexes other than what PRIMARY KEY/ UNIQUE gives 
bench('WITHOUT custom indexes');

// Add indexes and re-run 
db.exec(`
  CREATE INDEX idx_bookings_member_id    ON Bookings(member_id);
  CREATE INDEX idx_bookings_class_id     ON Bookings(class_id);
  CREATE INDEX idx_bookings_member_status ON Bookings(member_id, status);
  CREATE INDEX idx_members_last_name     ON Members(last_name COLLATE NOCASE);
`);
db.exec('ANALYZE');  // let planner know the new indexes exist

bench('WITH indexes');

console.log('\nDone');