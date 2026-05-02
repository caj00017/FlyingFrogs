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
 const instructor1 = createInstructor('John', 'Smith', 'john44@flyingfrogs.com', '5550101', '1985-03-15', 'active');
 console.log(`  ✓ Created instructor: John Smith (ID: ${instructor1})`);


 const instructor2 = createInstructor('Sarah', 'Johnson', 'sarah@flyingfrogs.com', '5550102', '1990-07-22', 'active');
 console.log(`  ✓ Created instructor: Sarah Johnson (ID: ${instructor2})`);


 const instructor3 = createInstructor('Mike', 'Wilson', 'mike@flyingfrogs.com', '5550103', '1988-11-30', 'active');
 console.log(`  ✓ Created instructor: Mike Wilson (ID: ${instructor3})`);


 const instructor4 = createInstructor('Emily', 'Davis', 'emily@flyingfrogs.com', '5550104', '1992-04-18', 'on_leave');
 console.log(`  ✓ Created instructor: Emily Davis (ID: ${instructor4})`);

 // New instructors (added 5/1/26)
  const instructor5 = createInstructor('Carlos', 'Reyes', 'carlos@flyingfrogs.com', '5550105', '1987-09-05', 'active');
  console.log(`  ✓ Created instructor: Carlos Reyes (ID: ${instructor5})`);
 
  const instructor6 = createInstructor('Priya', 'Patel', 'priya@flyingfrogs.com', '5550106', '1994-02-14', 'active');
  console.log(`  ✓ Created instructor: Priya Patel (ID: ${instructor6})`);
 
  const instructor7 = createInstructor('James', 'O\'Brien', 'james@flyingfrogs.com', '5550107', '1983-06-21', 'active');
  console.log(`  ✓ Created instructor: James O'Brien (ID: ${instructor7})`);
 
  const instructor8 = createInstructor('Natalie', 'Chen', 'natalie@flyingfrogs.com', '5550108', '1991-10-09', 'inactive');
  console.log(`  ✓ Created instructor: Natalie Chen (ID: ${instructor8})`);

  const instructor9 = createInstructor('Marcus', 'Bell', 'marcus@flyingfrogs.com', '5550109', '1986-08-14', 'active');
  console.log(`  ✓ Created instructor: Marcus Bell (ID: ${instructor9})`);

  const instructor10 = createInstructor('Yuki', 'Tanaka', 'yuki@flyingfrogs.com', '5550110', '1993-05-27', 'active');
  console.log(`  ✓ Created instructor: Yuki Tanaka (ID: ${instructor10})`);

  const instructor11 = createInstructor('Fatima', 'Malik', 'fatima@flyingfrogs.com', '5550111', '1989-12-03', 'active');
  console.log(`  ✓ Created instructor: Fatima Malik (ID: ${instructor11})`);
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

 // New members (added 5/1/26)
 const member6 = createMember('Steve', 'Anderson', 'steve@email.com', '5330205', '1993-06-27');
 console.log(`  ✓ Created member: Steve Anderson (ID: ${member6})`);

  const member7 = createMember('Lena', 'Nguyen', 'lena@email.com', '5550207', '1996-03-11');
  console.log(`  ✓ Created member: Lena Nguyen (ID: ${member7})`);
 
  const member8 = createMember('Omar', 'Hassan', 'omar@email.com', '5550208', '1990-11-25');
  console.log(`  ✓ Created member: Omar Hassan (ID: ${member8})`);
 
  const member9 = createMember('Tina', 'Roberts', 'tina@email.com', '5550209', '1999-04-07');
  console.log(`  ✓ Created member: Tina Roberts (ID: ${member9})`);
 
  const member10 = createMember('Marcus', 'Lee', 'marcus@email.com', '5550210', '1988-07-19');
  console.log(`  ✓ Created member: Marcus Lee (ID: ${member10})`);
 
  const member11 = createMember('Sofia', 'Russo', 'sofia@email.com', '5550211', '2000-09-30');
  console.log(`  ✓ Created member: Sofia Russo (ID: ${member11})`);
 
  const member12 = createMember('Derek', 'Kim', 'derek@email.com', '5550212', '1994-01-22');
  console.log(`  ✓ Created member: Derek Kim (ID: ${member12})`);
 
  const member13 = createMember('Jasmine', 'Taylor', 'jasmine@email.com', '5550213', '1997-08-04');
  console.log(`  ✓ Created member: Jasmine Taylor (ID: ${member13})`);
 
  const member14 = createMember('Ryan', 'Murphy', 'ryan@email.com', '5550214', '1991-02-16');
  console.log(`  ✓ Created member: Ryan Murphy (ID: ${member14})`);
 
  const member15 = createMember('Aisha', 'Okafor', 'aisha@email.com', '5550215', '2001-05-13');
  console.log(`  ✓ Created member: Aisha Okafor (ID: ${member15})`);

 // New members (added 5/1/26)
  const member16 = createMember('Nathan', 'Clarke', 'nathan@email.com', '5550216', '1989-03-24');
  console.log(`  ✓ Created member: Nathan Clarke (ID: ${member16})`);
 
  const member17 = createMember('Mei', 'Tanaka', 'mei@email.com', '5550217', '1998-11-02');
  console.log(`  ✓ Created member: Mei Tanaka (ID: ${member17})`);
 
  const member18 = createMember('Brandon', 'Scott', 'brandon@email.com', '5550218', '1994-07-17');
  console.log(`  ✓ Created member: Brandon Scott (ID: ${member18})`);
 
  const member19 = createMember('Fatima', 'Ali', 'fatima@email.com', '5550219', '1996-09-08');
  console.log(`  ✓ Created member: Fatima Ali (ID: ${member19})`);
 
  const member20 = createMember('Tyler', 'Bennett', 'tyler@email.com', '5550220', '1993-04-30');
  console.log(`  ✓ Created member: Tyler Bennett (ID: ${member20})`);
 
  const member21 = createMember('Hannah', 'Price', 'hannah@email.com', '5550221', '2000-01-15');
  console.log(`  ✓ Created member: Hannah Price (ID: ${member21})`);
 
  const member22 = createMember('Luis', 'Morales', 'luis@email.com', '5550222', '1987-06-11');
  console.log(`  ✓ Created member: Luis Morales (ID: ${member22})`);
 
  const member23 = createMember('Chloe', 'Evans', 'chloe@email.com', '5550223', '1999-12-20');
  console.log(`  ✓ Created member: Chloe Evans (ID: ${member23})`);
 
  const member24 = createMember('Jordan', 'Hayes', 'jordan@email.com', '5550224', '1995-08-03');
  console.log(`  ✓ Created member: Jordan Hayes (ID: ${member24})`);
 
  const member25 = createMember('Simone', 'Dubois', 'simone@email.com', '5550225', '1990-02-27');
  console.log(`  ✓ Created member: Simone Dubois (ID: ${member25})`);
 
  const member26 = createMember('Ethan', 'Flores', 'ethan@email.com', '5550226', '1997-10-14');
  console.log(`  ✓ Created member: Ethan Flores (ID: ${member26})`);
 
  const member27 = createMember('Yuki', 'Yamamoto', 'yuki@email.com', '5550227', '2002-05-09');
  console.log(`  ✓ Created member: Yuki Yamamoto (ID: ${member27})`);
 
  const member28 = createMember('Darius', 'Washington', 'darius@email.com', '5550228', '1986-08-22');
  console.log(`  ✓ Created member: Darius Washington (ID: ${member28})`);
 
  const member29 = createMember('Ingrid', 'Larsen', 'ingrid@email.com', '5550229', '1993-03-18');
  console.log(`  ✓ Created member: Ingrid Larsen (ID: ${member29})`);
 
  const member30 = createMember('Kevin', 'Osei', 'kevin@email.com', '5550230', '1991-11-07');
  console.log(`  ✓ Created member: Kevin Osei (ID: ${member30})`);
 
  const member31 = createMember('Bianca', 'Ferreira', 'bianca@email.com', '5550231', '1998-07-26');
  console.log(`  ✓ Created member: Bianca Ferreira (ID: ${member31})`);
 
  const member32 = createMember('Patrick', 'Nguyen', 'patricknguyen@email.com', '5550232', '1995-04-01');
  console.log(`  ✓ Created member: Patrick Nguyen (ID: ${member32})`);
 
  const member33 = createMember('Zoe', 'Campbell', 'zoe@email.com', '5550233', '2001-09-14');
  console.log(`  ✓ Created member: Zoe Campbell (ID: ${member33})`);
 
  const member34 = createMember('Andre', 'Petit', 'andre@email.com', '5550234', '1988-01-31');
  console.log(`  ✓ Created member: Andre Petit (ID: ${member34})`);
 
  const member35 = createMember('Nina', 'Kowalski', 'nina@email.com', '5550235', '1996-06-05');
  console.log(`  ✓ Created member: Nina Kowalski (ID: ${member35})`);
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
 
  // New date helpers (added 5/1/26)
  const in3Days = new Date(today);
  in3Days.setDate(in3Days.getDate() + 3);
  in3Days.setHours(9, 0, 0, 0);
 
  const in4Days = new Date(today);
  in4Days.setDate(in4Days.getDate() + 4);
  in4Days.setHours(11, 30, 0, 0);
 
  const in5Days = new Date(today);
  in5Days.setDate(in5Days.getDate() + 5);
  in5Days.setHours(7, 0, 0, 0);
 
  const in10Days = new Date(today);
  in10Days.setDate(in10Days.getDate() + 10);
  in10Days.setHours(16, 0, 0, 0);
 
  const in12Days = new Date(today);
  in12Days.setDate(in12Days.getDate() + 12);
  in12Days.setHours(18, 30, 0, 0);
 
  const in14Days = new Date(today);
  in14Days.setDate(in14Days.getDate() + 14);
  in14Days.setHours(9, 30, 0, 0);
 
  const in3DaysEvening = new Date(today);
  in3DaysEvening.setDate(in3DaysEvening.getDate() + 3);
  in3DaysEvening.setHours(18, 0, 0, 0);


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

 // New classes (added 5/1/26)
  const class6 = createClass('Zumba', 5, formatDateTime(in3Days));
  console.log(`  ✓ Created class: Zumba (ID: ${class6})`);
 
  const class7 = createClass('Power Yoga', 6, formatDateTime(in4Days));
  console.log(`  ✓ Created class: Power Yoga (ID: ${class7})`);
 
  const class8 = createClass('Boxing Fundamentals', 3, formatDateTime(in5Days));
  console.log(`  ✓ Created class: Boxing Fundamentals (ID: ${class8})`);
 
  const class9 = createClass('Barre', 6, formatDateTime(in3DaysEvening));
  console.log(`  ✓ Created class: Barre (ID: ${class9})`);
 
  const class10 = createClass('Aqua Aerobics', 7, formatDateTime(in10Days));
  console.log(`  ✓ Created class: Aqua Aerobics (ID: ${class10})`);
 
  const class11 = createClass('Meditation & Breathwork', 1, formatDateTime(in12Days));
  console.log(`  ✓ Created class: Meditation & Breathwork (ID: ${class11})`);
 
  const class12 = createClass('Kettlebell Circuit', 5, formatDateTime(in14Days));
  console.log(`  ✓ Created class: Kettlebell Circuit (ID: ${class12})`);
 
  const class13 = createClass('Functional Fitness', 7, formatDateTime(in5Days));
  console.log(`  ✓ Created class: Functional Fitness (ID: ${class13})`);
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

