const mongoose = require('mongoose');
const { seedMentors, seedHackathons, seedProjects, seedUsers } = require('../seed/seedData');
const User = require('../models/User');
const Mentor = require('../models/Mentor');
const Hackathon = require('../models/Hackathon');
const Project = require('../models/Project');

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nexus_institute_db';

  console.log('\n========================================================');
  console.log('⚡ [NEXUS CORE]: Initializing Neural Database Subsystem...');
  console.log(`📡 [NEXUS CORE]: Target URI -> ${mongoUri.replace(/:([^:@]{4})[^:@]*@/, ':****@')}`);

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 2500, // Quick timeout for graceful fallback
      connectTimeoutMS: 2500
    });

    console.log(`✨ [NEXUS CORE]: MongoDB Connected Successfully -> Host: ${conn.connection.host}`);
    console.log('========================================================\n');

    // Check and auto-seed MongoDB collections if empty
    await autoSeedDatabase();

    return conn;
  } catch (error) {
    console.warn(`⚠️ [NEXUS CORE]: MongoDB Connection Failed / Unavailable (${error.message})`);
    console.warn('⚡ [NEXUS CORE]: Activating In-Memory Resilient Fallback Data Vault.');
    console.warn('🚀 [NEXUS CORE]: All platform features (Auth, Applications, Admin, Launchpad) will run with pre-seeded demo data.\n');
    return null;
  }
};

async function autoSeedDatabase() {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('🌱 [NEXUS CORE]: Seeding initial admin, mentors, projects & hackathons to MongoDB Atlas...');
      for (const u of seedUsers) {
        await User.create(u);
      }
      await Mentor.insertMany(seedMentors);
      await Hackathon.insertMany(seedHackathons);
      await Project.insertMany(seedProjects);
      console.log('✅ [NEXUS CORE]: MongoDB Atlas Auto-Seed Complete!');
    }
  } catch (err) {
    console.warn('⚠️ [NEXUS CORE]: Seed check encountered a non-fatal error:', err.message);
  }
}

module.exports = connectDB;
