const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  applicationId: {
    type: String,
    unique: true,
    default: function() {
      const num = Math.floor(100000 + Math.random() * 900000);
      return `NEXUS-APP-${num}`;
    }
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  track: {
    type: String,
    enum: ['btech-ai-cs', 'btech-autonomous-systems', 'founder-fellowship'],
    required: true
  },
  status: {
    type: String,
    enum: [
      'submitted',
      'under_review',
      'tech_assessment',
      'interview_scheduled',
      'accepted',
      'waitlisted',
      'rejected'
    ],
    default: 'submitted'
  },
  personalDetails: {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, default: 'India' },
    linkedinUrl: { type: String, default: '' },
    githubUrl: { type: String, default: '' },
    portfolioUrl: { type: String, default: '' }
  },
  academicBackground: {
    highestEducation: { type: String, required: true },
    schoolOrCollege: { type: String, required: true },
    graduationYear: { type: Number, required: true },
    gpaOrPercentage: { type: String, default: '' },
    standardizedTestScore: { type: String, default: '' } // SAT, JEE, etc.
  },
  technicalExperience: {
    experienceLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'expert'],
      required: true
    },
    primaryLanguages: [{ type: String }],
    bestProjectUrl: { type: String, default: '' },
    bestProjectDescription: { type: String, default: '' },
    hackathonsAttended: { type: Number, default: 0 }
  },
  essayChallenge: {
    visionEssay: {
      type: String,
      required: true // "What will you build with 10,000 NVIDIA H100 compute hours?"
    },
    whyNexus: {
      type: String,
      required: true
    },
    founderAmbition: {
      type: String,
      default: ''
    }
  },
  fundingPreference: {
    type: String,
    enum: ['self_funded', 'merit_fellowship', 'income_share_agreement'],
    default: 'income_share_agreement'
  },
  reviewerScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  reviewerNotes: [{
    author: String,
    note: String,
    timestamp: { type: Date, default: Date.now }
  }],
  timeline: [{
    title: String,
    description: String,
    date: { type: Date, default: Date.now },
    status: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timeline automatically upon creation
applicationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  if (this.isNew && (!this.timeline || this.timeline.length === 0)) {
    this.timeline = [{
      title: 'Application Dossier Submitted',
      description: 'Your application has been received and encrypted in the Nexus Admissions Vault.',
      date: new Date(),
      status: 'submitted'
    }];
  }
  next();
});

module.exports = mongoose.model('Application', applicationSchema);
