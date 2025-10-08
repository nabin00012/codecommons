#!/usr/bin/env node

/**
 * Database Cleanup Script
 * This script clears all data from the MongoDB database
 * Use with caution - this will delete ALL data!
 */

const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local
function loadEnvFile() {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    envContent.split('\n').forEach(line => {
      const match = line.match(/^([^=:#]+?)\s*=\s*(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim().replace(/^["']|["']$/g, '');
        process.env[key] = value;
      }
    });
  }
}

loadEnvFile();

async function clearDatabase() {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB;

  if (!uri || !dbName) {
    console.error('❌ Error: MONGODB_URI or MONGODB_DB not found in environment variables');
    console.error('Make sure you have .env.local file with these variables');
    process.exit(1);
  }

  console.log('🔌 Connecting to MongoDB...');
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db(dbName);

    // List all collections
    const collections = await db.listCollections().toArray();
    console.log(`\n📋 Found ${collections.length} collections:`);
    collections.forEach(col => console.log(`   - ${col.name}`));

    // Collections to clear
    const collectionsToDelete = [
      'users',
      'projects',
      'classrooms',
      'assignments',
      'submissions',
      'questions',
      'discussions',
      'events',
      'groups',
      'resources',
      'sessions',
      'comments',
      'likes',
      'bookmarks',
      'notifications',
      'messages',
      'activities'
    ];

    console.log('\n🗑️  Starting database cleanup...\n');

    let totalDeleted = 0;

    for (const collectionName of collectionsToDelete) {
      try {
        const collection = db.collection(collectionName);
        const count = await collection.countDocuments();
        
        if (count > 0) {
          const result = await collection.deleteMany({});
          console.log(`   ✅ ${collectionName}: Deleted ${result.deletedCount} documents`);
          totalDeleted += result.deletedCount;
        } else {
          console.log(`   ⚪ ${collectionName}: Already empty`);
        }
      } catch (error) {
        console.log(`   ⚠️  ${collectionName}: Collection doesn't exist or error occurred`);
      }
    }

    console.log(`\n🎉 Database cleanup complete!`);
    console.log(`   Total documents deleted: ${totalDeleted}`);
    console.log(`\n✨ Your database is now clean and ready for your friends to use!\n`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await client.close();
    console.log('🔌 Connection closed');
  }
}

// Run the script
console.log('╔════════════════════════════════════════════════════════╗');
console.log('║         🧹 DATABASE CLEANUP SCRIPT 🧹                 ║');
console.log('║  This will DELETE ALL data from your database!        ║');
console.log('╚════════════════════════════════════════════════════════╝\n');

clearDatabase().catch(console.error);
