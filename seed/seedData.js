const bcrypt = require('bcryptjs');

const seedMentors = [
  {
    name: 'Dr. Aris Vance',
    role: 'Principal Research Scientist (Reasoning & Multi-Agent LLMs)',
    company: 'OpenAI',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    bio: 'Lead author on transformer architectures and autonomous reasoning loops. Mentoring NIT students in custom tokenizers and agentic reinforcement learning.',
    domain: 'AI & LLMs',
    expertise: ['RLHF', 'Agentic Systems', 'Custom Kernels', 'PyTorch'],
    githubUrl: 'https://github.com',
    linkedinUrl: 'https://linkedin.com',
    twitterUrl: 'https://x.com',
    isFoundingAdvisor: true,
    officeHoursSlot: 'Tuesdays 17:00 IST'
  },
  {
    name: 'Kaelen Thorne',
    role: 'Staff Infrastructure Engineer',
    company: 'Google DeepMind',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    bio: 'Building supercomputer scale orchestration for Gemini. Guiding NIT students through distributed training, CUDA optimizations, and zero-downtime microservices.',
    domain: 'Distributed Systems',
    expertise: ['Distributed Tracing', 'Kubernetes', 'CUDA', 'Rust'],
    githubUrl: 'https://github.com',
    linkedinUrl: 'https://linkedin.com',
    twitterUrl: 'https://x.com',
    isFoundingAdvisor: true,
    officeHoursSlot: 'Wednesdays 19:30 IST'
  },
  {
    name: 'Seraphina Lin',
    role: 'VP of Core Payments & Platform',
    company: 'Stripe',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    bio: 'Pioneered zero-latency settlement pipelines processing $1T+ in volume. Teaching high-concurrency systems design and financial cryptography.',
    domain: 'Fintech & Web3',
    expertise: ['High-Throughput APIs', 'Idempotency', 'Raft Consensus', 'Go'],
    githubUrl: 'https://github.com',
    linkedinUrl: 'https://linkedin.com',
    twitterUrl: 'https://x.com',
    isFoundingAdvisor: false,
    officeHoursSlot: 'Thursdays 18:00 IST'
  },
  {
    name: 'Ronan Gallagher',
    role: '2x Y Combinator Founder & General Partner',
    company: 'Nexus Capital / Ex-Vercel',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    bio: 'Scaled developer platforms from $0 to $400M ARR. Leading the NIT Founder Fellowship, term sheet negotiations, and venture pitch architecture.',
    domain: 'Founders & VC',
    expertise: ['Fundraising', 'Product-Led Growth', 'GTM Strategy', 'Developer Tooling'],
    githubUrl: 'https://github.com',
    linkedinUrl: 'https://linkedin.com',
    twitterUrl: 'https://x.com',
    isFoundingAdvisor: true,
    officeHoursSlot: 'Fridays 16:00 IST'
  },
  {
    name: 'Maya Takahashi',
    role: 'Principal Autonomous Systems Engineer',
    company: 'Tesla Autopilot / Boston Dynamics Alum',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    bio: 'Architect of computer vision pipelines for real-time spatial navigation and humanoid locomotion control.',
    domain: 'Robotics & Hardware',
    expertise: ['Computer Vision', 'SLAM', 'ROS2', 'Embedded C++'],
    githubUrl: 'https://github.com',
    linkedinUrl: 'https://linkedin.com',
    twitterUrl: 'https://x.com',
    isFoundingAdvisor: false,
    officeHoursSlot: 'Mondays 20:00 IST'
  },
  {
    name: 'Devon Mercer',
    role: 'Head of Developer Experience',
    company: 'Anthropic',
    avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80',
    bio: 'Specializing in constitutional AI, model alignment evaluations, and next-gen developer SDKs for Claude.',
    domain: 'AI & LLMs',
    expertise: ['Claude SDK', 'Safety Evals', 'Prompt Engineering', 'TypeScript'],
    githubUrl: 'https://github.com',
    linkedinUrl: 'https://linkedin.com',
    twitterUrl: 'https://x.com',
    isFoundingAdvisor: false,
    officeHoursSlot: 'Saturdays 15:00 IST'
  }
];

