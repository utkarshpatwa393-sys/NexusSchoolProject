const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
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
    required: true,
    maxlength: 180
  },
  description: {
    type: String,
    required: true
  },
  creatorName: {
    type: String,
    required: true
  },
  creatorEmail: {
    type: String,
    default: ''
  },
  creatorAvatar: {
    type: String,
    default: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  track: {
    type: String,
    enum: ['AI Agents & LLMs', 'Robotics & Vision', 'Distributed Systems', 'DevTools', 'Web3 & Fintech'],
    default: 'AI Agents & LLMs'
  },
  tags: [{
    type: String,
    trim: true
  }],
  imageUrl: {
    type: String,
    default: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80'
  },
  demoUrl: {
    type: String,
    default: ''
  },
  githubUrl: {
    type: String,
    default: ''
  },
  upvotes: {
    type: Number,
    default: 0
  },
  upvotedBy: [{
    type: String // user IDs or session keys
  }],
  isFeatured: {
    type: Boolean,
    default: false
  },
  badge: {
    type: String,
    default: 'Batch of 2026'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Project', projectSchema);
