export interface DemoSkill {
  id: string;
  name: string;
  category: string;
}

export interface DemoStudentSkill {
  id: string;
  userId: string;
  skillId: string;
  proficiency: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  skill: DemoSkill;
}

export interface DemoProfile {
  id: string;
  userId: string;
  bio: string;
  interests: string;
  availability: string;
  experience: string;
  department: string;
  year: string;
  githubUsername: string;
  avatarUrl: string;
}

export interface DemoUser {
  id: string;
  name: string;
  email: string;
  role: 'STUDENT' | 'ADMIN';
  isActive: boolean;
  profile: DemoProfile;
  studentSkills: DemoStudentSkill[];
}

export interface DemoProjectSkill {
  id: string;
  projectId: string;
  skillId: string;
  requiredLevel: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  skill: DemoSkill;
}

export interface DemoTeamMember {
  id: string;
  teamId: string;
  userId: string;
  role: 'OWNER' | 'MEMBER' | 'LEAD';
  joinedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    profile: DemoProfile;
    studentSkills: DemoStudentSkill[];
  };
}

export interface DemoTeam {
  id: string;
  projectId: string;
  status: 'FORMING' | 'ACTIVE' | 'FULL' | 'DISBANDED';
  members: DemoTeamMember[];
}

export interface DemoTask {
  id: string;
  projectId: string;
  assigneeId: string | null;
  title: string;
  description: string | null;
  status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
  assignee?: {
    id: string;
    name: string;
    email: string;
    profile?: { avatarUrl?: string };
  } | null;
}

export interface DemoRepository {
  id: string;
  projectId: string;
  githubUrl: string;
  owner: string;
  name: string;
  description: string;
  stars: number;
  forks: number;
  language: string;
  lastUpdated: string;
  commits?: Array<{
    sha: string;
    message: string;
    author: string;
    date: string;
  }>;
}

export interface DemoProject {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  category: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CLOSED';
  preferredTeamSize: number;
  createdAt: string;
  updatedAt: string;
  owner: {
    id: string;
    name: string;
    email: string;
    profile: DemoProfile;
  };
  projectSkills: DemoProjectSkill[];
  team?: DemoTeam;
  tasks: DemoTask[];
  repository?: DemoRepository | null;
}

export interface DemoCollaborationRequest {
  id: string;
  senderId: string;
  receiverId: string;
  projectId: string;
  message: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
  sender: {
    id: string;
    name: string;
    email: string;
    profile: DemoProfile;
  };
  receiver: {
    id: string;
    name: string;
    email: string;
    profile: DemoProfile;
  };
  project: {
    id: string;
    title: string;
    category: string;
    ownerId: string;
  };
}

export interface DemoNotification {
  id: string;
  userId: string;
  type: string;
  message: string;
  link: string;
  readStatus: boolean;
  createdAt: string;
}

export interface DemoReport {
  id: string;
  reporterId: string;
  projectId?: string | null;
  reason: string;
  status: 'PENDING' | 'REVIEWED' | 'RESOLVED' | 'DISMISSED';
  createdAt: string;
  reporter: {
    id: string;
    name: string;
    email: string;
  };
  project?: {
    id: string;
    title: string;
  } | null;
}

export const INITIAL_SKILLS: DemoSkill[] = [
  { id: 'sk-1', name: 'React', category: 'Frontend' },
  { id: 'sk-2', name: 'Next.js', category: 'Frontend' },
  { id: 'sk-3', name: 'TypeScript', category: 'Frontend' },
  { id: 'sk-4', name: 'JavaScript', category: 'Frontend' },
  { id: 'sk-5', name: 'Tailwind CSS', category: 'Frontend' },
  { id: 'sk-6', name: 'UI/UX', category: 'Design' },
  { id: 'sk-7', name: 'Figma', category: 'Design' },
  { id: 'sk-8', name: 'Node.js', category: 'Backend' },
  { id: 'sk-9', name: 'Express.js', category: 'Backend' },
  { id: 'sk-10', name: 'Python', category: 'Backend' },
  { id: 'sk-11', name: 'Java', category: 'Backend' },
  { id: 'sk-12', name: 'C++', category: 'Backend' },
  { id: 'sk-13', name: 'PostgreSQL', category: 'Database' },
  { id: 'sk-14', name: 'MongoDB', category: 'Database' },
  { id: 'sk-15', name: 'Redis', category: 'Database' },
  { id: 'sk-16', name: 'Machine Learning', category: 'AI/ML' },
  { id: 'sk-17', name: 'Data Science', category: 'AI/ML' },
  { id: 'sk-18', name: 'PyTorch', category: 'AI/ML' },
  { id: 'sk-19', name: 'DevOps', category: 'DevOps' },
  { id: 'sk-20', name: 'Docker', category: 'DevOps' },
  { id: 'sk-21', name: 'Git', category: 'Tools' },
  { id: 'sk-22', name: 'GitHub', category: 'Tools' },
  { id: 'sk-23', name: 'Flutter', category: 'Mobile' },
  { id: 'sk-24', name: 'Android', category: 'Mobile' },
  { id: 'sk-25', name: 'Cybersecurity', category: 'Security' },
  { id: 'sk-26', name: 'Cloud Computing', category: 'Cloud' },
];

