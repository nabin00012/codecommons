// Run this script to add sample data
// Usage: node scripts/seed-data.js

const { MongoClient } = require('mongodb');

const MONGODB_URI = "mongodb+srv://codecommons_user:HN72il9EM22FmsNR@cluster0.k2atslp.mongodb.net/codecommons?retryWrites=true&w=majority&appName=Cluster0";

async function seedData() {
    const client = new MongoClient(MONGODB_URI);

    try {
        await client.connect();
        const db = client.db('codecommons');

    // Sample classrooms
    const classrooms = [
      {
        name: "Introduction to Programming",
        description: "Learn the basics of programming with JavaScript",
        code: "INTRO-PROG-001",
        instructorId: "admin@jainuniversity.ac.in",
        students: [],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Web Development Fundamentals", 
        description: "HTML, CSS, and JavaScript for web development",
        code: "WEB-DEV-001",
        instructorId: "admin@jainuniversity.ac.in",
        students: [],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

        // Sample questions
        const questions = [
            {
                title: "What is JavaScript?",
                content: "Can someone explain what JavaScript is and how it's used in web development?",
                author: "student@jainuniversity.ac.in",
                tags: ["javascript", "basics"],
                votes: 5,
                answers: [],
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                title: "How to center a div?",
                content: "What are the different ways to center a div element in CSS?",
                author: "student@jainuniversity.ac.in",
                tags: ["css", "layout"],
                votes: 3,
                answers: [],
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];

    // Insert sample data (skip if exists)
    for (const classroom of classrooms) {
      const exists = await db.collection('classrooms').findOne({ code: classroom.code });
      if (!exists) {
        await db.collection('classrooms').insertOne(classroom);
        console.log(`Created classroom: ${classroom.name}`);
      }
    }
    
    for (const question of questions) {
      const exists = await db.collection('questions').findOne({ title: question.title });
      if (!exists) {
        await db.collection('questions').insertOne(question);
        console.log(`Created question: ${question.title}`);
      }
    }
    
    console.log('Sample data setup complete!');

    } catch (error) {
        console.error('Error seeding data:', error);
    } finally {
        await client.close();
    }
}

seedData();