const seedHackathons = [
  {
    title: 'NEXUS ZERO-1: Autonomous Agent Hackathon',
    slug: 'nexus-zero-1-autonomous-agents',
    tagline: '48-hour global sprint to build self-healing, multi-agent AI ecosystems.',
    theme: 'Agentic Workflows, Tool Use & Local LLM Fine-Tuning',
    description: 'Nexus Zero-1 challenges engineering teams to design autonomous multi-agent pipelines that execute complex software development, economic reasoning, and autonomous code generation with zero human intervention.',
    prizePool: '$75,000 Cash + 25,000 NVIDIA H100 Compute Credits',
    startDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    registrationDeadline: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
    location: 'Nexus Cyber Arena (Bangalore Campus + Global Live Stream)',
    sponsors: [
      { name: 'NVIDIA', tier: 'Compute Partner' },
      { name: 'OpenAI', tier: 'Model Partner' },
      { name: 'Vercel', tier: 'Deployment Partner' },
      { name: 'Supabase', tier: 'Data Partner' }
    ],
    tags: ['AI Agents', 'LLMs', 'PyTorch', 'Vector DB', 'Autonomous Code'],
    rules: [
      'Teams of 1 to 4 builders.',
      'All code must be open-sourced during the judging phase.',
      'Projects must utilize at least one autonomous agent orchestration framework (LangGraph, CrewAI, AutoGen, or custom runtime).',
      'Live demo pitch of 3 minutes is mandatory.'
    ],
    judges: [
      { name: 'Dr. Aris Vance', role: 'Principal Scientist', company: 'OpenAI' },
      { name: 'Ronan Gallagher', role: 'General Partner', company: 'Nexus Capital' }
    ],
    participantCount: 380,
    bannerImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    status: 'active',
    isFeatured: true
  },
  {
    title: 'SYNAPSE HACK: High-Frequency Distributed Systems',
    slug: 'synapse-distributed-systems-2026',
    tagline: 'Build ultra-low latency, sub-millisecond distributed state engines.',
    theme: 'Distributed Consensus, Rust Micro-kernels & Real-time WebSockets',
    description: 'A pure systems engineering hackathon testing the limits of throughput, lock-free data structures, and edge computing nodes under artificial 10M RPS traffic storms.',
    prizePool: '$50,000 Cash + Fast-Track YC / Nexus Residency Interviews',
    startDate: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    registrationDeadline: new Date(Date.now() + 16 * 24 * 60 * 60 * 1000),
    location: 'Nexus Distributed Cyber Labs + Tokyo Hub',
    sponsors: [
      { name: 'Cloudflare', tier: 'Edge Partner' },
      { name: 'Stripe', tier: 'Fintech Sponsor' },
      { name: 'AWS', tier: 'Infra Partner' }
    ],
    tags: ['Rust', 'Distributed Systems', 'Raft', 'WebSockets', 'eBPF'],
    rules: [
      'Stress test harnesses will be run automatically against endpoints.',
      'Zero external proprietary SaaS allowed; pure native code.',
      'Latency metrics scored at p99 and p99.9 levels.'
    ],
    judges: [
      { name: 'Kaelen Thorne', role: 'Staff Infra', company: 'Google DeepMind' },
      { name: 'Seraphina Lin', role: 'VP Core Platform', company: 'Stripe' }
    ],
    participantCount: 215,
    bannerImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
    status: 'upcoming',
    isFeatured: true
  }
];

