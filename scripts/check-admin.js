// Script to check admin user in database
// Usage: node scripts/check-admin.js

const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/codecommons";

async function checkAdmin() {
    const client = new MongoClient(MONGODB_URI);

    try {
        await client.connect();
        const db = client.db('codecommons');

        console.log('🔍 Checking admin user...');

        const adminUser = await db.collection('users').findOne({
            email: 'admin@jainuniversity.ac.in'
        });

        if (!adminUser) {
            console.log('❌ Admin user not found in database');
            console.log('💡 Run: node scripts/create-admin.js');
            return;
        }

        console.log('✅ Admin user found:');
        console.log('   Email:', adminUser.email);
        console.log('   Name:', adminUser.name);
        console.log('   Role:', adminUser.role);
        console.log('   Has password:', !!adminUser.password);
        console.log('   Password length:', adminUser.password ? adminUser.password.length : 0);

        // Test password comparison
        const testPassword1 = 'admin123';
        const testPassword2 = 'Nabindai1232@#';

        if (adminUser.password) {
            const isOldPassword = await bcrypt.compare(testPassword1, adminUser.password);
            const isNewPassword = await bcrypt.compare(testPassword2, adminUser.password);

            console.log('\n🔐 Password test results:');
            console.log('   admin123 matches:', isOldPassword);
            console.log('   Nabindai1232@# matches:', isNewPassword);
        }

    } catch (error) {
        console.error('❌ Error checking admin user:', error);
    } finally {
        await client.close();
    }
}

checkAdmin();
