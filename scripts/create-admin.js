// Run this script to create an admin user
// Usage: node scripts/create-admin.js

const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

const MONGODB_URI = "mongodb+srv://codecommons_user:HN72il9EM22FmsNR@cluster0.k2atslp.mongodb.net/codecommons?retryWrites=true&w=majority&appName=Cluster0";

async function createAdmin() {
    const client = new MongoClient(MONGODB_URI);

    try {
        await client.connect();
        const db = client.db('codecommons');

        // Hash password - Use environment variable or default
        const adminPassword = process.env.ADMIN_PASSWORD || 'Nabindai1232@#';
        const hashedPassword = await bcrypt.hash(adminPassword, 12);

        // Create admin user
        const adminUser = {
            name: 'Admin User',
            email: 'admin@jainuniversity.ac.in',
            password: hashedPassword,
            role: 'admin',
            department: 'Computer Science',
            createdAt: new Date(),
            updatedAt: new Date()
        };

        // Check if admin already exists
        const existingAdmin = await db.collection('users').findOne({ email: adminUser.email });

        if (existingAdmin) {
            console.log('Admin user already exists');
            return;
        }

        // Insert admin user
        const result = await db.collection('users').insertOne(adminUser);
        console.log('Admin user created successfully!');
        console.log('Email: admin@jainuniversity.ac.in');
        console.log('Password:', adminPassword);
        console.log('User ID:', result.insertedId);

    } catch (error) {
        console.error('Error creating admin user:', error);
    } finally {
        await client.close();
    }
}

createAdmin();
