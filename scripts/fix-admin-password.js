// Script to fix admin user password
// Usage: node scripts/fix-admin-password.js

const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/codecommons";

async function fixAdminPassword() {
    const client = new MongoClient(MONGODB_URI);

    try {
        await client.connect();
        const db = client.db('codecommons');

        console.log('🔧 Fixing admin user password...');

        // Hash the correct password
        const newPassword = 'Nabindai1232@#';
        const hashedPassword = await bcrypt.hash(newPassword, 12);

        // Update admin user
        const result = await db.collection('users').updateOne(
            { email: 'admin@jainuniversity.ac.in' },
            {
                $set: {
                    password: hashedPassword,
                    name: 'Admin User',
                    role: 'admin',
                    department: 'Computer Science',
                    updatedAt: new Date()
                }
            },
            { upsert: true }
        );

        console.log('✅ Admin password fixed!');
        console.log('📧 Email: admin@jainuniversity.ac.in');
        console.log('🔑 Password: Nabindai1232@#');
        console.log('📊 Updated:', result.modifiedCount, 'documents');

        if (result.upsertedCount > 0) {
            console.log('🆕 Admin user was created');
        } else {
            console.log('✏️ Admin user was updated');
        }

    } catch (error) {
        console.error('❌ Error fixing admin password:', error);
    } finally {
        await client.close();
    }
}

fixAdminPassword();