export const INITIAL_USERS: DemoUser[] = [
  {
    id: 'cmuzaljmn000qg71jwzdeazzf',
    name: 'Dr. Ramesh Kumar (Admin)',
    email: 'admin@example.com',
    role: 'ADMIN',
    isActive: true,
    profile: {
      id: 'prof-admin',
      userId: 'cmuzaljmn000qg71jwzdeazzf',
      bio: 'Department Head & Project Coordinator, CSE Department. Overseeing academic capstone and mini projects.',
      interests: 'Cloud Computing, Software Architecture, Higher Education Management',
      availability: 'Full-time',
      experience: 'Expert',
      department: 'Computer Science & Engineering',
      year: 'Faculty Lead',
      githubUsername: 'ramesh-cse-admin',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    },
    studentSkills: [],
  },
  {
    id: 'cmuzaljn5000sg71jndldlm8k',
    name: 'Karthik Rao',
    email: 'student@example.com',
    role: 'STUDENT',
    isActive: true,
    profile: {
      id: 'prof-karthik',
      userId: 'cmuzaljn5000sg71jndldlm8k',
      bio: 'Final year CSE undergraduate passionate about full-stack web development, distributed systems, and real-time mapping applications.',
      interests: 'Web Development, Distributed Systems, Cloud Computing, UI/UX',
      availability: '15-20 hrs/week',
      experience: '2+ years',
      department: 'Computer Science & Engineering',
      year: 'Final Year',
      githubUsername: 'karthik-rao-dev',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    },
    studentSkills: [
      { id: 'ss-1', userId: 'cmuzaljn5000sg71jndldlm8k', skillId: 'sk-1', proficiency: 'ADVANCED', skill: INITIAL_SKILLS[0] },
      { id: 'ss-2', userId: 'cmuzaljn5000sg71jndldlm8k', skillId: 'sk-2', proficiency: 'ADVANCED', skill: INITIAL_SKILLS[1] },
      { id: 'ss-3', userId: 'cmuzaljn5000sg71jndldlm8k', skillId: 'sk-8', proficiency: 'INTERMEDIATE', skill: INITIAL_SKILLS[7] },
      { id: 'ss-4', userId: 'cmuzaljn5000sg71jndldlm8k', skillId: 'sk-13', proficiency: 'ADVANCED', skill: INITIAL_SKILLS[12] },
      { id: 'ss-5', userId: 'cmuzaljn5000sg71jndldlm8k', skillId: 'sk-3', proficiency: 'ADVANCED', skill: INITIAL_SKILLS[2] },
      { id: 'ss-6', userId: 'cmuzaljn5000sg71jndldlm8k', skillId: 'sk-5', proficiency: 'EXPERT', skill: INITIAL_SKILLS[4] },
      { id: 'ss-7', userId: 'cmuzaljn5000sg71jndldlm8k', skillId: 'sk-21', proficiency: 'ADVANCED', skill: INITIAL_SKILLS[20] },
    ],
  },
  {
    id: 'cmuzaljpv0018g71j3tfiwymm',
    name: 'Rahul Sharma',
    email: 'rahul@example.com',
    role: 'STUDENT',
    isActive: true,
    profile: {
      id: 'prof-rahul',
      userId: 'cmuzaljpv0018g71j3tfiwymm',
      bio: 'Full-stack developer with 2 years building React and Node.js web services. Looking for collaborative capstone projects.',
      interests: 'Web Development, UI/UX, Cloud Computing, Database Architecture',
      availability: '15-20 hrs/week',
      experience: '2+ years',
      department: 'Computer Science & Engineering',
      year: '3rd Year',
      githubUsername: 'rahulsharma-dev',
      avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    },
    studentSkills: [
      { id: 'ss-8', userId: 'cmuzaljpv0018g71j3tfiwymm', skillId: 'sk-1', proficiency: 'ADVANCED', skill: INITIAL_SKILLS[0] },
      { id: 'ss-9', userId: 'cmuzaljpv0018g71j3tfiwymm', skillId: 'sk-8', proficiency: 'ADVANCED', skill: INITIAL_SKILLS[7] },
      { id: 'ss-10', userId: 'cmuzaljpv0018g71j3tfiwymm', skillId: 'sk-13', proficiency: 'INTERMEDIATE', skill: INITIAL_SKILLS[12] },
      { id: 'ss-11', userId: 'cmuzaljpv0018g71j3tfiwymm', skillId: 'sk-6', proficiency: 'INTERMEDIATE', skill: INITIAL_SKILLS[5] },
      { id: 'ss-12', userId: 'cmuzaljpv0018g71j3tfiwymm', skillId: 'sk-3', proficiency: 'INTERMEDIATE', skill: INITIAL_SKILLS[2] },
    ],
  },
  {
    id: 'cmuzaljrp001kg71jpedtapq8',
    name: 'Ananya Verma',
    email: 'ananya@example.com',
    role: 'STUDENT',
    isActive: true,
    profile: {
      id: 'prof-ananya',
      userId: 'cmuzaljrp001kg71jpedtapq8',
      bio: 'UI/UX designer and frontend engineer. Love crafting accessible web apps and interactive Figma prototypes.',
      interests: 'UI/UX, Frontend, Web Development, Design Systems',
      availability: '15-20 hrs/week',
      experience: '2 years',
      department: 'Information Technology',
      year: '3rd Year',
      githubUsername: 'ananya-designs',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    },
    studentSkills: [
      { id: 'ss-13', userId: 'cmuzaljrp001kg71jpedtapq8', skillId: 'sk-6', proficiency: 'EXPERT', skill: INITIAL_SKILLS[5] },
      { id: 'ss-14', userId: 'cmuzaljrp001kg71jpedtapq8', skillId: 'sk-7', proficiency: 'EXPERT', skill: INITIAL_SKILLS[6] },
      { id: 'ss-15', userId: 'cmuzaljrp001kg71jpedtapq8', skillId: 'sk-1', proficiency: 'ADVANCED', skill: INITIAL_SKILLS[0] },
      { id: 'ss-16', userId: 'cmuzaljrp001kg71jpedtapq8', skillId: 'sk-5', proficiency: 'ADVANCED', skill: INITIAL_SKILLS[4] },
    ],
  },
  {
    id: 'cmuzaljtb001ug71jdc2rjukz',
    name: 'Rohan Patel',
    email: 'rohan@example.com',
    role: 'STUDENT',
    isActive: true,
    profile: {
      id: 'prof-rohan',
      userId: 'cmuzaljtb001ug71jdc2rjukz',
      bio: 'Backend enthusiast and database optimizer. Experience with PostgreSQL, Redis caching, and Docker containers.',
      interests: 'Backend, Database, DevOps, Web Development',
      availability: '15-20 hrs/week',
      experience: '2+ years',
      department: 'Computer Science & Engineering',
      year: 'Final Year',
      githubUsername: 'rohan-backend',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    },
    studentSkills: [
      { id: 'ss-17', userId: 'cmuzaljtb001ug71jdc2rjukz', skillId: 'sk-8', proficiency: 'EXPERT', skill: INITIAL_SKILLS[7] },
      { id: 'ss-18', userId: 'cmuzaljtb001ug71jdc2rjukz', skillId: 'sk-13', proficiency: 'EXPERT', skill: INITIAL_SKILLS[12] },
      { id: 'ss-19', userId: 'cmuzaljtb001ug71jdc2rjukz', skillId: 'sk-20', proficiency: 'ADVANCED', skill: INITIAL_SKILLS[19] },
      { id: 'ss-20', userId: 'cmuzaljtb001ug71jdc2rjukz', skillId: 'sk-19', proficiency: 'INTERMEDIATE', skill: INITIAL_SKILLS[18] },
    ],
  },
  {
    id: 'cmuzaljuy0024g71jwkk08uxf',
    name: 'Priya Iyer',
    email: 'priya@example.com',
    role: 'STUDENT',
    isActive: true,
    profile: {
      id: 'prof-priya',
      userId: 'cmuzaljuy0024g71jwkk08uxf',
      bio: 'Machine learning practitioner working on Natural Language Processing and computer vision algorithms.',
      interests: 'AI/ML, Data Science, Python, Deep Learning',
      availability: '15-20 hrs/week',
      experience: 'Expert',
      department: 'Data Science & AI',
      year: 'Final Year',
      githubUsername: 'priyaiyer-ml',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
    studentSkills: [
      { id: 'ss-21', userId: 'cmuzaljuy0024g71jwkk08uxf', skillId: 'sk-10', proficiency: 'EXPERT', skill: INITIAL_SKILLS[9] },
      { id: 'ss-22', userId: 'cmuzaljuy0024g71jwkk08uxf', skillId: 'sk-16', proficiency: 'EXPERT', skill: INITIAL_SKILLS[15] },
      { id: 'ss-23', userId: 'cmuzaljuy0024g71jwkk08uxf', skillId: 'sk-17', proficiency: 'ADVANCED', skill: INITIAL_SKILLS[16] },
      { id: 'ss-24', userId: 'cmuzaljuy0024g71jwkk08uxf', skillId: 'sk-18', proficiency: 'ADVANCED', skill: INITIAL_SKILLS[17] },
    ],
  },
  {
    id: 'cmuzaljwi002eg71jq75b39rl',
    name: 'Sneha Kulkarni',
    email: 'sneha@example.com',
    role: 'STUDENT',
    isActive: true,
    profile: {
      id: 'prof-sneha',
      userId: 'cmuzaljwi002eg71jq75b39rl',
      bio: 'Mobile application developer creating cross-platform apps with Flutter and native Android.',
      interests: 'Mobile App, Flutter, Android, UI/UX',
      availability: '10-15 hrs/week',
      experience: '1-2 years',
      department: 'Computer Science & Engineering',
      year: '3rd Year',
      githubUsername: 'sneha-flutter',
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    },
    studentSkills: [
      { id: 'ss-25', userId: 'cmuzaljwi002eg71jq75b39rl', skillId: 'sk-23', proficiency: 'ADVANCED', skill: INITIAL_SKILLS[22] },
      { id: 'ss-26', userId: 'cmuzaljwi002eg71jq75b39rl', skillId: 'sk-24', proficiency: 'INTERMEDIATE', skill: INITIAL_SKILLS[23] },
      { id: 'ss-27', userId: 'cmuzaljwi002eg71jq75b39rl', skillId: 'sk-6', proficiency: 'INTERMEDIATE', skill: INITIAL_SKILLS[5] },
      { id: 'ss-28', userId: 'cmuzaljwi002eg71jq75b39rl', skillId: 'sk-4', proficiency: 'INTERMEDIATE', skill: INITIAL_SKILLS[3] },
    ],
  },
  {
    id: 'cmuzaljyc002og71j0zd49vn5',
    name: 'Vikram Menon',
    email: 'vikram@example.com',
    role: 'STUDENT',
    isActive: true,
    profile: {
      id: 'prof-vikram',
      userId: 'cmuzaljyc002og71j0zd49vn5',
      bio: 'Cybersecurity researcher and backend engineer. Proficient in C++, network security, and secure coding practices.',
      interests: 'Cybersecurity, Backend, C++, Cloud Security',
      availability: '10-15 hrs/week',
      experience: '2 years',
      department: 'Cybersecurity',
      year: 'Final Year',
      githubUsername: 'vikram-sec',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    },
    studentSkills: [
      { id: 'ss-29', userId: 'cmuzaljyc002og71j0zd49vn5', skillId: 'sk-25', proficiency: 'EXPERT', skill: INITIAL_SKILLS[24] },
      { id: 'ss-30', userId: 'cmuzaljyc002og71j0zd49vn5', skillId: 'sk-12', proficiency: 'ADVANCED', skill: INITIAL_SKILLS[11] },
      { id: 'ss-31', userId: 'cmuzaljyc002og71j0zd49vn5', skillId: 'sk-10', proficiency: 'ADVANCED', skill: INITIAL_SKILLS[9] },
      { id: 'ss-32', userId: 'cmuzaljyc002og71j0zd49vn5', skillId: 'sk-26', proficiency: 'INTERMEDIATE', skill: INITIAL_SKILLS[25] },
    ],
  },
  {
    id: 'cmuzaljzy002yg71jhosaat6m',
    name: 'Neha Gupta',
    email: 'neha@example.com',
    role: 'STUDENT',
    isActive: true,
    profile: {
      id: 'prof-neha',
      userId: 'cmuzaljzy002yg71jhosaat6m',
      bio: 'React and TypeScript lover. Enjoys building clean user interfaces and connecting microservices.',
      interests: 'Frontend, Web Development, Cloud Computing',
      availability: '15-20 hrs/week',
      experience: '2+ years',
      department: 'Computer Science & Engineering',
      year: '3rd Year',
      githubUsername: 'neha-gupta-dev',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    },
    studentSkills: [
      { id: 'ss-33', userId: 'cmuzaljzy002yg71jhosaat6m', skillId: 'sk-1', proficiency: 'ADVANCED', skill: INITIAL_SKILLS[0] },
      { id: 'ss-34', userId: 'cmuzaljzy002yg71jhosaat6m', skillId: 'sk-3', proficiency: 'ADVANCED', skill: INITIAL_SKILLS[2] },
      { id: 'ss-35', userId: 'cmuzaljzy002yg71jhosaat6m', skillId: 'sk-5', proficiency: 'ADVANCED', skill: INITIAL_SKILLS[4] },
      { id: 'ss-36', userId: 'cmuzaljzy002yg71jhosaat6m', skillId: 'sk-8', proficiency: 'INTERMEDIATE', skill: INITIAL_SKILLS[7] },
    ],
  },
  {
    id: 'cmuzalk1l0038g71j560qhts8',
    name: 'Arjun Das',
    email: 'arjun@example.com',
    role: 'STUDENT',
    isActive: true,
    profile: {
      id: 'prof-arjun',
      userId: 'cmuzalk1l0038g71j560qhts8',
      bio: 'Java Spring Boot and database architect. Specializes in scalable enterprise architectures and caching strategies.',
      interests: 'Backend, Java, Database Architecture, Placement Prep',
      availability: '10-15 hrs/week',
      experience: '2 years',
      department: 'Information Science',
      year: 'Final Year',
      githubUsername: 'arjun-das-backend',
      avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    },
    studentSkills: [
      { id: 'ss-37', userId: 'cmuzalk1l0038g71j560qhts8', skillId: 'sk-11', proficiency: 'EXPERT', skill: INITIAL_SKILLS[10] },
      { id: 'ss-38', userId: 'cmuzalk1l0038g71j560qhts8', skillId: 'sk-13', proficiency: 'ADVANCED', skill: INITIAL_SKILLS[12] },
      { id: 'ss-39', userId: 'cmuzalk1l0038g71j560qhts8', skillId: 'sk-15', proficiency: 'INTERMEDIATE', skill: INITIAL_SKILLS[14] },
      { id: 'ss-40', userId: 'cmuzalk1l0038g71j560qhts8', skillId: 'sk-12', proficiency: 'ADVANCED', skill: INITIAL_SKILLS[11] },
    ],
  },
  {
    id: 'cmuzalk2t003gg71j5nkjntqw',
    name: 'Divya Nambiar',
    email: 'divya@example.com',
    role: 'STUDENT',
    isActive: true,
    profile: {
      id: 'prof-divya',
      userId: 'cmuzalk2t003gg71j5nkjntqw',
      bio: 'Data analyst and Python specialist. Experienced in statistical modeling, pandas, and data visualization dashboards.',
      interests: 'Data Science, Python, AI/ML, Analytics',
      availability: '15-20 hrs/week',
      experience: 'Intermediate',
      department: 'Data Science & AI',
      year: '3rd Year',
      githubUsername: 'divya-data',
      avatarUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80',
    },
    studentSkills: [
      { id: 'ss-41', userId: 'cmuzalk2t003gg71j5nkjntqw', skillId: 'sk-10', proficiency: 'ADVANCED', skill: INITIAL_SKILLS[9] },
      { id: 'ss-42', userId: 'cmuzalk2t003gg71j5nkjntqw', skillId: 'sk-17', proficiency: 'ADVANCED', skill: INITIAL_SKILLS[16] },
      { id: 'ss-43', userId: 'cmuzalk2t003gg71j5nkjntqw', skillId: 'sk-16', proficiency: 'INTERMEDIATE', skill: INITIAL_SKILLS[15] },
    ],
  },
  {
    id: 'cmuzalk48003og71jz28iwen4',
    name: 'Manoj Reddy',
    email: 'manoj@example.com',
    role: 'STUDENT',
    isActive: true,
    profile: {
      id: 'prof-manoj',
      userId: 'cmuzalk48003og71jz28iwen4',
      bio: 'DevOps enthusiast and cloud builder. Skilled in Docker containerization, CI/CD pipelines, and AWS setup.',
      interests: 'DevOps, Cloud Computing, Backend, Hackathons',
      availability: '10-15 hrs/week',
      experience: '2 years',
      department: 'Computer Science & Engineering',
      year: 'Final Year',
      githubUsername: 'manoj-reddy-ops',
      avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    },
    studentSkills: [
      { id: 'ss-44', userId: 'cmuzalk48003og71jz28iwen4', skillId: 'sk-19', proficiency: 'EXPERT', skill: INITIAL_SKILLS[18] },
      { id: 'ss-45', userId: 'cmuzalk48003og71jz28iwen4', skillId: 'sk-20', proficiency: 'EXPERT', skill: INITIAL_SKILLS[19] },
      { id: 'ss-46', userId: 'cmuzalk48003og71jz28iwen4', skillId: 'sk-26', proficiency: 'ADVANCED', skill: INITIAL_SKILLS[25] },
      { id: 'ss-47', userId: 'cmuzalk48003og71jz28iwen4', skillId: 'sk-21', proficiency: 'ADVANCED', skill: INITIAL_SKILLS[20] },
    ],
  },
  {
    id: 'cmuzalk5s003yg71jr0u9r7ak',
    name: 'Pooja Hegde',
    email: 'pooja@example.com',
    role: 'STUDENT',
    isActive: true,
    profile: {
      id: 'prof-pooja',
      userId: 'cmuzalk5s003yg71jr0u9r7ak',
      bio: 'Product designer and frontend developer. Experienced in user research, wireframing, and React.',
      interests: 'UI/UX, Frontend, Web Development',
      availability: '10-15 hrs/week',
      experience: '1-2 years',
      department: 'Information Science',
      year: '3rd Year',
      githubUsername: 'pooja-ux',
      avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    },
    studentSkills: [
      { id: 'ss-48', userId: 'cmuzalk5s003yg71jr0u9r7ak', skillId: 'sk-6', proficiency: 'ADVANCED', skill: INITIAL_SKILLS[5] },
      { id: 'ss-49', userId: 'cmuzalk5s003yg71jr0u9r7ak', skillId: 'sk-7', proficiency: 'ADVANCED', skill: INITIAL_SKILLS[6] },
      { id: 'ss-50', userId: 'cmuzalk5s003yg71jr0u9r7ak', skillId: 'sk-1', proficiency: 'INTERMEDIATE', skill: INITIAL_SKILLS[0] },
      { id: 'ss-51', userId: 'cmuzalk5s003yg71jr0u9r7ak', skillId: 'sk-4', proficiency: 'INTERMEDIATE', skill: INITIAL_SKILLS[3] },
    ],
  },
  {
    id: 'cmuzalk7c0048g71jlmq0cswq',
    name: 'Siddharth Joshi',
    email: 'siddharth@example.com',
    role: 'STUDENT',
    isActive: true,
    profile: {
      id: 'prof-sid',
      userId: 'cmuzalk7c0048g71jlmq0cswq',
      bio: 'Full-stack explorer with hands-on projects in Node.js, Next.js, and MongoDB.',
      interests: 'Web Development, Backend, Cloud Computing',
      availability: '15-20 hrs/week',
      experience: '2 years',
      department: 'Computer Science & Engineering',
      year: '3rd Year',
      githubUsername: 'sid-joshi',
      avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
    },
    studentSkills: [
      { id: 'ss-52', userId: 'cmuzalk7c0048g71jlmq0cswq', skillId: 'sk-8', proficiency: 'ADVANCED', skill: INITIAL_SKILLS[7] },
      { id: 'ss-53', userId: 'cmuzalk7c0048g71jlmq0cswq', skillId: 'sk-2', proficiency: 'INTERMEDIATE', skill: INITIAL_SKILLS[1] },
      { id: 'ss-54', userId: 'cmuzalk7c0048g71jlmq0cswq', skillId: 'sk-14', proficiency: 'ADVANCED', skill: INITIAL_SKILLS[13] },
      { id: 'ss-55', userId: 'cmuzalk7c0048g71jlmq0cswq', skillId: 'sk-21', proficiency: 'INTERMEDIATE', skill: INITIAL_SKILLS[20] },
    ],
  },
  {
    id: 'cmuzalk90004ig71jtuk0om97',
    name: 'Tanvi Nair',
    email: 'tanvi@example.com',
    role: 'STUDENT',
    isActive: true,
    profile: {
      id: 'prof-tanvi',
      userId: 'cmuzalk90004ig71jtuk0om97',
      bio: 'NLP and AI enthusiast. Working with transformers, PyTorch, and conversational agents.',
      interests: 'AI/ML, Python, Machine Learning',
      availability: '15-20 hrs/week',
      experience: 'Advanced',
      department: 'Artificial Intelligence',
      year: 'Final Year',
      githubUsername: 'tanvi-nlp',
      avatarUrl: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80',
    },
    studentSkills: [
      { id: 'ss-56', userId: 'cmuzalk90004ig71jtuk0om97', skillId: 'sk-16', proficiency: 'ADVANCED', skill: INITIAL_SKILLS[15] },
      { id: 'ss-57', userId: 'cmuzalk90004ig71jtuk0om97', skillId: 'sk-10', proficiency: 'EXPERT', skill: INITIAL_SKILLS[9] },
      { id: 'ss-58', userId: 'cmuzalk90004ig71jtuk0om97', skillId: 'sk-18', proficiency: 'INTERMEDIATE', skill: INITIAL_SKILLS[17] },
    ],
  },
  {
    id: 'cmuzalka8004qg71jb6lavm6x',
    name: 'Aditya Sen',
    email: 'aditya@example.com',
    role: 'STUDENT',
    isActive: true,
    profile: {
      id: 'prof-aditya',
      userId: 'cmuzalka8004qg71jb6lavm6x',
      bio: 'Frontend developer and competitive programmer with strong C++ and React skills.',
      interests: 'Web Development, Frontend, Algorithms',
      availability: '5-10 hrs/week',
      experience: '1 year',
      department: 'Computer Science & Engineering',
      year: '2nd Year',
      githubUsername: 'aditya-sen',
      avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    },
    studentSkills: [
      { id: 'ss-59', userId: 'cmuzalka8004qg71jb6lavm6x', skillId: 'sk-1', proficiency: 'INTERMEDIATE', skill: INITIAL_SKILLS[0] },
      { id: 'ss-60', userId: 'cmuzalka8004qg71jb6lavm6x', skillId: 'sk-12', proficiency: 'ADVANCED', skill: INITIAL_SKILLS[11] },
      { id: 'ss-61', userId: 'cmuzalka8004qg71jb6lavm6x', skillId: 'sk-4', proficiency: 'INTERMEDIATE', skill: INITIAL_SKILLS[3] },
    ],
  },
];

export const INITIAL_PROJECTS: DemoProject[] = [
  {
    id: 'cmuzalkbk004zg71j1q7t01fb',
    ownerId: 'cmuzaljn5000sg71jndldlm8k',
    title: 'Smart Campus Navigation',
    description: 'A web application that helps students, visitors, and faculty navigate campus facilities, find available study rooms, locate lecture halls, and explore point-of-interest indoor routes.',
    category: 'Web Development',
    status: 'OPEN',
    preferredTeamSize: 5,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    owner: {
      id: INITIAL_USERS[1].id,
      name: INITIAL_USERS[1].name,
      email: INITIAL_USERS[1].email,
      profile: INITIAL_USERS[1].profile,
    },
    projectSkills: [
      { id: 'ps-1', projectId: 'cmuzalkbk004zg71j1q7t01fb', skillId: 'sk-1', requiredLevel: 'ADVANCED', skill: INITIAL_SKILLS[0] },
      { id: 'ps-2', projectId: 'cmuzalkbk004zg71j1q7t01fb', skillId: 'sk-8', requiredLevel: 'ADVANCED', skill: INITIAL_SKILLS[7] },
      { id: 'ps-3', projectId: 'cmuzalkbk004zg71j1q7t01fb', skillId: 'sk-13', requiredLevel: 'ADVANCED', skill: INITIAL_SKILLS[12] },
      { id: 'ps-4', projectId: 'cmuzalkbk004zg71j1q7t01fb', skillId: 'sk-6', requiredLevel: 'ADVANCED', skill: INITIAL_SKILLS[5] },
    ],
    team: {
      id: 'team-1',
      projectId: 'cmuzalkbk004zg71j1q7t01fb',
      status: 'ACTIVE',
      members: [
        {
          id: 'tm-1',
          teamId: 'team-1',
          userId: 'cmuzaljn5000sg71jndldlm8k',
          role: 'OWNER',
          joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
          user: INITIAL_USERS[1],
        },
        {
          id: 'tm-2',
          teamId: 'team-1',
          userId: 'cmuzaljrp001kg71jpedtapq8',
          role: 'MEMBER',
          joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
          user: INITIAL_USERS[3], // Ananya Verma
        },
        {
          id: 'tm-3',
          teamId: 'team-1',
          userId: 'cmuzaljtb001ug71jdc2rjukz',
          role: 'MEMBER',
          joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
          user: INITIAL_USERS[4], // Rohan Patel
        },
      ],
    },
    tasks: [
      {
        id: 'task-1',
        projectId: 'cmuzalkbk004zg71j1q7t01fb',
        assigneeId: 'cmuzaljtb001ug71jdc2rjukz',
        title: 'Design Database Schema for Campus Coordinates',
        description: 'Define relational entities for campus buildings, floors, rooms, and vector navigation nodes in PostgreSQL with Prisma schema.',
        status: 'COMPLETED',
        priority: 'HIGH',
        dueDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(),
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
        assignee: INITIAL_USERS[4],
      },
      {
        id: 'task-2',
        projectId: 'cmuzalkbk004zg71j1q7t01fb',
        assigneeId: 'cmuzaljrp001kg71jpedtapq8',
        title: 'Create High-Fidelity UI Wireframes in Figma',
        description: 'Craft interactive wireframes for campus map exploration, search drawer, and indoor floor selector according to accessibility standards.',
        status: 'COMPLETED',
        priority: 'MEDIUM',
        dueDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
        assignee: INITIAL_USERS[3],
      },
      {
        id: 'task-3',
        projectId: 'cmuzalkbk004zg71j1q7t01fb',
        assigneeId: 'cmuzaljn5000sg71jndldlm8k',
        title: 'Implement Interactive Vector Map & Pathfinding Algorithm',
        description: 'Develop Dijkstra/A* pathfinding engine over campus node network and render step-by-step route directions in React.',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString(),
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        assignee: INITIAL_USERS[1],
      },
      {
        id: 'task-4',
        projectId: 'cmuzalkbk004zg71j1q7t01fb',
        assigneeId: 'cmuzaljtb001ug71jdc2rjukz',
        title: 'Build REST APIs for Room Availability & Scheduling',
        description: 'Create backend endpoints for checking live room occupancy and booking seminar halls with role-based auth.',
        status: 'IN_PROGRESS',
        priority: 'MEDIUM',
        dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5).toISOString(),
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(),
        assignee: INITIAL_USERS[4],
      },
      {
        id: 'task-5',
        projectId: 'cmuzalkbk004zg71j1q7t01fb',
        assigneeId: 'cmuzaljrp001kg71jpedtapq8',
        title: 'Implement Dark Mode and Responsive Mobile Drawer',
        description: 'Ensure map controls and navigation cards adapt seamlessly to mobile viewports (375px) with accessible dark mode toggle.',
        status: 'TODO',
        priority: 'LOW',
        dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
        assignee: INITIAL_USERS[3],
      },
      {
        id: 'task-6',
        projectId: 'cmuzalkbk004zg71j1q7t01fb',
        assigneeId: null,
        title: 'Conduct End-to-End Latency and Load Testing',
        description: 'Benchmark route calculation response time under simulated 500 concurrent student users.',
        status: 'TODO',
        priority: 'MEDIUM',
        dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10).toISOString(),
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
        assignee: null,
      },
    ],
    repository: {
      id: 'repo-1',
      projectId: 'cmuzalkbk004zg71j1q7t01fb',
      githubUrl: 'https://github.com/karthik-rao-dev/smart-campus-navigation',
      owner: 'karthik-rao-dev',
      name: 'smart-campus-navigation',
      description: 'Autonomous indoor and outdoor campus navigation web system built with Next.js, Node.js, and PostgreSQL.',
      stars: 24,
      forks: 8,
      language: 'TypeScript',
      lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
      commits: [
        { sha: '7f9a12c', message: 'feat: add A* pathfinding algorithm for room navigation', author: 'Karthik Rao', date: '3 hours ago' },
        { sha: '4b3d89e', message: 'style: finalize responsive campus map viewport layout', author: 'Ananya Verma', date: '1 day ago' },
        { sha: '1e6f54a', message: 'chore: configure Prisma migrations for floor nodes', author: 'Rohan Patel', date: '2 days ago' },
      ],
    },
  },
  {
    id: 'cmuzalkd70059g71j0rn4uc6m',
    ownerId: 'cmuzaljuy0024g71jwkk08uxf',
    title: 'AI Study Planner & Exam Predictor',
    description: 'An AI-powered academic assistant that analyses previous year exam questions, syllabus difficulty, and student schedules to generate adaptive revision plans and score predictions.',
    category: 'AI/ML',
    status: 'IN_PROGRESS',
    preferredTeamSize: 4,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    owner: {
      id: INITIAL_USERS[5].id,
      name: INITIAL_USERS[5].name,
      email: INITIAL_USERS[5].email,
      profile: INITIAL_USERS[5].profile,
    },
    projectSkills: [
      { id: 'ps-5', projectId: 'cmuzalkd70059g71j0rn4uc6m', skillId: 'sk-10', requiredLevel: 'EXPERT', skill: INITIAL_SKILLS[9] },
      { id: 'ps-6', projectId: 'cmuzalkd70059g71j0rn4uc6m', skillId: 'sk-16', requiredLevel: 'ADVANCED', skill: INITIAL_SKILLS[15] },
      { id: 'ps-7', projectId: 'cmuzalkd70059g71j0rn4uc6m', skillId: 'sk-1', requiredLevel: 'INTERMEDIATE', skill: INITIAL_SKILLS[0] },
      { id: 'ps-8', projectId: 'cmuzalkd70059g71j0rn4uc6m', skillId: 'sk-17', requiredLevel: 'ADVANCED', skill: INITIAL_SKILLS[16] },
    ],
    team: {
      id: 'team-2',
      projectId: 'cmuzalkd70059g71j0rn4uc6m',
      status: 'ACTIVE',
      members: [
        { id: 'tm-4', teamId: 'team-2', userId: 'cmuzaljuy0024g71jwkk08uxf', role: 'OWNER', joinedAt: new Date().toISOString(), user: INITIAL_USERS[5] },
        { id: 'tm-5', teamId: 'team-2', userId: 'cmuzalk90004ig71jtuk0om97', role: 'MEMBER', joinedAt: new Date().toISOString(), user: INITIAL_USERS[14] },
        { id: 'tm-6', teamId: 'team-2', userId: 'cmuzalk2t003gg71j5nkjntqw', role: 'MEMBER', joinedAt: new Date().toISOString(), user: INITIAL_USERS[10] },
      ],
    },
    tasks: [
      {
        id: 'task-7',
        projectId: 'cmuzalkd70059g71j0rn4uc6m',
        assigneeId: 'cmuzaljuy0024g71jwkk08uxf',
        title: 'Train Syllabus Parsing NLP Pipeline',
        description: 'Extract exam chapters and time weights from PDF syllabi using PyTorch text classification.',
        status: 'COMPLETED',
        priority: 'HIGH',
        dueDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        assignee: INITIAL_USERS[5],
      },
      {
        id: 'task-8',
        projectId: 'cmuzalkd70059g71j0rn4uc6m',
        assigneeId: 'cmuzalk90004ig71jtuk0om97',
        title: 'Build Daily Revision Schedule Generator',
        description: 'Implement spaced repetition algorithm (SM-2) for flashcards and topic mastery tracking.',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 4).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        assignee: INITIAL_USERS[14],
      },
      {
        id: 'task-9',
        projectId: 'cmuzalkd70059g71j0rn4uc6m',
        assigneeId: 'cmuzalk2t003gg71j5nkjntqw',
        title: 'Design Analytics Dashboard for Study Streaks',
        description: 'Create visual charts showing weekly study hours vs exam readiness percentage.',
        status: 'TODO',
        priority: 'MEDIUM',
        dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 8).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        assignee: INITIAL_USERS[10],
      },
    ],
    repository: {
      id: 'repo-2',
      projectId: 'cmuzalkd70059g71j0rn4uc6m',
      githubUrl: 'https://github.com/priyaiyer-ml/ai-study-planner',
      owner: 'priyaiyer-ml',
      name: 'ai-study-planner',
      description: 'Machine learning powered study schedule optimizer and spaced-repetition exam planner.',
      stars: 42,
      forks: 14,
      language: 'Python',
      lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    },
  },
  {
    id: 'cmuzalkeu005jg71j9rhtanfe',
    ownerId: 'cmuzaljpv0018g71j3tfiwymm',
    title: 'College Event Management System',
    description: 'A comprehensive web portal for organizing cultural fests, technical hackathons, and guest lectures with ticket booking, QR-code check-in, and committee budgeting.',
    category: 'Web Development',
    status: 'OPEN',
    preferredTeamSize: 4,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    owner: {
      id: INITIAL_USERS[2].id,
      name: INITIAL_USERS[2].name,
      email: INITIAL_USERS[2].email,
      profile: INITIAL_USERS[2].profile,
    },
    projectSkills: [
      { id: 'ps-9', projectId: 'cmuzalkeu005jg71j9rhtanfe', skillId: 'sk-1', requiredLevel: 'ADVANCED', skill: INITIAL_SKILLS[0] },
      { id: 'ps-10', projectId: 'cmuzalkeu005jg71j9rhtanfe', skillId: 'sk-8', requiredLevel: 'ADVANCED', skill: INITIAL_SKILLS[7] },
      { id: 'ps-11', projectId: 'cmuzalkeu005jg71j9rhtanfe', skillId: 'sk-14', requiredLevel: 'INTERMEDIATE', skill: INITIAL_SKILLS[13] },
    ],
    team: {
      id: 'team-3',
      projectId: 'cmuzalkeu005jg71j9rhtanfe',
      status: 'FORMING',
      members: [
        { id: 'tm-7', teamId: 'team-3', userId: 'cmuzaljpv0018g71j3tfiwymm', role: 'OWNER', joinedAt: new Date().toISOString(), user: INITIAL_USERS[2] },
        { id: 'tm-8', teamId: 'team-3', userId: 'cmuzaljzy002yg71jhosaat6m', role: 'MEMBER', joinedAt: new Date().toISOString(), user: INITIAL_USERS[8] },
      ],
    },
    tasks: [],
  },
  {
    id: 'cmuzalkgf005tg71johl740jr',
    ownerId: 'cmuzaljrp001kg71jpedtapq8',
    title: 'Campus Peer Marketplace',
    description: 'A verified peer-to-peer marketplace for engineering students to buy, sell, or rent textbooks, lab equipment, development kits, and calculator accessories securely.',
    category: 'Web Development',
    status: 'OPEN',
    preferredTeamSize: 3,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 14).toISOString(),
    owner: {
      id: INITIAL_USERS[3].id,
      name: INITIAL_USERS[3].name,
      email: INITIAL_USERS[3].email,
      profile: INITIAL_USERS[3].profile,
    },
    projectSkills: [
      { id: 'ps-12', projectId: 'cmuzalkgf005tg71johl740jr', skillId: 'sk-6', requiredLevel: 'EXPERT', skill: INITIAL_SKILLS[5] },
      { id: 'ps-13', projectId: 'cmuzalkgf005tg71johl740jr', skillId: 'sk-1', requiredLevel: 'ADVANCED', skill: INITIAL_SKILLS[0] },
      { id: 'ps-14', projectId: 'cmuzalkgf005tg71johl740jr', skillId: 'sk-13', requiredLevel: 'INTERMEDIATE', skill: INITIAL_SKILLS[12] },
    ],
    team: {
      id: 'team-4',
      projectId: 'cmuzalkgf005tg71johl740jr',
      status: 'FORMING',
      members: [
        { id: 'tm-9', teamId: 'team-4', userId: 'cmuzaljrp001kg71jpedtapq8', role: 'OWNER', joinedAt: new Date().toISOString(), user: INITIAL_USERS[3] },
        { id: 'tm-10', teamId: 'team-4', userId: 'cmuzalk5s003yg71jr0u9r7ak', role: 'MEMBER', joinedAt: new Date().toISOString(), user: INITIAL_USERS[12] },
      ],
    },
    tasks: [],
  },
  {
    id: 'cmuzalkkk0063g71j0dodo5jl',
    ownerId: 'cmuzaljwi002eg71jq75b39rl',
    title: 'Student Expense & Budget Tracker',
    description: 'A mobile application enabling college hostelers to track daily canteen, mess, and travel expenses with automated bill splitting and monthly allowance warnings.',
    category: 'Mobile App',
    status: 'OPEN',
    preferredTeamSize: 3,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
    owner: {
      id: INITIAL_USERS[6].id,
      name: INITIAL_USERS[6].name,
      email: INITIAL_USERS[6].email,
      profile: INITIAL_USERS[6].profile,
    },
    projectSkills: [
      { id: 'ps-15', projectId: 'cmuzalkkk0063g71j0dodo5jl', skillId: 'sk-23', requiredLevel: 'ADVANCED', skill: INITIAL_SKILLS[22] },
      { id: 'ps-16', projectId: 'cmuzalkkk0063g71j0dodo5jl', skillId: 'sk-8', requiredLevel: 'INTERMEDIATE', skill: INITIAL_SKILLS[7] },
      { id: 'ps-17', projectId: 'cmuzalkkk0063g71j0dodo5jl', skillId: 'sk-6', requiredLevel: 'INTERMEDIATE', skill: INITIAL_SKILLS[5] },
    ],
    team: {
      id: 'team-5',
      projectId: 'cmuzalkkk0063g71j0dodo5jl',
      status: 'ACTIVE',
      members: [
        { id: 'tm-11', teamId: 'team-5', userId: 'cmuzaljwi002eg71jq75b39rl', role: 'OWNER', joinedAt: new Date().toISOString(), user: INITIAL_USERS[6] },
      ],
    },
    tasks: [],
  },
  {
    id: 'cmuzalkm7006dg71jhzr3y0tu',
    ownerId: 'cmuzalk48003og71jz28iwen4',
    title: 'Hackathon Team Formation Hub',
    description: 'An algorithm-driven matching engine tailored for national hackathons, balancing full-stack coders, pitch presenters, and hardware specialists.',
    category: 'Web Development',
    status: 'OPEN',
    preferredTeamSize: 4,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString(),
    owner: {
      id: INITIAL_USERS[11].id,
      name: INITIAL_USERS[11].name,
      email: INITIAL_USERS[11].email,
      profile: INITIAL_USERS[11].profile,
    },
    projectSkills: [
      { id: 'ps-18', projectId: 'cmuzalkm7006dg71jhzr3y0tu', skillId: 'sk-1', requiredLevel: 'ADVANCED', skill: INITIAL_SKILLS[0] },
      { id: 'ps-19', projectId: 'cmuzalkm7006dg71jhzr3y0tu', skillId: 'sk-8', requiredLevel: 'ADVANCED', skill: INITIAL_SKILLS[7] },
      { id: 'ps-20', projectId: 'cmuzalkm7006dg71jhzr3y0tu', skillId: 'sk-20', requiredLevel: 'ADVANCED', skill: INITIAL_SKILLS[19] },
    ],
    team: {
      id: 'team-6',
      projectId: 'cmuzalkm7006dg71jhzr3y0tu',
      status: 'FORMING',
      members: [
        { id: 'tm-12', teamId: 'team-6', userId: 'cmuzalk48003og71jz28iwen4', role: 'OWNER', joinedAt: new Date().toISOString(), user: INITIAL_USERS[11] },
      ],
    },
    tasks: [],
  },
  {
    id: 'cmuzalkon006ng71jgknz9l0i',
    ownerId: 'cmuzaljyc002og71j0zd49vn5',
    title: 'Open Source Contribution Hub',
    description: 'A platform curated for B.Tech students to find first-time issues (good first issue) across open source projects, track PR status, and receive peer code reviews.',
    category: 'Tools',
    status: 'IN_PROGRESS',
    preferredTeamSize: 4,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
    owner: {
      id: INITIAL_USERS[7].id,
      name: INITIAL_USERS[7].name,
      email: INITIAL_USERS[7].email,
      profile: INITIAL_USERS[7].profile,
    },
    projectSkills: [
      { id: 'ps-21', projectId: 'cmuzalkon006ng71jgknz9l0i', skillId: 'sk-21', requiredLevel: 'EXPERT', skill: INITIAL_SKILLS[20] },
      { id: 'ps-22', projectId: 'cmuzalkon006ng71jgknz9l0i', skillId: 'sk-1', requiredLevel: 'ADVANCED', skill: INITIAL_SKILLS[0] },
      { id: 'ps-23', projectId: 'cmuzalkon006ng71jgknz9l0i', skillId: 'sk-10', requiredLevel: 'ADVANCED', skill: INITIAL_SKILLS[9] },
    ],
    team: {
      id: 'team-7',
      projectId: 'cmuzalkon006ng71jgknz9l0i',
      status: 'ACTIVE',
      members: [
        { id: 'tm-13', teamId: 'team-7', userId: 'cmuzaljyc002og71j0zd49vn5', role: 'OWNER', joinedAt: new Date().toISOString(), user: INITIAL_USERS[7] },
        { id: 'tm-14', teamId: 'team-7', userId: 'cmuzalk48003og71jz28iwen4', role: 'MEMBER', joinedAt: new Date().toISOString(), user: INITIAL_USERS[11] },
      ],
    },
    tasks: [],
  },
  {
    id: 'cmuzalkr1006xg71jk56ttxd3',
    ownerId: 'cmuzalk1l0038g71j560qhts8',
    title: 'Placement Preparation & Mock Interview Hub',
    description: 'An interactive DSA prep portal with company-specific coding tracks, peer mock interview scheduler, and resume feedback exchange for final year placements.',
    category: 'Web Development',
    status: 'OPEN',
    preferredTeamSize: 4,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 16).toISOString(),
    owner: {
      id: INITIAL_USERS[9].id,
      name: INITIAL_USERS[9].name,
      email: INITIAL_USERS[9].email,
      profile: INITIAL_USERS[9].profile,
    },
    projectSkills: [
      { id: 'ps-24', projectId: 'cmuzalkr1006xg71jk56ttxd3', skillId: 'sk-1', requiredLevel: 'ADVANCED', skill: INITIAL_SKILLS[0] },
      { id: 'ps-25', projectId: 'cmuzalkr1006xg71jk56ttxd3', skillId: 'sk-11', requiredLevel: 'ADVANCED', skill: INITIAL_SKILLS[10] },
      { id: 'ps-26', projectId: 'cmuzalkr1006xg71jk56ttxd3', skillId: 'sk-13', requiredLevel: 'ADVANCED', skill: INITIAL_SKILLS[12] },
    ],
    team: {
      id: 'team-8',
      projectId: 'cmuzalkr1006xg71jk56ttxd3',
      status: 'FORMING',
      members: [
        { id: 'tm-15', teamId: 'team-8', userId: 'cmuzalk1l0038g71j560qhts8', role: 'OWNER', joinedAt: new Date().toISOString(), user: INITIAL_USERS[9] },
      ],
    },
    tasks: [],
  },
];

