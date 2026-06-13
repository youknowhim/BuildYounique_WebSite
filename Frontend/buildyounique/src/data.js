// ============================================================
// Buildyounique — all static data
// Edit content here.
// ============================================================
import { ASSETS } from './config.js';

// --- Company -------------------------------------------------------
export const COMPANY = {
  name: 'Buildyounique',
  type: 'Software Development Studio',
  estYear: 2020,
  address: '12/2 Rabindra Sarani, Liluah, Howrah, West Bengal 711204, India',
  city: 'Howrah, WB',
  country: 'India',
  email: 'buildyounique2020@gmail.com',
  phone: '+91 70478 29662',
  whatsapp: 'https://wa.me/917047829662',
  socials: {
    linkedin:  'https://www.linkedin.com/company/buildyouniqueweb/posts/?feedView=all',
    instagram: 'https://www.instagram.com/buildyounique/',
  },
};

// --- Trust metrics --------------------------------------------------
export const STATS = [
  { value: 200, suffix: '+', label: 'Projects completed' },
  { value: 25,  suffix: '+', label: 'Active projects' },
  { value: 8,   suffix: '+', label: 'International clients' },
];

// --- Navigation -----------------------------------------------------
// `children` enables a hover dropdown (desktop) / inline expander (mobile).
// Each child has { id, label, target: { kind, id } } so the App can both
// navigate to the parent page AND open the relevant modal.
export const NAV = [
  { id: 'home',       label: 'Home' },
  {
    id: 'services', label: 'Services',
    children: [
      { id: 'web',        label: 'Web Development',        sub: 'MERN · Next.js · WordPress · Shopify' },
      { id: 'mobile',     label: 'Mobile App Development', sub: 'Flutter · React Native · iOS · Android' },
      { id: 'ai',         label: 'AI Development',         sub: 'LLMs · RAG · Agents · Fine-tuning' },
      { id: 'blockchain', label: 'Blockchain',             sub: 'Solana · Ethereum · Polygon · SUI' },
      { id: 'cloud',      label: 'Cloud Solutions',        sub: 'AWS · Azure · Kubernetes · Terraform' },
      { id: 'arvr',       label: 'AR / VR',                sub: 'Unity · WebXR · ARKit · ARCore' },
      { id: 'rpa',        label: 'RPA Automation',         sub: 'UiPath · Power Automate' },
    ],
  },
  {
    id: 'industries', label: 'Industries',
    wide: true,
    children: [
      { id: 'ecom',     label: 'E-Commerce' },
      { id: 'fintech',  label: 'FinTech' },
      { id: 'health',   label: 'Healthcare' },
      { id: 'edtech',   label: 'EdTech' },
      { id: 'logist',   label: 'Logistics' },
      { id: 'realest',  label: 'Real Estate' },
      { id: 'travel',   label: 'Travel & Hospitality' },
      { id: 'food',     label: 'Food Delivery' },
      { id: 'social',   label: 'Social Networks' },
      { id: 'gov',      label: 'Government' },
      { id: 'mfg',      label: 'Manufacturing' },
      { id: 'insur',    label: 'Insurance' },
      { id: 'sports',   label: 'Sports & Fitness' },
      { id: 'enter',    label: 'Entertainment' },
      { id: 'ott',      label: 'OTT Platforms' },
      { id: 'saas',     label: 'SaaS' },
      { id: 'erp',      label: 'ERP/CRM/HRMS' },
      { id: 'constr',   label: 'Construction' },
      { id: 'legal',    label: 'LegalTech' },
      { id: 'cyber',    label: 'Cybersecurity' },
      { id: 'ai',       label: 'AI Startups' },
      { id: 'block',    label: 'Blockchain' },
      { id: 'nft',      label: 'NFT Platforms' },
      { id: 'exch',     label: 'Exchanges' },
      { id: 'market',   label: 'Marketplaces' },
      { id: 'jobs',     label: 'Job Portals' },
      { id: 'learn',    label: 'Learning Platforms' },
      { id: 'ride',     label: 'Ride Sharing' },
      { id: 'telco',    label: 'Telecom' },
      { id: 'agri',     label: 'Agriculture' },
      { id: 'ngo',      label: 'NGO Platforms' },
      { id: 'dating',   label: 'Dating Platforms' },
    ],
  },
  { id: 'portfolio',  label: 'Work' },
  { id: 'whyus',      label: 'Why Us' },
  {
    id: 'training', label: 'Training',
    children: [
      { id: 'fullstack',  label: 'Full-Stack Engineering', sub: '12 weeks · live cohort' },
      { id: 'mobile',     label: 'Mobile App Development', sub: '10 weeks · live cohort' },
      { id: 'ai',         label: 'AI Engineering',         sub: '10 weeks · live cohort' },
      { id: 'blockchain', label: 'Blockchain Engineering', sub: '12 weeks · live cohort' },
      { id: 'cloud',      label: 'Cloud & DevOps',         sub: '8 weeks · live cohort' },
      { id: 'cybersec',   label: 'Cyber Security',         sub: '10 weeks · live cohort' },
    ],
  },
  {
    id: 'hackathons', label: 'Hackathons',
    children: [
      { id: 'businessathon', label: 'Businessathon', sub: '48 hrs · Hybrid · ₹5L prize' },
      { id: 'codeathon',     label: 'Codeathon',     sub: '36 hrs · Online · ₹3L prize' },
      { id: 'gameathon',     label: 'Gameathon',     sub: '48 hrs · Hybrid · ₹2L prize' },
      { id: 'cyberthon',     label: 'Cyberthon',     sub: '24 hrs · Online · ₹3L prize' },
      { id: 'aithon',        label: 'AIthon',        sub: '48 hrs · Hybrid · ₹5L prize' },
    ],
  },
  { id: 'careers',    label: 'Careers' },
  { id: 'blog',       label: 'Insights' },
  { id: 'about',      label: 'About' },
  { id: 'contact',    label: 'Contact' },
];

