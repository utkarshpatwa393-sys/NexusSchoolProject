const dataService = require('../services/dataService');

module.exports = {
  // POST /api/terminal - Live CLI command interpreter for the hero section
  async postTerminalCommand(req, res) {
    const { command } = req.body;
    const cmd = (command || '').trim().toLowerCase();

    const responses = {
      help: `
⚡ BITWISE OS [Version 4.2.0-neural] - AVAILABLE COMMANDS:
---------------------------------------------------------
  • tracks       : List undergraduate & fellowship engineering tracks
  • curriculum   : Output 4-year AI-first syllabus & milestone timeline
  • mentors      : Display industry faculty roster (OpenAI, DeepMind, Stripe)
  • specs        : Inspect Bitwise Supercompute Cluster (NVIDIA H100 pods)
  • hackathons   : List active prize bounties and upcoming sprints
  • apply        : Initiate admissions sequence for Batch of 2026-2030
  • stats        : Query admissions velocity & platform metrics
  • clear        : Wipe the terminal buffer
`,
      tracks: `
[ENGINEERING TRACKS - BATCH 2026]
---------------------------------------------------------
1. B.Tech in Artificial Intelligence & Computer Science (4 Years)
   - Agentic Systems, Transformer Pre-training, Distributed Inference
2. B.Tech in Autonomous Systems & Robotics (4 Years)
   - Spatial Computing, SLAM, ROS2, Embedded Hardware
3. Founder Fellowship & Accelerator (1 Year Residency)
   - 0% Equity Grant, $100k Compute Pool, Silicon Valley Demo Day
`,
      curriculum: `
[AI-FIRST CURRICULUM ARCHITECTURE]
---------------------------------------------------------
• Year 1: Foundations & Agentic AI (Rust, PyTorch, Multi-Agent Loops)
• Year 2: Distributed Systems & Custom LLM Kernels (CUDA, Triton, Raft)
• Year 3: Production Scale & Silicon Valley / Bangalore Apprenticeship
• Year 4: Capstone Startup / Venture Foundry Launch
`,
      mentors: `
[FACULTY & MENTORS IN RESIDENCE]
---------------------------------------------------------
• Dr. Aris Vance    | Principal Research Scientist, OpenAI
• Kaelen Thorne     | Staff Infrastructure Engineer, Google DeepMind
• Seraphina Lin     | VP of Core Platform, Stripe
• Ronan Gallagher   | 2x YC Founder & GP, Bitwise Capital
• Maya Takahashi    | Principal Robotics Engineer, Ex-Tesla Autopilot
`,
      specs: `
[BITWISE SUPERCOMPUTE CLUSTER SPECIFICATIONS]
---------------------------------------------------------
• GPUs          : 128x NVIDIA H100 Tensor Core GPUs (80GB SXM5)
• Interconnect  : 3.2 Tbps NVIDIA Quantum-2 InfiniBand
• Storage       : 2.5 Petabytes NVMe Direct Lustre Filesystem
• Quota         : 120 Compute Hours allocated to each student / month
• Status        : 🟢 OPERATIONAL (99.98% Uptime)
`,
      hackathons: `
[ACTIVE GLOBAL PRIZE SPRINT]
---------------------------------------------------------
🏆 BITWISE ZERO-1: Autonomous Agent Hackathon
   • Prize Pool: $75,000 Cash + 25,000 H100 Hours
   • Theme: Autonomous Code & Multi-Agent Swarms
   • Status: ACTIVE - Type /hackathons to join!
`,
      apply: `
🚀 INITIATING ADMISSIONS SEQUENCE...
---------------------------------------------------------
Admissions portal unlocked. Redirecting in 2 seconds...
(Or navigate directly to /apply)
`,
      stats: `
[SYSTEM METRICS]
---------------------------------------------------------
• Total Applicants : 1,420+
• Acceptance Rate  : 4.8%
• GPU Pods Active  : 16 Nodes (128 H100s)
• Student Projects : 34 Live in Production
`
    };

    if (responses[cmd]) {
      return res.json({
        success: true,
        command: cmd,
        output: responses[cmd],
        action: cmd === 'apply' ? 'redirect_apply' : null
      });
    }

    return res.json({
      success: true,
      command: cmd,
      output: `Unknown command: "${command}". Type "help" for a list of available Bitwise OS instructions.`
    });
  },

  // POST /api/ai-assistant - Bitwise AI Navigator Query
  async postAiAssistant(req, res) {
    const { question } = req.body;
    const q = (question || '').toLowerCase();

    let reply = "I am the Bitwise AI Navigator. I can help you understand our AI-first B.Tech curriculum, Income Share Agreements (ISA), NVIDIA H100 GPU compute access, and Admissions criteria.";

    if (q.includes('isa') || q.includes('income share') || q.includes('fees') || q.includes('tuition') || q.includes('cost')) {
      reply = "Bitwise offers a zero-upfront-tuition Income Share Agreement (ISA). You only pay back a capped percentage of your salary after you secure a tech role paying above ₹20,00,000 / $25,000 per year. Merit fellowships are also awarded to top 5% of applicants!";
    } else if (q.includes('gpu') || q.includes('h100') || q.includes('compute') || q.includes('hardware')) {
      reply = "Every student receives 120 dedicated NVIDIA H100 SXM5 GPU compute hours per month, connected via 3.2 Tbps InfiniBand to our petabyte-scale NVMe cluster, allowing real-time LLM pretraining and robotics simulation.";
    } else if (q.includes('curriculum') || q.includes('syllabus') || q.includes('semester') || q.includes('study')) {
      reply = "Our AI-first curriculum replaces outdated rote theory with 100% production building: Year 1 (Rust, PyTorch, Agents), Year 2 (CUDA, Triton, Distributed Systems), Year 3 (Silicon Valley / Bangalore Apprenticeship), Year 4 (Startup Venture Launch).";
    } else if (q.includes('mentor') || q.includes('faculty') || q.includes('teacher') || q.includes('openai')) {
      reply = "You will be mentored 1:1 by staff researchers and engineering leaders from OpenAI, Google DeepMind, Stripe, Anthropic, and YC-backed founders who run weekly code reviews and office hours.";
    } else if (q.includes('apply') || q.includes('deadline') || q.includes('eligibility') || q.includes('admission')) {
      reply = "Applications for the Cohort of 2026-2030 are currently OPEN! The selection process includes an online dossier, a 90-minute systems design challenge, and a 1:1 interview with our founding faculty.";
    } else if (q.includes('hackerhouse') || q.includes('campus') || q.includes('hostel') || q.includes('living')) {
      reply = "Bitwise features a 24/7 Hackerhouse in Bangalore equipped with high-speed fiber, hardware maker labs with CNC and 3D printers, ergonomic focus pods, and biohacking recovery suites.";
    }

    return res.json({
      success: true,
      reply
    });
  }
};
