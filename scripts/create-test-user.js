// Create a test user without onboarding completion
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

const MONGODB_URI = "mongodb+srv://codecommons_user:HN72il9EM22FmsNR@cluster0.k2atslp.mongodb.net/codecommons?retryWrites=true&w=majority&appName=Cluster0";

async function createTestUser() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db('codecommons');
    
    console.log('🧪 Creating test user for onboarding flow...');
    
    const hashedPassword = await bcrypt.hash('test123', 12);
    
    // Create a test student user that needs onboarding
    const testUser = {
      name: 'Test Student',
      email: 'test@jainuniversity.ac.in',
      password: hashedPassword,
      role: '', // Empty - needs onboarding
      department: '', // Empty - needs onboarding
      section: '',
      year: '',
      specialization: '',
      onboardingCompleted: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Remove existing test user if exists
    await db.collection('users').deleteOne({ email: 'test@jainuniversity.ac.in' });
    
    // Insert new test user
    await db.collection('users').insertOne(testUser);
    
    console.log('✅ Test user created successfully!');
    console.log('📧 Email: test@jainuniversity.ac.in');
    console.log('🔑 Password: test123');
    console.log('🎯 This user will be redirected to onboarding after login');
    
  } catch (error) {
    console.error('❌ Error creating test user:', error);
  } finally {
    await client.close();
  }
}

createTestUser();