// --- Clients (5) ----------------------------------------------------
// `src` empty → use text fallback. Drop a PNG into /public/clients/ and
// point src at it (or update ASSETS.clients in config.js).
export const CLIENTS = [
  { name: 'FluencyHubb',   tag: 'EdTech · India',   src: ASSETS.clients.fluencyHubb },
  { name: 'ARDB Animation', tag: 'ISO 9001 Studio', src: ASSETS.clients.ardb },
  { name: 'Spark Chat',    tag: 'Messaging SaaS',   src: ASSETS.clients.sparkChat },
  { name: 'POF Infraa',    tag: 'Real Estate',      src: ASSETS.clients.pofInfraa },
  { name: 'Haryana News',  tag: 'Regional News',    src: ASSETS.clients.haryanaNews },
];

// --- Partners (2) ---------------------------------------------------
export const PARTNERS = [
  { name: 'CircuitS Labs',     tag: 'Hardware · IoT',         src: ASSETS.partners.circuitS },
  { name: 'Snaapii',           tag: 'Creative Tech',          src: ASSETS.partners.snaapii },
];

// --- Team (5) -------------------------------------------------------
export const TEAM = [
  { name: 'Pallav Rai',     role: 'Engineering Lead',           bio: 'Leads MERN / Next.js teams.' },
  { name: 'Prateek mishra',     role: 'snior NodeJS developer',                bio: 'Product Architecture. Previously at consumer fintech.' },
  { name: 'Ajay Sharma',      role: 'Mobile Apps Lead',          bio: 'Leads Flutter , IOS , Android' },
  { name: 'Priya Sharma',       role: 'Technical Project Manager',  bio: 'Delivery, scope, sprints. Keeps the trains running.' },
  { name: 'Rohan Chatterjee',   role: 'AI Engineer',                bio: 'RAG systems, LLM applications, fine-tuning pipelines.' },
];

