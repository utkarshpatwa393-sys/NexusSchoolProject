const mongoose = require('mongoose');

const hackathonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  tagline: {
    type: String,
    required: true
  },
  theme: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  prizePool: {
    type: String,
    required: true // e.g. "$100,000 + 50,000 H100 Compute Hours"
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  registrationDeadline: {
    type: Date,
    required: true
  },
  location: {
    type: String,
    default: 'Nexus Virtual Cyber-Arena + Bangalore Hackerhouse'
  },
  sponsors: [{
    name: String,
    logo: String,
    tier: String
  }],
  tags: [{
    type: String
  }],
  rules: [{
    type: String
  }],
  judges: [{
    name: String,
    role: String,
    company: String,
    avatar: String
  }],
  registeredUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  participantCount: {
    type: Number,
    default: 240
  },
  bannerImage: {
    type: String,
    default: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80'
  },
  status: {
    type: String,
    enum: ['upcoming', 'active', 'judging', 'concluded'],
    default: 'active'
  },
  isFeatured: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Hackathon', hackathonSchema);
