// Setup script for Jain University data
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

const MONGODB_URI = "mongodb+srv://codecommons_user:HN72il9EM22FmsNR@cluster0.k2atslp.mongodb.net/codecommons?retryWrites=true&w=majority&appName=Cluster0";

const JAIN_ENGINEERING_DEPARTMENTS = [
  {
    id: "cse",
    name: "Computer Science & Engineering",
    code: "CSE",
    sections: ["A", "B", "C", "D"],
    years: [1, 2, 3, 4]
  },
  {
    id: "ece",
    name: "Electronics & Communication Engineering", 
    code: "ECE",
    sections: ["A", "B", "C"],
    years: [1, 2, 3, 4]
  },
  {
    id: "eee",
    name: "Electrical & Electronics Engineering",
    code: "EEE", 
    sections: ["A", "B"],
    years: [1, 2, 3, 4]
  },
  {
    id: "mech",
    name: "Mechanical Engineering",
    code: "MECH",
    sections: ["A", "B", "C"],
    years: [1, 2, 3, 4]
  },
  {
    id: "civil",
    name: "Civil Engineering",
    code: "CIVIL",
    sections: ["A", "B"],
    years: [1, 2, 3, 4]
  },
  {
    id: "it",
    name: "Information Technology",
    code: "IT",
    sections: ["A", "B", "C"],
    years: [1, 2, 3, 4]
  }
];

async function setupJainUniversityData() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db('codecommons');
    
    console.log('🏫 Setting up Jain University School of Engineering data...');
    
    // Clear existing mock data
    await db.collection('classrooms').deleteMany({});
    await db.collection('questions').deleteMany({});
    
    // Create realistic classrooms for each department
    const classrooms = [];
    
    for (const dept of JAIN_ENGINEERING_DEPARTMENTS) {
      // Create classrooms for each year and section
      for (const year of dept.years) {
        for (const section of dept.sections) {
          const classroom = {
            name: `${dept.code} ${year}${section} - ${dept.name}`,
            description: `${dept.name} - Year ${year}, Section ${section}`,
            code: `${dept.code}${year}${section}`,
            department: dept.id,
            year: year,
            section: section,
            instructorId: "admin@jainuniversity.ac.in",
            students: [],
            createdAt: new Date(),
            updatedAt: new Date()
          };
          classrooms.push(classroom);
        }
      }
    }
    
    await db.collection('classrooms').insertMany(classrooms);
    console.log(`✅ Created ${classrooms.length} department classrooms`);
    
    // Create sample questions for each department
    const questions = [
      {
        title: "Best practices for Data Structures implementation?",
        content: "What are the most efficient ways to implement common data structures like linked lists, trees, and graphs in competitive programming?",
        author: "student@jainuniversity.ac.in",
        department: "cse",
        tags: ["data-structures", "algorithms", "programming"],
        votes: 8,
        answers: [],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: "Understanding VLSI Design Flow",
        content: "Can someone explain the complete VLSI design flow from RTL to GDSII? What are the key tools used in each step?",
        author: "student@jainuniversity.ac.in",
        department: "ece", 
        tags: ["vlsi", "design", "electronics"],
        votes: 5,
        answers: [],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: "Power System Analysis Techniques",
        content: "What are the different methods for power flow analysis in electrical systems? How do we handle contingency analysis?",
        author: "student@jainuniversity.ac.in",
        department: "eee",
        tags: ["power-systems", "analysis", "electrical"],
        votes: 6,
        answers: [],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: "CAD/CAM Integration in Manufacturing",
        content: "How can we effectively integrate CAD and CAM systems for automated manufacturing processes?",
        author: "student@jainuniversity.ac.in",
        department: "mech",
        tags: ["cad", "cam", "manufacturing", "automation"],
        votes: 4,
        answers: [],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: "Sustainable Construction Materials",
        content: "What are the latest developments in eco-friendly construction materials? How do they compare with traditional materials?",
        author: "student@jainuniversity.ac.in",
        department: "civil",
        tags: ["construction", "sustainability", "materials"],
        votes: 7,
        answers: [],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: "Cloud Computing Architecture Patterns",
        content: "What are the key architectural patterns for designing scalable cloud applications? Which pattern works best for different use cases?",
        author: "student@jainuniversity.ac.in",
        department: "it",
        tags: ["cloud-computing", "architecture", "scalability"],
        votes: 9,
        answers: [],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    await db.collection('questions').insertMany(questions);
    console.log(`✅ Created ${questions.length} department-specific questions`);
    
    // Update admin user to be more realistic
    const hashedPassword = await bcrypt.hash('admin123', 12);
    await db.collection('users').updateOne(
      { email: 'admin@jainuniversity.ac.in' },
      {
        $set: {
          name: 'Dr. Academic Admin',
          role: 'admin',
          department: 'administration',
          password: hashedPassword,
          updatedAt: new Date()
        }
      },
      { upsert: true }
    );
    
    console.log('✅ Updated admin user profile');
    console.log('🎉 Jain University School of Engineering setup complete!');
    console.log('');
    console.log('📚 Available Departments:');
    JAIN_ENGINEERING_DEPARTMENTS.forEach(dept => {
      console.log(`   • ${dept.name} (${dept.code}) - ${dept.sections.length} sections`);
    });
    console.log('');
    console.log('🔑 Admin Login: admin@jainuniversity.ac.in / admin123');
    
  } catch (error) {
    console.error('❌ Error setting up Jain University data:', error);
  } finally {
    await client.close();
  }
}

setupJainUniversityData();