// --- Services (7) ---------------------------------------------------
export const SERVICES = [
  {
    id: 'web', title: 'Web Development', icon: 'Globe',
    blurb: 'High-performance web platforms — from custom MERN/Next.js to enterprise WordPress and headless e-commerce.',
    stack: ['MERN', 'MEAN', '.NET', 'Next.js', 'WordPress', 'Shopify', 'Magento', 'WooCommerce'],
    grad: 'linear-gradient(135deg, #4F8AFE 0%, #06D6A0 100%)',
  },
  {
    id: 'mobile', title: 'Mobile App Development', icon: 'Smartphone',
    blurb: 'Native iOS, native Android, and cross-platform apps that feel hand-crafted on every device.',
    stack: ['Flutter', 'React Native', 'iOS', 'Android', 'Ionic', 'MAUI'],
    grad: 'linear-gradient(135deg, #A855F7 0%, #EC4899 100%)',
  },
  {
    id: 'ai', title: 'AI Development', icon: 'Sparkles',
    blurb: 'Production LLM applications: RAG, agents, vision pipelines, custom fine-tuning.',
    stack: ['LLMs', 'RAG', 'Agents', 'Vision', 'Chatbots', 'Fine-tuning'],
    grad: 'linear-gradient(135deg, #06D6A0 0%, #4F8AFE 100%)',
  },
  {
    id: 'blockchain', title: 'Blockchain', icon: 'Link',
    blurb: 'Smart contracts, exchanges, RWA tokenisation, NFT and STO platforms across six chains.',
    stack: ['Solana', 'Ethereum', 'Polygon', 'SUI', 'Stellar', 'Tron'],
    grad: 'linear-gradient(135deg, #FFB547 0%, #EC4899 100%)',
  },
  {
    id: 'cloud', title: 'Cloud Solutions', icon: 'Cloud',
    blurb: 'AWS, Azure, Kubernetes, Terraform, observability — built to scale and stay up.',
    stack: ['AWS', 'Azure', 'Kubernetes', 'Terraform', 'Observability'],
    grad: 'linear-gradient(135deg, #4F8AFE 0%, #A855F7 100%)',
  },
  {
    id: 'arvr', title: 'AR / VR', icon: 'Glasses',
    blurb: 'Immersive experiences with Unity, WebXR, Meta Quest, ARKit and ARCore.',
    stack: ['Unity', 'WebXR', 'Meta Quest', 'ARKit', 'ARCore'],
    grad: 'linear-gradient(135deg, #A855F7 0%, #4F8AFE 100%)',
  },
  {
    id: 'rpa', title: 'RPA Automation', icon: 'Workflow',
    blurb: 'Automate repetitive workflows with UiPath, Automation Anywhere and Power Automate.',
    stack: ['UiPath', 'Automation Anywhere', 'Power Automate'],
    grad: 'linear-gradient(135deg, #06D6A0 0%, #4F8AFE 100%)',
  },
];

// --- Industries (33) ------------------------------------------------
export const INDUSTRIES = [
  'E-Commerce','FinTech','Healthcare','EdTech','Logistics','Real Estate','Travel','Hospitality',
  'Food Delivery','Social Networks','Government','Manufacturing','Insurance','Sports & Fitness',
  'Entertainment','OTT Platforms','SaaS','ERP/CRM/HRMS','Construction','LegalTech','Cybersecurity',
  'AI Startups','Blockchain Startups','NFT Platforms','Exchanges','Marketplaces','Job Portals',
  'Learning Platforms','Ride Sharing','Telecom','Agriculture','NGO Platforms','Dating Platforms',
];