const seedProjects = [
  {
    title: 'NeuralKernel OS',
    slug: 'neuralkernel-os',
    tagline: 'An experimental microkernel operating system written in Rust with built-in LLM runtime at ring 0.',
    description: 'NeuralKernel replaces conventional OS schedulers with an on-chip speculative neural predictor, reducing context-switch overhead by 42% on ARM64 and x86_64 silicon.',
    creatorName: 'Aarav Mehta & Team Hyperion',
    creatorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
    track: 'AI Agents & LLMs',
    tags: ['Rust', 'OS Architecture', 'LLM Runtime', 'ARM64'],
    imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
    demoUrl: 'https://github.com',
    githubUrl: 'https://github.com',
    upvotes: 148,
    isFeatured: true,
    badge: 'Batch of 2026'
  },
  {
    title: 'SwarmVision Drone AI',
    slug: 'swarmvision-drone-ai',
    tagline: 'Autonomous spatial mapping and obstacle avoidance using distributed edge vision for search & rescue.',
    description: 'Built during Year 2 Maker Lab at Nexus. Coordinates up to 12 micro-drones in GPS-denied cave and forest environments with real-time 3D Gaussian splatting.',
    creatorName: 'Rhea Nambiar & Tarun Sen',
    creatorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    track: 'Robotics & Vision',
    tags: ['ROS2', 'Computer Vision', 'CUDA', 'Drones'],
    imageUrl: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=80',
    demoUrl: 'https://github.com',
    githubUrl: 'https://github.com',
    upvotes: 112,
    isFeatured: true,
    badge: 'Maker Lab Project'
  },
  {
    title: 'VortexDex High-Speed State Channel',
    slug: 'vortexdex-high-speed-channel',
    tagline: 'Sub-millisecond cryptographic settlement protocol with verifiable zero-knowledge proofs.',
    description: 'Processes 250,000 transactions per second with off-chain aggregation and instant zk-SNARK rollup proof generation. Backed by $500k in student venture seed grants.',
    creatorName: 'Zackariah King',
    creatorAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=80',
    track: 'Web3 & Fintech',
    tags: ['zk-SNARKs', 'Go', 'Cryptography', 'Fintech'],
    imageUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=800&q=80',
    demoUrl: 'https://github.com',
    githubUrl: 'https://github.com',
    upvotes: 96,
    isFeatured: false,
    badge: 'Founder Track'
  },
  {
    title: 'DevMesh: Peer-to-Peer Code Sandbox',
    slug: 'devmesh-p2p-sandbox',
    tagline: 'Instant collaborative WebAssembly dev environments connected over WebRTC data meshes.',
    description: 'Zero cloud server dependencies. Boots full Linux terminal instances in the browser via WebAssembly with multi-cursor live collaboration.',
    creatorName: 'Ananya Sharma',
    creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    track: 'DevTools',
    tags: ['WebAssembly', 'WebRTC', 'TypeScript', 'Docker'],
    imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
    demoUrl: 'https://github.com',
    githubUrl: 'https://github.com',
    upvotes: 84,
    isFeatured: false,
    badge: 'Hackerhouse Sprint'
  }
];

const seedUsers = [
  {
    name: 'Nexus Admissions Commander (Admin)',
    email: 'admin@nexus.edu',
    password: 'Admin@Nexus2026',
    role: 'admin',
    studentId: 'NIT-ADMIN-001',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
    bio: 'Director of Admissions & Fellowships at Nexus Institute of Technology.',
    githubUsername: 'nexus-admin',
    track: 'founder-fellowship',
    computeHours: 9999,
    badgeTier: 'Nexus Staff / Admin'
  },
  {
    name: 'Alex Chen (Student)',
    email: 'alex.chen@nexus.edu',
    password: 'Student@Nexus2026',
    role: 'student',
    studentId: 'NIT-2026-8492',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    bio: 'B.Tech AI & CS Student. Working on Autonomous Agents, Neural Network distillation, and robotic vision.',
    githubUsername: 'alexchen-builder',
    track: 'btech-ai-cs',
    computeHours: 420,
    badgeTier: 'Neural Architect'
  },
  {
    name: 'Priya Patel (Applicant)',
    email: 'priya.patel@gmail.com',
    password: 'Student@Nexus2026',
    role: 'applicant',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    bio: 'High school graduate & passionate coder. Building LLM agent prototypes in Python and Rust.',
    githubUsername: 'priyapatel-tech',
    track: 'btech-ai-cs',
    computeHours: 120,
    badgeTier: 'Novice Builder'
  }
];

module.exports = {
  seedMentors,
  seedHackathons,
  seedProjects,
  seedUsers
};