export const INITIAL_COLLABORATION_REQUESTS: DemoCollaborationRequest[] = [
  {
    id: 'req-1',
    senderId: 'cmuzaljzy002yg71jhosaat6m', // Neha Gupta
    receiverId: 'cmuzaljn5000sg71jndldlm8k', // Karthik Rao
    projectId: 'cmuzalkbk004zg71j1q7t01fb', // Smart Campus Navigation
    message: 'Hi Karthik, I saw Smart Campus Navigation! My React and TypeScript experience would be a great fit for building the front-end indoor map viewer.',
    status: 'PENDING',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
    sender: INITIAL_USERS[8],
    receiver: INITIAL_USERS[1],
    project: {
      id: INITIAL_PROJECTS[0].id,
      title: INITIAL_PROJECTS[0].title,
      category: INITIAL_PROJECTS[0].category,
      ownerId: INITIAL_PROJECTS[0].ownerId,
    },
  },
  {
    id: 'req-2',
    senderId: 'cmuzaljpv0018g71j3tfiwymm', // Rahul Sharma
    receiverId: 'cmuzaljn5000sg71jndldlm8k', // Karthik Rao
    projectId: 'cmuzalkbk004zg71j1q7t01fb',
    message: 'Hi Karthik, your React and Node.js stack matches my skill set. I would love to collaborate on the API layer!',
    status: 'PENDING',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    sender: INITIAL_USERS[2],
    receiver: INITIAL_USERS[1],
    project: {
      id: INITIAL_PROJECTS[0].id,
      title: INITIAL_PROJECTS[0].title,
      category: INITIAL_PROJECTS[0].category,
      ownerId: INITIAL_PROJECTS[0].ownerId,
    },
  },
  {
    id: 'req-3',
    senderId: 'cmuzaljn5000sg71jndldlm8k', // Karthik Rao
    receiverId: 'cmuzaljuy0024g71jwkk08uxf', // Priya Iyer
    projectId: 'cmuzalkd70059g71j0rn4uc6m', // AI Study Planner
    message: 'Hi Priya, I can contribute Next.js frontend and dashboard UI components to your AI study planner project.',
    status: 'PENDING',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
    sender: INITIAL_USERS[1],
    receiver: INITIAL_USERS[5],
    project: {
      id: INITIAL_PROJECTS[1].id,
      title: INITIAL_PROJECTS[1].title,
      category: INITIAL_PROJECTS[1].category,
      ownerId: INITIAL_PROJECTS[1].ownerId,
    },
  },
  {
    id: 'req-4',
    senderId: 'cmuzaljrp001kg71jpedtapq8', // Ananya Verma
    receiverId: 'cmuzaljn5000sg71jndldlm8k', // Karthik Rao
    projectId: 'cmuzalkbk004zg71j1q7t01fb',
    message: 'Excited to contribute UI/UX designs and React components!',
    status: 'ACCEPTED',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    sender: INITIAL_USERS[3],
    receiver: INITIAL_USERS[1],
    project: {
      id: INITIAL_PROJECTS[0].id,
      title: INITIAL_PROJECTS[0].title,
      category: INITIAL_PROJECTS[0].category,
      ownerId: INITIAL_PROJECTS[0].ownerId,
    },
  },
];