// --- Portfolio (6) --------------------------------------------------
export const PORTFOLIO = [
  { id: 'p1', title: 'Nordlys — Multi-tenant commerce', category: 'E-Commerce',     stack: 'Next.js · Medusa · Stripe',       img: ASSETS.portfolio.ecommerce,    year: 2024 },
  { id: 'p2', title: 'Volt — Analytics for fintech',    category: 'FinTech',        stack: 'React · D3 · Postgres',           img: ASSETS.portfolio.fintech,      year: 2024 },
  { id: 'p3', title: 'Markhouse — Brand system',        category: 'Graphic Design', stack: 'Identity · Logos · Guidelines',   img: ASSETS.portfolio.graphicLogos, year: 2025 },
  { id: 'p4', title: 'Reso — Event campaign suite',     category: 'Event Banners',  stack: 'Print · Social · Motion',         img: ASSETS.portfolio.eventBanners, year: 2024 },
  { id: 'p5', title: 'Lunaria — Wellness app',          category: 'Mobile App',     stack: 'Flutter · Firebase · HealthKit',  img: ASSETS.portfolio.mobileApp,    year: 2025 },
  { id: 'p6', title: 'Atlas — AI knowledge assistant',  category: 'AI Product',     stack: 'RAG · OpenAI · pgvector',         img: ASSETS.portfolio.aiProduct,    year: 2025 },
];

// --- Hackathons (5) -------------------------------------------------
export const HACKATHONS = [
  {
    id: 'businessathon', name: 'Businessathon', duration: '48 hrs', mode: 'Hybrid', prize: '₹5,00,000',
    tagline: 'Build a business in a weekend.',
    grad: 'linear-gradient(135deg, #4F8AFE 0%, #06D6A0 100%)',
    categories: ['Consumer', 'B2B SaaS', 'D2C', 'Marketplace', 'Sustainability'],
    description: 'Founders, designers and engineers team up to ship a real go-to-market in 48 hours. Mentorship from VCs and seasoned operators.',
    stages: [
      { n: '01', title: 'Idea Selection', desc: 'Best idea gets mentor support for project prototype building + ₹3,000 preparation grant per candidate.' },
      { n: '02', title: 'Prototype Selection', time: 'Within 2 weeks', desc: 'District level selection (2 teams/district). Winners get ₹4,000 for product enhancement support.' },
      { n: '03', title: 'Financial & Marketing Proposal', time: 'Within 7 weeks', desc: 'Submit financial and marketing proposals. Best proposal gets ₹60,000 funding for product advancement.' },
      { n: '04', title: 'Business Management Proposal', desc: 'Top 3 candidates selected for Business Registration, ₹5 LPA funding for business start, plus a trip to Singapore.' }
    ],
    prizesList: [
      { label: '1st Best Prototype', amount: '₹1,00,000' },
      { label: '2nd Best Prototype', amount: '₹90,000' },
      { label: '3rd Best Prototype', amount: '₹70,000' }
    ],
    prizeNote: 'Candidates will receive support for business registration, manpower planning, and a 3-year support term for the business. A 5% share will be taken for 5 years.',
  },
  {
    id: 'codeathon', name: 'Codeathon', duration: '36 hrs', mode: 'Online', prize: '₹3,00,000',
    tagline: 'Pure engineering. No fluff.',
    grad: 'linear-gradient(135deg, #A855F7 0%, #4F8AFE 100%)',
    categories: ['Web', 'Mobile', 'Backend', 'Systems', 'Open Source'],
    description: 'Tight problem statements, brutal judging on code quality, performance and architecture. Bring your editor of choice.',
    stages: [
      { n: '01', title: 'Idea Selection', desc: 'Best idea gets mentor support for project prototype building + ₹3,000 preparation grant per candidate.' },
      { n: '02', title: 'Prototype Selection', time: 'Within 2 weeks', desc: 'District level selection (2 teams/district). Winners get ₹4,000 for product enhancement support.' },
      { n: '03', title: 'Financial & Marketing Proposal', time: 'Within 7 weeks', desc: 'Submit financial and marketing proposals. Best proposal gets ₹60,000 funding for product advancement.' },
      { n: '04', title: 'Business Management Proposal', desc: 'Top 3 candidates selected for Business Registration, ₹5 LPA funding for business start, plus a trip to Singapore.' }
    ],
    prizesList: [
      { label: '1st Best Prototype', amount: '₹1,00,000' },
      { label: '2nd Best Prototype', amount: '₹90,000' },
      { label: '3rd Best Prototype', amount: '₹70,000' }
    ],
    prizeNote: 'Candidates will receive support for business registration, manpower planning, and a 3-year support term for the business. A 5% share will be taken for 5 years.',
  },
  {
    id: 'gameathon', name: 'Gameathon', duration: '48 hrs', mode: 'Hybrid', prize: '₹2,00,000',
    tagline: 'Make something people actually want to play.',
    grad: 'linear-gradient(135deg, #EC4899 0%, #FFB547 100%)',
    categories: ['Hyper-casual', '2D Indie', '3D', 'Web', 'AR/VR'],
    description: 'Unity, Godot, Three.js — engine of your choice. Judged on fun, craft and originality. Demo to a live audience.',
    stages: [{ n: '01', title: 'Theme reveal', time: 'Hrs 0–1' }, { n: '02', title: 'Build & playtest', time: 'Hrs 1–42' }, { n: '03', title: 'Live demo', time: 'Hrs 42–48' }],
  },
  {
    id: 'cyberthon', name: 'Cyberthon', duration: '24 hrs', mode: 'Online', prize: '₹3,00,000',
    tagline: 'Capture the flag. Defend the perimeter.',
    grad: 'linear-gradient(135deg, #FF5C7C 0%, #A855F7 100%)',
    categories: ['CTF', 'Red Team', 'Blue Team', 'Forensics', 'Reverse Eng.'],
    description: 'CTF challenges, red-vs-blue rounds, real-world incident simulations. Bring your tooling.',
    stages: [{ n: '01', title: 'CTF opens', time: 'Hrs 0–1' }, { n: '02', title: 'Red vs Blue rounds', time: 'Hrs 1–20' }, { n: '03', title: 'Scoreboard & winners', time: 'Hrs 20–24' }],
  },
  {
    id: 'aithon', name: 'AIthon', duration: '48 hrs', mode: 'Hybrid', prize: '₹5,00,000',
    tagline: 'Ship a useful AI product in 48 hours.',
    grad: 'linear-gradient(135deg, #06D6A0 0%, #4F8AFE 100%)',
    categories: ['LLM Apps', 'RAG', 'Agents', 'Vision', 'Voice'],
    description: 'Real product, real users, real metrics. Demo to an audience of investors and engineers.',
    stages: [{ n: '01', title: 'Kickoff & mentors', time: 'Hrs 0–4' }, { n: '02', title: 'Build & eval', time: 'Hrs 4–42' }, { n: '03', title: 'Investor demo', time: 'Hrs 42–48' }],
  },
];