// New membership helpers (added 5/1/26)
 const twoMonthsAgo = new Date(today);
 twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
 const oneMonthAgo = new Date(today);
 oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
 const sixMonths = new Date(today);
 sixMonths.setMonth(sixMonths.getMonth() + 6);
 const twoWeeksAgo = new Date(today);
 twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
 const twoWeeksAhead = new Date(today);
 twoWeeksAhead.setDate(twoWeeksAhead.getDate() + 14);

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

 // New memberships (added 5/1/26)
  const membership6 = createMembership(6, 'Premium Plan', 499.99, 'annual', formatDate(today), formatDate(nextYear));
  console.log(`  ✓ Created membership: Premium Plan annual for Member #6 (ID: ${membership6})`);
 
  const membership7 = createMembership(7, 'Basic Plan', 19.99, 'monthly', formatDate(today), formatDate(nextMonth));
  console.log(`  ✓ Created membership: Basic Plan monthly for Member #7 (ID: ${membership7})`);
 
  const membership8 = createMembership(8, 'Standard Plan', 89.99, 'quarterly', formatDate(today), formatDate(threeMonths));
  console.log(`  ✓ Created membership: Standard Plan quarterly for Member #8 (ID: ${membership8})`);
 
  const membership9 = createMembership(9, 'Premium Plan', 249.99, 'semi-annual', formatDate(today), formatDate(sixMonths));
  console.log(`  ✓ Created membership: Premium Plan semi-annual for Member #9 (ID: ${membership9})`);
 
  const membership10 = createMembership(10, 'Standard Plan', 34.99, 'monthly', formatDate(twoWeeksAgo), formatDate(twoWeeksAhead));
  console.log(`  ✓ Created membership: Standard Plan monthly for Member #10 (ID: ${membership10})`);
 
  const membership11 = createMembership(11, 'Basic Plan', 19.99, 'monthly', formatDate(today), formatDate(nextMonth));
  console.log(`  ✓ Created membership: Basic Plan monthly for Member #11 (ID: ${membership11})`);
 
  const membership12 = createMembership(12, 'Premium Plan', 499.99, 'annual', formatDate(today), formatDate(nextYear));
  console.log(`  ✓ Created membership: Premium Plan annual for Member #12 (ID: ${membership12})`);
 
  const membership13 = createMembership(13, 'Standard Plan', 89.99, 'quarterly', formatDate(twoMonthsAgo), formatDate(oneMonthAgo));
  console.log(`  ✓ Created membership: Standard Plan quarterly for Member #13 (EXPIRED) (ID: ${membership13})`);
 
  const membership14 = createMembership(14, 'Basic Plan', 19.99, 'monthly', formatDate(today), formatDate(nextMonth));
  console.log(`  ✓ Created membership: Basic Plan monthly for Member #14 (ID: ${membership14})`);
 
  const membership15 = createMembership(15, 'Premium Plan', 499.99, 'annual', formatDate(today), formatDate(nextYear));
  console.log(`  ✓ Created membership: Premium Plan annual for Member #15 (ID: ${membership15})`);

  // New memberships (added 5/2/26)
  const membership16 = createMembership(16, 'Standard Plan', 89.99, 'quarterly', formatDate(today), formatDate(threeMonths));
  console.log(`  ✓ Created membership: Standard Plan quarterly for Member #16 (ID: ${membership16})`);

  const membership17 = createMembership(17, 'Basic Plan', 19.99, 'monthly', formatDate(today), formatDate(nextMonth));
  console.log(`  ✓ Created membership: Basic Plan monthly for Member #17 (ID: ${membership17})`);

  const membership18 = createMembership(18, 'Premium Plan', 499.99, 'annual', formatDate(today), formatDate(nextYear));
  console.log(`  ✓ Created membership: Premium Plan annual for Member #18 (ID: ${membership18})`);

  const membership19 = createMembership(19, 'Standard Plan', 34.99, 'monthly', formatDate(today), formatDate(nextMonth));
  console.log(`  ✓ Created membership: Standard Plan monthly for Member #19 (ID: ${membership19})`);

  const membership20 = createMembership(20, 'Basic Plan', 49.99, 'quarterly', formatDate(lastMonth), formatDate(today));
  console.log(`  ✓ Created membership: Basic Plan quarterly for Member #20 (EXPIRED) (ID: ${membership20})`);

  const membership21 = createMembership(21, 'Premium Plan', 249.99, 'semi-annual', formatDate(today), formatDate(sixMonths));
  console.log(`  ✓ Created membership: Premium Plan semi-annual for Member #21 (ID: ${membership21})`);

  const membership22 = createMembership(22, 'Basic Plan', 19.99, 'monthly', formatDate(twoWeeksAgo), formatDate(twoWeeksAhead));
  console.log(`  ✓ Created membership: Basic Plan monthly for Member #22 (ID: ${membership22})`);

  const membership23 = createMembership(23, 'Standard Plan', 89.99, 'quarterly', formatDate(today), formatDate(threeMonths));
  console.log(`  ✓ Created membership: Standard Plan quarterly for Member #23 (ID: ${membership23})`);

  const membership24 = createMembership(24, 'Premium Plan', 499.99, 'annual', formatDate(today), formatDate(nextYear));
  console.log(`  ✓ Created membership: Premium Plan annual for Member #24 (ID: ${membership24})`);

  const membership25 = createMembership(25, 'Basic Plan', 19.99, 'monthly', formatDate(today), formatDate(nextMonth));
  console.log(`  ✓ Created membership: Basic Plan monthly for Member #25 (ID: ${membership25})`);

  const membership26 = createMembership(26, 'Standard Plan', 89.99, 'quarterly', formatDate(twoMonthsAgo), formatDate(oneMonthAgo));
  console.log(`  ✓ Created membership: Standard Plan quarterly for Member #26 (EXPIRED) (ID: ${membership26})`);

  const membership27 = createMembership(27, 'Premium Plan', 499.99, 'annual', formatDate(today), formatDate(nextYear));
  console.log(`  ✓ Created membership: Premium Plan annual for Member #27 (ID: ${membership27})`);

  const membership28 = createMembership(28, 'Basic Plan', 19.99, 'monthly', formatDate(today), formatDate(nextMonth));
  console.log(`  ✓ Created membership: Basic Plan monthly for Member #28 (ID: ${membership28})`);

  const membership29 = createMembership(29, 'Standard Plan', 249.99, 'semi-annual', formatDate(today), formatDate(sixMonths));
  console.log(`  ✓ Created membership: Standard Plan semi-annual for Member #29 (ID: ${membership29})`);

  const membership30 = createMembership(30, 'Premium Plan', 499.99, 'annual', formatDate(today), formatDate(nextYear));
  console.log(`  ✓ Created membership: Premium Plan annual for Member #30 (ID: ${membership30})`);

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

 // New bookings (added 5/1/26)
  const booking7 = createBooking(7, 6, formatDateTime(now), null, 'confirmed');
  console.log(`  ✓ Created booking: Member #7 → Class #6 (ID: ${booking7})`);
 
  const booking8 = createBooking(8, 6, formatDateTime(now), null, 'confirmed');
  console.log(`  ✓ Created booking: Member #8 → Class #6 (ID: ${booking8})`);
 
  const booking9 = createBooking(9, 7, formatDateTime(now), null, 'confirmed');
  console.log(`  ✓ Created booking: Member #9 → Class #7 (ID: ${booking9})`);
 
  const booking10 = createBooking(10, 7, formatDateTime(now), null, 'cancelled');
  console.log(`  ✓ Created booking: Member #10 → Class #7 (CANCELLED) (ID: ${booking10})`);
 
  const booking11 = createBooking(11, 8, formatDateTime(now), null, 'confirmed');
  console.log(`  ✓ Created booking: Member #11 → Class #8 (ID: ${booking11})`);
 
  const booking12 = createBooking(12, 8, formatDateTime(now), null, 'confirmed');
  console.log(`  ✓ Created booking: Member #12 → Class #8 (ID: ${booking12})`);
 
  const booking13 = createBooking(13, 9, formatDateTime(now), null, 'cancelled');
  console.log(`  ✓ Created booking: Member #13 → Class #9 (CANCELLED) (ID: ${booking13})`);
 
  const booking14 = createBooking(14, 10, formatDateTime(now), null, 'confirmed');
  console.log(`  ✓ Created booking: Member #14 → Class #10 (ID: ${booking14})`);
 
  const booking15 = createBooking(15, 10, formatDateTime(now), null, 'confirmed');
  console.log(`  ✓ Created booking: Member #15 → Class #10 (ID: ${booking15})`);
 
  const booking16 = createBooking(6, 11, formatDateTime(now), null, 'confirmed');
  console.log(`  ✓ Created booking: Member #6 → Class #11 (ID: ${booking16})`);
 
  const booking17 = createBooking(2, 12, formatDateTime(now), null, 'confirmed');
  console.log(`  ✓ Created booking: Member #2 → Class #12 (ID: ${booking17})`);
 
  const booking18 = createBooking(5, 12, formatDateTime(now), null, 'confirmed');
  console.log(`  ✓ Created booking: Member #5 → Class #12 (ID: ${booking18})`);
 
  const booking19 = createBooking(9, 13, formatDateTime(now), null, 'confirmed');
  console.log(`  ✓ Created booking: Member #9 → Class #13 (ID: ${booking19})`);
 
  const booking20 = createBooking(3, 5, formatDateTime(now), null, 'confirmed');
  console.log(`  ✓ Created booking: Member #3 → Class #5 (ID: ${booking20})`);
} catch (error) {
 console.error('  ✗ Error creating bookings:', error.message);
}


console.log('\n✅ Sample data seeding complete!');
console.log('\n📊 Summary:');
console.log('   - 11 Instructors');
console.log('   - 35 Members');
console.log('   - 13 Classes');
console.log('   - 15 Memberships (2 expired)');
console.log('   - 20 Bookings (3 cancelled)');
console.log('\n🚀 Ready to start! Run: npm run start');
