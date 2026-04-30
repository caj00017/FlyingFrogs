const {
 createMember,
 createInstructor,
 createClass,
 createMembership,
 createBooking
} = require('./crud');


console.log('🌱 Seeding database with sample data...\n');


// ============ INSTRUCTORS ============
console.log('Creating instructors...');
try {
 const instructor1 = createInstructor('John', 'Smith', 'john@flyingfrogs.com', '5550101', '1985-03-15', 'active');
 console.log(`  ✓ Created instructor: John Smith (ID: ${instructor1})`);


 const instructor2 = createInstructor('Sarah', 'Johnson', 'sarah@flyingfrogs.com', '5550102', '1990-07-22', 'active');
 console.log(`  ✓ Created instructor: Sarah Johnson (ID: ${instructor2})`);


 const instructor3 = createInstructor('Mike', 'Wilson', 'mike@flyingfrogs.com', '5550103', '1988-11-30', 'active');
 console.log(`  ✓ Created instructor: Mike Wilson (ID: ${instructor3})`);


 const instructor4 = createInstructor('Emily', 'Davis', 'emily@flyingfrogs.com', '5550104', '1992-04-18', 'on_leave');
 console.log(`  ✓ Created instructor: Emily Davis (ID: ${instructor4})`);
} catch (error) {
 console.error('  ✗ Error creating instructors:', error.message);
}


// ============ MEMBERS ============
console.log('\nCreating members...');
try {
 const member1 = createMember('Alice', 'Williams', 'alice@email.com', '5550201', '1995-01-10');
 console.log(`  ✓ Created member: Alice Williams (ID: ${member1})`);


 const member2 = createMember('Bob', 'Brown', 'bob@email.com', '5550202', '1992-05-20');
 console.log(`  ✓ Created member: Bob Brown (ID: ${member2})`);


 const member3 = createMember('Carol', 'Martinez', 'carol@email.com', '5550203', '1998-08-15');
 console.log(`  ✓ Created member: Carol Martinez (ID: ${member3})`);


 const member4 = createMember('David', 'Garcia', 'david@email.com', '5550204', '1993-12-03');
 console.log(`  ✓ Created member: David Garcia (ID: ${member4})`);


 const member5 = createMember('Eva', 'Anderson', 'eva@email.com', '5550205', '1997-06-28');
 console.log(`  ✓ Created member: Eva Anderson (ID: ${member5})`);
} catch (error) {
 console.error('  ✗ Error creating members:', error.message);
}


// ============ CLASSES ============
console.log('\nCreating classes...');
try {
 const today = new Date();
 const tomorrow = new Date(today);
 tomorrow.setDate(tomorrow.getDate() + 1);
 tomorrow.setHours(8, 0, 0, 0);
  const nextDay = new Date(today);
 nextDay.setDate(nextDay.getDate() + 2);
 nextDay.setHours(10, 0, 0, 0);
  const nextWeek = new Date(today);
 nextWeek.setDate(nextWeek.getDate() + 7);
 nextWeek.setHours(14, 0, 0, 0);


 const formatDateTime = (date) => {
   const year = date.getFullYear();
   const month = String(date.getMonth() + 1).padStart(2, '0');
   const day = String(date.getDate()).padStart(2, '0');
   const hours = String(date.getHours()).padStart(2, '0');
   const minutes = String(date.getMinutes()).padStart(2, '0');
   return `${year}-${month}-${day} ${hours}:${minutes}`;
 };


 const class1 = createClass('Morning Yoga', 1, formatDateTime(tomorrow));
 console.log(`  ✓ Created class: Morning Yoga (ID: ${class1})`);


 const class2 = createClass('HIIT Training', 2, formatDateTime(nextDay));
 console.log(`  ✓ Created class: HIIT Training (ID: ${class2})`);


 const class3 = createClass('Spin Class', 1, formatDateTime(nextWeek));
 console.log(`  ✓ Created class: Spin Class (ID: ${class3})`);


 const class4 = createClass('Pilates', 3, formatDateTime(tomorrow));
 console.log(`  ✓ Created class: Pilates (ID: ${class4})`);


 const class5 = createClass('Strength Training', 2, formatDateTime(nextWeek));
 console.log(`  ✓ Created class: Strength Training (ID: ${class5})`);
} catch (error) {
 console.error('  ✗ Error creating classes:', error.message);
}