// --- Training courses (6) — ₹5,000 → ₹3,000 -------------------------
export const COURSES = [
  {
    id: 'fullstack', name: 'Full-Stack Engineering', weeks: 12,
    cover: ASSETS.training.fullstack,
    grad: 'linear-gradient(135deg, #4F8AFE 0%, #06D6A0 100%)',
    assessment: 'Weekly project submissions + final capstone reviewed by senior engineers.',
    outcome: 'Ship a deployed full-stack app with CI/CD, tests, and observability. Portfolio-ready.',
    schedule: 'Mon, Wed, Fri · 7–9 PM IST · Live + recorded',
    batch: 'Cohort 09 starts in 14 days',
    mode: 'Live online',
    modules: [
      'JavaScript fundamentals and modern syntax',
      'TypeScript for product code',
      'React deep dive — hooks, state, performance',
      'Next.js — routing, server components, edge',
      'Node.js + Express + Fastify',
      'Postgres modelling & SQL',
      'REST and tRPC API design',
      'Auth, sessions and JWT done right',
      'Testing (Vitest, Playwright)',
      'Docker + CI/CD + deployment',
      'Observability, logs, metrics, traces',
      'Capstone project + portfolio polish',
    ],
  },
  {
    id: 'mobile', name: 'Mobile App Development', weeks: 10,
    cover: ASSETS.training.mobile,
    grad: 'linear-gradient(135deg, #A855F7 0%, #EC4899 100%)',
    assessment: 'Two app submissions + a published Play Store / App Store release as capstone.',
    outcome: 'Publish a real mobile app on Play Store / App Store as the capstone.',
    schedule: 'Tue, Thu, Sat · 7–9 PM IST · Live + recorded',
    batch: 'Cohort 06 starts in 7 days',
    mode: 'Live online',
    modules: [
      'Dart fundamentals',
      'Flutter widgets and composition',
      'State management — Riverpod, Bloc',
      'React Native + Expo',
      'Native modules and platform channels',
      'Offline-first architecture',
      'Push notifications + analytics',
      'In-app purchases and subscriptions',
      'Performance profiling',
      'App Store and Play Store submission',
    ],
  },
  {
    id: 'ai', name: 'AI Engineering', weeks: 10,
    cover: ASSETS.training.ai,
    grad: 'linear-gradient(135deg, #06D6A0 0%, #4F8AFE 100%)',
    assessment: 'RAG mid-bootcamp, agent system as final capstone — graded on eval harness.',
    outcome: 'Ship a production RAG system and an agent that performs real tasks against an eval harness.',
    schedule: 'Mon, Wed, Sat · 7–9 PM IST · Live + recorded',
    batch: 'Cohort 04 starts in 21 days',
    mode: 'Live online',
    modules: [
      'LLM fundamentals — tokens, context, sampling',
      'Prompt engineering for production',
      'Embeddings and vector databases',
      'RAG architectures and chunking strategies',
      'Function calling and tool use',
      'Agent loops — ReAct, plan-execute',
      'Eval harnesses and offline metrics',
      'Fine-tuning small models with LoRA',
      'Cost, latency and reliability',
      'Capstone: ship an agent with eval coverage',
    ],
  },
  {
    id: 'blockchain', name: 'Blockchain Engineering', weeks: 12,
    cover: ASSETS.training.blockchain,
    grad: 'linear-gradient(135deg, #FFB547 0%, #EC4899 100%)',
    assessment: 'Solidity assignments + a deployed dApp on testnet as capstone.',
    outcome: 'Ship audited smart contracts to testnet and a dApp front-end users can actually use.',
    schedule: 'Tue, Thu, Sat · 8–10 PM IST · Live + recorded',
    batch: 'Cohort 03 starts in 18 days',
    mode: 'Live online',
    modules: [
      'Blockchain primitives and consensus',
      'Solidity from scratch to advanced',
      'EVM internals and gas optimisation',
      'Foundry — testing and fuzzing',
      'Common DeFi patterns (AMM, lending)',
      'Solana and the Anchor framework',
      'Smart contract security and audits',
      'Wagmi, viem and wallet integrations',
      'NFTs and metadata standards',
      'RWA tokenisation patterns',
      'Capstone: dApp on testnet',
      'Bonus: subgraphs and indexing',
    ],
  },
  {
    id: 'cloud', name: 'Cloud & DevOps', weeks: 8,
    cover: ASSETS.training.cloud,
    grad: 'linear-gradient(135deg, #4F8AFE 0%, #A855F7 100%)',
    assessment: 'Two infra builds + a full IaC + CI/CD pipeline as capstone.',
    outcome: 'Stand up production-grade infra with IaC, CI/CD and observability — by yourself.',
    schedule: 'Mon, Wed, Fri · 8–10 PM IST · Live + recorded',
    batch: 'Cohort 05 starts in 10 days',
    mode: 'Live online',
    modules: [
      'Linux and networking refresher',
      'Docker — images, networking, volumes',
      'Kubernetes — pods, services, ingress, helm',
      'AWS core services and IAM',
      'Azure equivalents and decision criteria',
      'Terraform — modules, state, workspaces',
      'CI/CD — GitHub Actions, GitLab CI',
      'Observability — Prometheus, Grafana, Loki',
    ],
  },
  {
    id: 'cybersec', name: 'Cyber Security', weeks: 10,
    cover: ASSETS.training.cybersec,
    grad: 'linear-gradient(135deg, #FF5C7C 0%, #A855F7 100%)',
    assessment: 'Weekly CTF challenges + a full penetration-test report as capstone.',
    outcome: 'Conduct a full penetration test with a professional report and remediation plan.',
    schedule: 'Tue, Thu, Sun · 8–10 PM IST · Live + recorded',
    batch: 'Cohort 02 starts in 25 days',
    mode: 'Live online',
    modules: [
      'Network fundamentals and recon',
      'Web application security (OWASP Top 10)',
      'Burp Suite and proxy intercepts',
      'Authentication and session attacks',
      'Linux and Windows privilege escalation',
      'Active Directory attacks',
      'Reverse engineering basics',
      'Cloud security (IAM, S3, secrets)',
      'Reporting and remediation',
      'Capstone penetration test',
    ],
  },
];