export const INITIAL_NOTIFICATIONS: DemoNotification[] = [
  {
    id: 'notif-1',
    userId: 'cmuzaljn5000sg71jndldlm8k',
    type: 'COLLABORATION_REQUEST',
    message: 'You received a collaboration request from Neha Gupta for Smart Campus Navigation.',
    link: '/collaboration-requests',
    readStatus: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
  },
  {
    id: 'notif-2',
    userId: 'cmuzaljn5000sg71jndldlm8k',
    type: 'COLLABORATION_REQUEST',
    message: 'You received a collaboration request from Rahul Sharma for Smart Campus Navigation.',
    link: '/collaboration-requests',
    readStatus: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: 'notif-3',
    userId: 'cmuzaljn5000sg71jndldlm8k',
    type: 'TASK_ASSIGNED',
    message: 'You were assigned a new task: "Implement Interactive Vector Map & Pathfinding Algorithm".',
    link: '/projects/cmuzalkbk004zg71j1q7t01fb/tasks',
    readStatus: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
  {
    id: 'notif-4',
    userId: 'cmuzaljn5000sg71jndldlm8k',
    type: 'GITHUB_CONNECTED',
    message: 'GitHub repository karthik-rao-dev/smart-campus-navigation was successfully connected.',
    link: '/projects/cmuzalkbk004zg71j1q7t01fb/github',
    readStatus: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
  },
  {
    id: 'notif-5',
    userId: 'cmuzaljn5000sg71jndldlm8k',
    type: 'REQUEST_ACCEPTED',
    message: 'Ananya Verma accepted your invitation to join Smart Campus Navigation.',
    link: '/projects/cmuzalkbk004zg71j1q7t01fb/team',
    readStatus: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
  },
];

export const INITIAL_REPORTS: DemoReport[] = [
  {
    id: 'rep-1',
    reporterId: 'cmuzaljn5000sg71jndldlm8k',
    projectId: 'cmuzalkkk0063g71j0dodo5jl',
    reason: 'Duplicate project listing with unclear scope description.',
    status: 'PENDING',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
    reporter: {
      id: INITIAL_USERS[1].id,
      name: INITIAL_USERS[1].name,
      email: INITIAL_USERS[1].email,
    },
    project: {
      id: INITIAL_PROJECTS[4].id,
      title: INITIAL_PROJECTS[4].title,
    },
  },
];
