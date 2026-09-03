const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6
  },
  role: {
    type: String,
    enum: ['applicant', 'student', 'admin'],
    default: 'applicant'
  },
  studentId: {
    type: String,
    default: function() {
      if (this.role === 'student' || this.role === 'admin') {
        const rand = Math.floor(1000 + Math.random() * 9000);
        return `BST-2026-${rand}`;
      }
      return null;
    }
  },
  avatar: {
    type: String,
    default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
  },
  bio: {
    type: String,
    default: 'Building the next generation of autonomous AI systems & software engines.'
  },
  githubUsername: {
    type: String,
    default: ''
  },
  track: {
    type: String,
    enum: ['btech-ai-cs', 'btech-autonomous-systems', 'founder-fellowship', 'undecided'],
    default: 'btech-ai-cs'
  },
  computeHours: {
    type: Number,
    default: 120 // 120 free NVIDIA H100 compute credits
  },
  badgeTier: {
    type: String,
    enum: ['Novice Builder', 'Neural Architect', 'Founding Fellow', 'Bitwise Staff / Admin', 'Nexus Staff / Admin'],
    default: 'Novice Builder'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving if modified
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Compare password helper
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