// --- Course pricing (shared) ----------------------------------------
export const COURSE_PRICING = {
  original:    5000,
  discounted:  3000,
  currency:    '₹',
  savings:     2000,
};

// --- Hackathon pricing ----------------------------------------------
export const HACKATHON_FEE = 1000;

// --- Job openings (11, all remote) ---------------------------------
export const JOBS = [
  { id: 'j01', title: 'Senior React Engineer',        type: 'Full-time',  experience: '4+ yrs',     location: 'Remote', team: 'Engineering', salary: '₹24–36 LPA' },
  { id: 'j02', title: 'Flutter Engineer',             type: 'Full-time',  experience: '3+ yrs',     location: 'Remote', team: 'Mobile',      salary: '₹18–28 LPA' },
  { id: 'j03', title: 'AI / RAG Engineer',            type: 'Full-time',  experience: '3+ yrs',     location: 'Remote', team: 'AI',          salary: '₹24–40 LPA' },
  { id: 'j04', title: 'Smart Contract Engineer',      type: 'Contract',   experience: '3+ yrs',     location: 'Remote', team: 'Blockchain',  salary: 'Contract' },
  { id: 'j05', title: 'Cloud / DevOps Engineer',      type: 'Full-time',  experience: '3+ yrs',     location: 'Remote', team: 'Infra',       salary: '₹20–32 LPA' },
  { id: 'j06', title: 'Product Designer',             type: 'Full-time',  experience: '3+ yrs',     location: 'Remote', team: 'Design',      salary: '₹16–26 LPA' },
  { id: 'j07', title: 'Node.js Backend Engineer',     type: 'Full-time',  experience: '3+ yrs',     location: 'Remote', team: 'Engineering', salary: '₹18–28 LPA' },
  { id: 'j08', title: 'QA Automation Engineer',       type: 'Full-time',  experience: '2+ yrs',     location: 'Remote', team: 'Quality',     salary: '₹12–20 LPA' },
  { id: 'j09', title: 'Technical Project Manager',    type: 'Full-time',  experience: '5+ yrs',     location: 'Remote', team: 'Delivery',    salary: '₹22–34 LPA' },
  { id: 'j10', title: 'WordPress / Shopify Dev',      type: 'Full-time',  experience: '2+ yrs',     location: 'Remote', team: 'Web',         salary: '₹10–18 LPA' },
  { id: 'j11', title: 'Engineering Intern',           type: 'Internship', experience: 'Fresher',    location: 'Remote', team: 'Engineering', salary: '₹25k–35k / mo' },
];

