// backend/scripts/seedStudents.js
// Run with: node backend/scripts/seedStudents.js (from project root)

require('dotenv').config();
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const Student = require('../models/Student');
const connectDB = require('../config/db');

async function seed() {
  try {
    if (!process.env.MONGO_URI) {
      console.error('Please set MONGO_URI in your environment (.env) before running this script.');
      process.exit(1);
    }

    await connectDB();

    const now = new Date();

    const sample = [
      // Random test users
      { email: "emma.thompson@example.com", fullName: "Emma Thompson", profilePic: "https://randomuser.me/api/portraits/women/1.jpg", gender: 'Female' },
      { email: "olivia.miller@example.com", fullName: "Olivia Miller", profilePic: "https://randomuser.me/api/portraits/women/2.jpg", gender: 'Female' },
      { email: "sophia.davis@example.com", fullName: "Sophia Davis", profilePic: "https://randomuser.me/api/portraits/women/3.jpg", gender: 'Female' },
      { email: "ava.wilson@example.com", fullName: "Ava Wilson", profilePic: "https://randomuser.me/api/portraits/women/4.jpg", gender: 'Female' },
      { email: "isabella.brown@example.com", fullName: "Isabella Brown", profilePic: "https://randomuser.me/api/portraits/women/5.jpg", gender: 'Female' },
      { email: "mia.johnson@example.com", fullName: "Mia Johnson", profilePic: "https://randomuser.me/api/portraits/women/6.jpg", gender: 'Female' },
      { email: "charlotte.williams@example.com", fullName: "Charlotte Williams", profilePic: "https://randomuser.me/api/portraits/women/7.jpg", gender: 'Female' },
      { email: "amelia.garcia@example.com", fullName: "Amelia Garcia", profilePic: "https://randomuser.me/api/portraits/women/8.jpg", gender: 'Female' },

      { email: "james.anderson@example.com", fullName: "James Anderson", profilePic: "https://randomuser.me/api/portraits/men/1.jpg", gender: 'Male' },
      { email: "william.clark@example.com", fullName: "William Clark", profilePic: "https://randomuser.me/api/portraits/men/2.jpg", gender: 'Male' },
      { email: "benjamin.taylor@example.com", fullName: "Benjamin Taylor", profilePic: "https://randomuser.me/api/portraits/men/3.jpg", gender: 'Male' },
      { email: "lucas.moore@example.com", fullName: "Lucas Moore", profilePic: "https://randomuser.me/api/portraits/men/4.jpg", gender: 'Male' },
      { email: "henry.jackson@example.com", fullName: "Henry Jackson", profilePic: "https://randomuser.me/api/portraits/men/5.jpg", gender: 'Male' },
      { email: "alexander.martin@example.com", fullName: "Alexander Martin", profilePic: "https://randomuser.me/api/portraits/men/6.jpg", gender: 'Male' },
      { email: "daniel.rodriguez@example.com", fullName: "Daniel Rodriguez", profilePic: "https://randomuser.me/api/portraits/men/7.jpg", gender: 'Male' },

      // Real chat_db users
      { email: "mahekshaikh@gmail.com", fullName: "Mahek Shaikh", profilePic: "https://res.cloudinary.com/dpqareltv/image/upload/v1755006760/jpzjbor6.jpg", gender: 'Female' },
      { email: "john@gmail.com", fullName: "John Doe", profilePic: "https://res.cloudinary.com/dpqareltv/image/upload/v1755007013/hl36l4mm.jpg", gender: 'Male' },
      { email: "example123@gmail.com", fullName: "Example", profilePic: "https://res.cloudinary.com/dpqareltv/image/upload/v1759379658/nqaqkpa7.jpg", gender: 'Not specified' },
      { email: "annefrank123@gmail.com", fullName: "Anne Frank", profilePic: "https://res.cloudinary.com/dpqareltv/image/upload/v1759379288/myzpb255.jpg", gender: 'Female' },
    ];

    // More realistic test data
    const classes = ['8A', '8B', '9A', '9B', '10A', '10B', '11A', '11B', '12A', '12B'];
    const parentFirstNames = ['Robert', 'Patricia', 'Michael', 'Linda', 'David', 'Jennifer', 'James', 'Mary', 'Christopher', 'Nancy'];
    const parentLastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
    
    const randomPhone = () => {
      // Format: 98XXXXXXXX (Indian format style)
      const firstPart = 98 + Math.floor(Math.random() * 2);
      const secondPart = Math.floor(Math.random() * 100000000).toString().padStart(8, '0');
      return firstPart + secondPart;
    };

    const randomDOB = (idx) => {
      // Students aged 14-18 (born 2007-2012)
      const year = 2007 + (idx % 5);
      const month = Math.floor(Math.random() * 12);
      const day = Math.floor(Math.random() * 28) + 1;
      return new Date(year, month, day);
    };

    const getParentInfo = (idx, studentGender) => {
      const pFirstName = parentFirstNames[idx % parentFirstNames.length];
      const pLastName = parentLastNames[idx % parentLastNames.length];
      const parentFullName = `${pFirstName} ${pLastName}`;
      const domain = ['gmail.com', 'yahoo.com', 'outlook.com', 'example.com'][idx % 4];
      const parentEmail = `${pFirstName.toLowerCase()}.${pLastName.toLowerCase()}@${domain}`;
      return { parentName: parentFullName, parentEmail, parentPhone: randomPhone() };
    };

    // Clear existing sample students that match these emails (safe re-run)
    const emails = sample.map(s => s.email);
    await Student.deleteMany({ emailAddress: { $in: emails } });

    const docs = sample.map((s, idx) => {
      const { parentName, parentEmail, parentPhone } = getParentInfo(idx, s.gender);
      return {
        userId: uuidv4(),
        fullName: s.fullName,
        emailAddress: s.email,
        mobileNumber: randomPhone(),
        studentClass: classes[idx % classes.length],
        dateOfBirth: randomDOB(idx),
        gender: s.gender || 'Not specified',
        parentName,
        parentEmail,
        parentPhone,
        profileImageUrl: s.profilePic,
        isProfileComplete: true,
        createdAt: now,
      };
    });

    await Student.insertMany(docs);

    console.log(`Inserted ${docs.length} student documents.`);
    process.exit(0);
  } catch (err) {
    console.error('Error seeding students:', err);
    process.exit(1);
  }
}

seed();