// ============ MEMBERSHIPS ============
console.log('\nCreating memberships...');
try {
 const today = new Date();
 const nextMonth = new Date(today);
 nextMonth.setMonth(nextMonth.getMonth() + 1);
 const nextYear = new Date(today);
 nextYear.setFullYear(nextYear.getFullYear() + 1);
 const lastMonth = new Date(today);
 lastMonth.setMonth(lastMonth.getMonth() - 1);
 const threeMonths = new Date(today);
 threeMonths.setMonth(threeMonths.getMonth() + 3);


 const formatDate = (date) => date.toISOString().split('T')[0];


 const membership1 = createMembership(1, 'Basic Plan', 19.99, 'monthly', formatDate(today), formatDate(nextMonth));
 console.log(`  ✓ Created membership: Basic Plan monthly for Member #1 (ID: ${membership1})`);


 const membership2 = createMembership(2, 'Premium Plan', 499.99, 'annual', formatDate(today), formatDate(nextYear));
 console.log(`  ✓ Created membership: Premium Plan annual for Member #2 (ID: ${membership2})`);


 const membership3 = createMembership(3, 'Standard Plan', 89.99, 'quarterly', formatDate(today), formatDate(threeMonths));
 console.log(`  ✓ Created membership: Standard Plan quarterly for Member #3 (ID: ${membership3})`);


 const membership4 = createMembership(4, 'Basic Plan', 49.99, 'quarterly', formatDate(lastMonth), formatDate(today));
 console.log(`  ✓ Created membership: Basic Plan quarterly for Member #4 (EXPIRED) (ID: ${membership4})`);


 const membership5 = createMembership(5, 'Standard Plan', 34.99, 'monthly', formatDate(today), formatDate(nextMonth));
 console.log(`  ✓ Created membership: Standard Plan monthly for Member #5 (ID: ${membership5})`);
} catch (error) {
 console.error('  ✗ Error creating memberships:', error.message);
}


// ============ BOOKINGS ============
console.log('\nCreating bookings...');
try {
 const now = new Date();
 const formatDateTime = (date) => {
   const year = date.getFullYear();
   const month = String(date.getMonth() + 1).padStart(2, '0');
   const day = String(date.getDate()).padStart(2, '0');
   const hours = String(date.getHours()).padStart(2, '0');
   const minutes = String(date.getMinutes()).padStart(2, '0');
   const seconds = String(date.getSeconds()).padStart(2, '0');
   return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
 };


 const booking1 = createBooking(1, 1, formatDateTime(now), null, 'confirmed');
 console.log(`  ✓ Created booking: Member #1 → Class #1 (ID: ${booking1})`);


 const booking2 = createBooking(2, 1, formatDateTime(now), null, 'confirmed');
 console.log(`  ✓ Created booking: Member #2 → Class #1 (ID: ${booking2})`);


 const booking3 = createBooking(3, 2, formatDateTime(now), null, 'confirmed');
 console.log(`  ✓ Created booking: Member #3 → Class #2 (ID: ${booking3})`);


 const booking4 = createBooking(4, 3, formatDateTime(now), null, 'confirmed');
 console.log(`  ✓ Created booking: Member #4 → Class #3 (ID: ${booking4})`);


 const booking5 = createBooking(5, 4, formatDateTime(now), null, 'cancelled');
 console.log(`  ✓ Created booking: Member #5 → Class #4 (CANCELLED) (ID: ${booking5})`);


 const booking6 = createBooking(1, 5, formatDateTime(now), null, 'confirmed');
 console.log(`  ✓ Created booking: Member #1 → Class #5 (ID: ${booking6})`);
} catch (error) {
 console.error('  ✗ Error creating bookings:', error.message);
}


console.log('\n✅ Sample data seeding complete!');
console.log('\n📊 Summary:');
console.log('   - 4 Instructors');
console.log('   - 5 Members');
console.log('   - 5 Classes');
console.log('   - 5 Memberships (1 expired)');
console.log('   - 6 Bookings (1 cancelled)');
console.log('\n🚀 Ready to start! Run: npm run start');
