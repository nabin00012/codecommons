// Setup script for Jain University data
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://codecommons_user:HN72il9EM22FmsNR@cluster0.k2atslp.mongodb.net/codecommons?retryWrites=true&w=majority&appName=Cluster0";

const ENGINEERING_DEPARTMENTS = [
  { id: "cse", name: "Computer Science & Engineering", code: "CSE", sections: ["A", "B", "C", "D"], years: [1, 2, 3, 4] },
  { id: "ece", name: "Electronics & Communication Engineering", code: "ECE", sections: ["A", "B", "C"], years: [1, 2, 3, 4] },
  { id: "eee", name: "Electrical & Electronics Engineering", code: "EEE", sections: ["A", "B"], years: [1, 2, 3, 4] },
  { id: "mech", name: "Mechanical Engineering", code: "MECH", sections: ["A", "B", "C"], years: [1, 2, 3, 4] },
  { id: "civil", name: "Civil Engineering", code: "CIVIL", sections: ["A", "B"], years: [1, 2, 3, 4] },
  { id: "it", name: "Information Technology", code: "IT", sections: ["A", "B", "C"], years: [1, 2, 3, 4] },
];

async function setupJainUniversityData() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    const db = client.db('codecommons');

    console.log('🚀 Resetting data for Jain University environment...');

    await db.collection('classrooms').deleteMany({});
    await db.collection('questions').deleteMany({});
    await db.collection('projects').deleteMany({});

    await db.collection('users').deleteMany({ email: { $nin: ["admin@jainuniversity.ac.in", "test@jainuniversity.ac.in"] } });

    const classrooms = [];
    const questions = [];
    const projects = [];

    ENGINEERING_DEPARTMENTS.forEach((dept) => {
      dept.years.forEach((year) => {
        dept.sections.forEach((section) => {
          classrooms.push({
            name: `${dept.code} ${year}${section}`,
            description: `${dept.name} - Year ${year}, Section ${section}`,
            department: dept.id,
            code: `${dept.code}-${year}${section}`,
            instructorId: "admin@jainuniversity.ac.in",
            students: [],
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        });
      });

      questions.push({
        title: `${dept.name} weekly knowledge sharing`,
        content: `Students from ${dept.name} collaborate here to discuss projects, labs, and upcoming events.`,
        department: dept.id,
        author: "admin@jainuniversity.ac.in",
        tags: [dept.code.toLowerCase(), "collaboration"],
        votes: 0,
        answers: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      projects.push({
        title: `${dept.name} - Capstone Showcase Portal`,
        description: `A dedicated space to document and present capstone projects for ${dept.name}.`,
        department: dept.id,
        ownerId: "admin@jainuniversity.ac.in",
        visibility: "department",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    });

    if (classrooms.length > 0) await db.collection('classrooms').insertMany(classrooms);
    if (questions.length > 0) await db.collection('questions').insertMany(questions);
    if (projects.length > 0) await db.collection('projects').insertMany(projects);

    // Check if admin user already exists, don't overwrite password if it does
    const existingAdmin = await db.collection('users').findOne({ email: "admin@jainuniversity.ac.in" });
    if (!existingAdmin) {
      const defaultPassword = process.env.ADMIN_PASSWORD || 'Nabindai1232@#';
      const hashedAdminPassword = await bcrypt.hash(defaultPassword, 12);
      await db.collection('users').insertOne({
        name: "Jain University Admin",
        email: "admin@jainuniversity.ac.in",
        password: hashedAdminPassword,
        role: "admin",
        department: "administration",
        onboardingCompleted: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log('Admin user created with default password:', defaultPassword);
    } else {
      console.log('Admin user already exists, password preserved');
    }

    console.log(`✅ Created ${classrooms.length} classrooms`);
    console.log(`✅ Created ${questions.length} departmental discussion threads`);
    console.log(`✅ Created ${projects.length} project hubs`);

    console.log('🎯 Admin credentials: admin@jainuniversity.ac.in / admin123');
  } catch (error) {
    console.error('❌ Error setting up data:', error);
  } finally {
    await client.close();
  }
}

setupJainUniversityData();