// --- Process (How we work) -----------------------------------------
export const PROCESS = [
  { n: '01', title: 'Discovery',     blurb: 'We listen, audit and reframe the problem with you. No template decks — every brief gets its own.' },
  { n: '02', title: 'Architecture',  blurb: 'Tech selection, infra, data, integration map — written down so there are no surprises.' },
  { n: '03', title: 'Design & build',blurb: 'Tight loops — design, build, ship, demo. Weekly demos. Always a working build to look at.' },
  { n: '04', title: 'Launch',        blurb: 'Hardening, performance, observability, security review and a soft launch with a real cohort.' },
  { n: '05', title: 'Operate',       blurb: 'We stay on for SRE, optimisation and product evolution. You get a real team, not a one-night stand.' },
];

// --- FAQ ------------------------------------------------------------
export const FAQ = [
  { q: 'How long does a typical engagement run?', a: 'Most projects run 8–24 weeks for the first launch, then transition into a longer ops contract. We do shorter scope-locked engagements (4–6 weeks) for focused workstreams like AI integrations or migrations.' },
  { q: 'Do you work fixed-price or time-and-materials?', a: 'Both, depending on certainty. Greenfield products usually start fixed-price for an MVP, then move to T&M after launch. Enterprise integrations are nearly always T&M with weekly caps.' },
  { q: 'Can you sign an NDA before we share details?', a: 'Yes — send the NDA to buildyounique2020@gmail.com and we will counter-sign within a working day.' },
  { q: 'Do you work with founders pre-product / pre-funding?', a: 'Selectively. We take on a small number of founder engagements each year, sometimes with deferred or equity-blended pricing. Tell us what you are building and we will respond honestly.' },
  { q: 'Where is the team based?', a: 'Studio is in Howrah, West Bengal. The team is hybrid — engineers across India, with leads in Howrah and Bengaluru.' },
  { q: 'Do you guarantee delivery dates?', a: 'We guarantee a working build every week. We do not guarantee scope-locked dates without a scope freeze — anyone who does is lying. Ask us for our delivery promise and we will share it in writing.' },
];

