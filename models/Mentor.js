const mongoose = require('mongoose');

const mentorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  avatarUrl: {
    type: String,
    required: true
  },
  bio: {
    type: String,
    required: true
  },
  domain: {
    type: String,
    enum: ['AI & LLMs', 'Distributed Systems', 'Founders & VC', 'Robotics & Hardware', 'Fintech & Web3'],
    required: true
  },
  expertise: [{
    type: String
  }],
  githubUrl: {
    type: String,
    default: ''
  },
  linkedinUrl: {
    type: String,
    default: ''
  },
  twitterUrl: {
    type: String,
    default: ''
  },
  isFoundingAdvisor: {
    type: Boolean,
    default: false
  },
  officeHoursSlot: {
    type: String,
    default: 'Thursdays 18:00 UTC (1:1 & Group Deep Dives)'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Mentor', mentorSchema);