// --- Testimonials ---------------------------------------------------
export const TESTIMONIALS = [
  { quote: 'They built our marketplace from a Notion brief to a deployed product in nine weeks. Most agencies would have spent that long on discovery.',
    author: 'Founder, FinTech (Dubai)' },
  { quote: 'The AI team integrated a RAG system into our knowledge base that actually works in production. We have not had to rebuild it.',
    author: 'Head of Platform, OTT (Mumbai)' },
];

// --- Tech ticker ----------------------------------------------------
export const TECH_TICKER = [
  'React', 'Next.js', 'Node.js', 'TypeScript', 'Flutter', 'React Native',
  'Postgres', 'MongoDB', 'Redis', 'AWS', 'Azure', 'Kubernetes',
  'Terraform', 'Solidity', 'Solana', 'Python', 'PyTorch', 'LangChain',
  'OpenAI', 'Anthropic', 'Stripe', 'Twilio', 'Vercel', 'Cloudflare',
];

// --- Insights (blog) ------------------------------------------------
export const INSIGHTS = [
  { id: 'b1', title: 'Why we pick boring tech for new products', date: 'Apr 18, 2026', read: '6 min', tag: 'Engineering' },
  { id: 'b2', title: 'A practical RAG eval harness in 200 lines', date: 'Mar 30, 2026', read: '12 min', tag: 'AI' },
  { id: 'b3', title: 'The hidden cost of fixed-price agency work', date: 'Mar 11, 2026', read: '8 min', tag: 'Studio' },
  { id: 'b4', title: 'Flutter at scale — what we learnt at 200k DAUs', date: 'Feb 22, 2026', read: '10 min', tag: 'Mobile' },
  { id: 'b5', title: 'Auditing a Solidity codebase: a checklist', date: 'Feb 04, 2026', read: '14 min', tag: 'Blockchain' },
  { id: 'b6', title: 'Observability for small teams', date: 'Jan 19, 2026', read: '7 min', tag: 'Infra' },
];

// --- Proof points ---------------------------------------------------
export const PROOF_POINTS = [
  { metric: '99.96%', label: 'Average uptime, last 12 months', detail: 'Across all production systems we operate' },
  { metric: '47',     label: 'Net Promoter Score',             detail: 'From clients in the last 18 months' },
  { metric: '< 4w',   label: 'Time from kickoff to first deploy', detail: 'Measured across the last 30 engagements' },
  { metric: '0',      label: 'Critical security incidents',    detail: 'Since the studio was founded' },
];
