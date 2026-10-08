import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Clearing existing database records...');
  await prisma.report.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.repository.deleteMany({});
  await prisma.task.deleteMany({});
  await prisma.collaborationRequest.deleteMany({});
  await prisma.teamMember.deleteMany({});
  await prisma.team.deleteMany({});
  await prisma.projectSkill.deleteMany({});
  await prisma.project.deleteMany({});
  await prisma.studentSkill.deleteMany({});
  await prisma.skill.deleteMany({});
  await prisma.studentProfile.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('✨ Seeding Skills...');
  const skillsData = [
    { name: 'React', category: 'Frontend' },
    { name: 'Next.js', category: 'Frontend' },
    { name: 'TypeScript', category: 'Frontend' },
    { name: 'JavaScript', category: 'Frontend' },
    { name: 'Tailwind CSS', category: 'Frontend' },
    { name: 'UI/UX', category: 'Design' },
    { name: 'Figma', category: 'Design' },
    { name: 'Node.js', category: 'Backend' },
    { name: 'Express.js', category: 'Backend' },
    { name: 'Python', category: 'Backend' },
    { name: 'Java', category: 'Backend' },
    { name: 'C++', category: 'Backend' },
    { name: 'PostgreSQL', category: 'Database' },
    { name: 'MongoDB', category: 'Database' },
    { name: 'Redis', category: 'Database' },
    { name: 'Machine Learning', category: 'AI/ML' },
    { name: 'Data Science', category: 'AI/ML' },
    { name: 'PyTorch', category: 'AI/ML' },
    { name: 'DevOps', category: 'DevOps' },
    { name: 'Docker', category: 'DevOps' },
    { name: 'Git', category: 'Tools' },
    { name: 'GitHub', category: 'Tools' },
    { name: 'Flutter', category: 'Mobile' },
    { name: 'Android', category: 'Mobile' },
    { name: 'Cybersecurity', category: 'Security' },
    { name: 'Cloud Computing', category: 'Cloud' },
  ];

  const skillMap: { [name: string]: string } = {};
  for (const s of skillsData) {
    const created = await prisma.skill.create({ data: s });
    skillMap[s.name] = created.id;
  }

  console.log('👤 Seeding Users and Profiles...');
  const defaultPasswordHash = await bcrypt.hash('Student@123', 10);
  const adminPasswordHash = await bcrypt.hash('Admin@123', 10);

  // 1. Admin user
  const adminUser = await prisma.user.create({
    data: {
      name: 'Dr. Ramesh Kumar (Admin)',
      email: 'admin@example.com',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
      profile: {
        create: {
          bio: 'Department Head & Project Coordinator, CSE Department. Overseeing academic capstone and mini projects.',
          department: 'Computer Science & Engineering',
          year: 'Faculty',
          experience: 'Expert',
          availability: 'Full-time',
          avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
          githubUsername: 'ramesh-cse-admin',
        },
      },
    },
  });

  // 2. Primary Demo Student (student@example.com / Karthik Rao)
  const studentUser = await prisma.user.create({
    data: {
      name: 'Karthik Rao',
      email: 'student@example.com',
      passwordHash: defaultPasswordHash,
      role: 'STUDENT',
      profile: {
        create: {
          bio: 'Final year CSE undergraduate passionate about full-stack web development, distributed systems, and real-time mapping applications.',
          interests: 'Web Development, Distributed Systems, Cloud Computing, UI/UX',
          availability: '15-20 hrs/week',
          experience: '2+ years',
          department: 'Computer Science & Engineering',
          year: 'Final Year',
          githubUsername: 'karthik-rao-dev',
          avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        },
      },
    },
  });

  // Associate skills for Karthik
  const studentSkillsList = [
    { skill: 'React', prof: 'ADVANCED' },
    { skill: 'Next.js', prof: 'ADVANCED' },
    { skill: 'Node.js', prof: 'INTERMEDIATE' },
    { skill: 'PostgreSQL', prof: 'ADVANCED' },
    { skill: 'TypeScript', prof: 'ADVANCED' },
    { skill: 'Tailwind CSS', prof: 'EXPERT' },
    { skill: 'Git', prof: 'ADVANCED' },
  ];
  for (const item of studentSkillsList) {
    if (skillMap[item.skill]) {
      await prisma.studentSkill.create({
        data: {
          userId: studentUser.id,
          skillId: skillMap[item.skill],
          proficiency: item.prof,
        },
      });
    }
  }

  // 3. 14 other diverse students with varying skill sets for realistic matching & compatibility
  const otherStudentsData = [
    {
      name: 'Rahul Sharma',
      email: 'rahul@example.com',
      bio: 'Full-stack developer with 2 years building React and Node.js web services. Looking for collaborative capstone projects.',
      interests: 'Web Development, UI/UX, Cloud Computing, Database Architecture',
      availability: '15-20 hrs/week',
      experience: '2+ years',
      department: 'Computer Science & Engineering',
      year: '3rd Year',
      githubUsername: 'rahulsharma-dev',
      avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
      skills: [
        { name: 'React', prof: 'ADVANCED' },
        { name: 'Node.js', prof: 'ADVANCED' },
        { name: 'PostgreSQL', prof: 'INTERMEDIATE' },
        { name: 'UI/UX', prof: 'INTERMEDIATE' },
        { name: 'TypeScript', prof: 'INTERMEDIATE' },
      ],
    },
    {
      name: 'Ananya Verma',
      email: 'ananya@example.com',
      bio: 'UI/UX designer and frontend engineer. Love crafting accessible web apps and interactive Figma prototypes.',
      interests: 'UI/UX, Frontend, Web Development, Design Systems',
      availability: '15-20 hrs/week',
      experience: '2 years',
      department: 'Information Technology',
      year: '3rd Year',
      githubUsername: 'ananya-designs',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      skills: [
        { name: 'UI/UX', prof: 'EXPERT' },
        { name: 'Figma', prof: 'EXPERT' },
        { name: 'React', prof: 'ADVANCED' },
        { name: 'Tailwind CSS', prof: 'ADVANCED' },
      ],
    },
    {
      name: 'Rohan Patel',
      email: 'rohan@example.com',
      bio: 'Backend enthusiast and database optimizer. Experience with PostgreSQL, Redis caching, and Docker containers.',
      interests: 'Backend, Database, DevOps, Web Development',
      availability: '15-20 hrs/week',
      experience: '2+ years',
      department: 'Computer Science & Engineering',
      year: 'Final Year',
      githubUsername: 'rohan-backend',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      skills: [
        { name: 'Node.js', prof: 'EXPERT' },
        { name: 'PostgreSQL', prof: 'EXPERT' },
        { name: 'Docker', prof: 'ADVANCED' },
        { name: 'DevOps', prof: 'INTERMEDIATE' },
      ],
    },
    {
      name: 'Priya Iyer',
      email: 'priya@example.com',
      bio: 'Machine learning practitioner working on Natural Language Processing and computer vision algorithms.',
      interests: 'AI/ML, Data Science, Python, Deep Learning',
      availability: '15-20 hrs/week',
      experience: 'Expert',
      department: 'Data Science & AI',
      year: 'Final Year',
      githubUsername: 'priyaiyer-ml',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      skills: [
        { name: 'Python', prof: 'EXPERT' },
        { name: 'Machine Learning', prof: 'EXPERT' },
        { name: 'Data Science', prof: 'ADVANCED' },
        { name: 'PyTorch', prof: 'ADVANCED' },
      ],
    },
    {
      name: 'Sneha Kulkarni',
      email: 'sneha@example.com',
      bio: 'Mobile application developer creating cross-platform apps with Flutter and native Android.',
      interests: 'Mobile App, Flutter, Android, UI/UX',
      availability: '10-15 hrs/week',
      experience: '1-2 years',
      department: 'Computer Science & Engineering',
      year: '3rd Year',
      githubUsername: 'sneha-flutter',
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      skills: [
        { name: 'Flutter', prof: 'ADVANCED' },
        { name: 'Android', prof: 'INTERMEDIATE' },
        { name: 'UI/UX', prof: 'INTERMEDIATE' },
        { name: 'JavaScript', prof: 'INTERMEDIATE' },
      ],
    },
    {
      name: 'Vikram Menon',
      email: 'vikram@example.com',
      bio: 'Cybersecurity researcher and backend engineer. Proficient in C++, network security, and secure coding practices.',
      interests: 'Cybersecurity, Backend, C++, Cloud Security',
      availability: '10-15 hrs/week',
      experience: '2 years',
      department: 'Cybersecurity',
      year: 'Final Year',
      githubUsername: 'vikram-sec',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      skills: [
        { name: 'Cybersecurity', prof: 'EXPERT' },
        { name: 'C++', prof: 'ADVANCED' },
        { name: 'Python', prof: 'ADVANCED' },
        { name: 'Cloud Computing', prof: 'INTERMEDIATE' },
      ],
    },
    {
      name: 'Neha Gupta',
      email: 'neha@example.com',
      bio: 'React and TypeScript lover. Enjoys building clean user interfaces and connecting microservices.',
      interests: 'Frontend, Web Development, Cloud Computing',
      availability: '15-20 hrs/week',
      experience: '2+ years',
      department: 'Computer Science & Engineering',
      year: '3rd Year',
      githubUsername: 'neha-gupta-dev',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      skills: [
        { name: 'React', prof: 'ADVANCED' },
        { name: 'TypeScript', prof: 'ADVANCED' },
        { name: 'Next.js', prof: 'INTERMEDIATE' },
        { name: 'Node.js', prof: 'INTERMEDIATE' },
      ],
    },
    {
      name: 'Arjun Das',
      email: 'arjun@example.com',
      bio: 'Java enterprise and Spring Boot developer. Strong fundamentals in OOP, SQL, and database indexing.',
      interests: 'Backend, Java, Database, Web Development',
      availability: '15-20 hrs/week',
      experience: '2 years',
      department: 'Information Technology',
      year: 'Final Year',
      githubUsername: 'arjun-java',
      avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
      skills: [
        { name: 'Java', prof: 'EXPERT' },
        { name: 'PostgreSQL', prof: 'ADVANCED' },
        { name: 'MongoDB', prof: 'INTERMEDIATE' },
      ],
    },
    {
      name: 'Divya Nambiar',
      email: 'divya@example.com',
      bio: 'Data Analyst & Python specialist. Love extracting insights, building Dash/Streamlit dashboards and ETL scripts.',
      interests: 'Data Science, Python, AI/ML',
      availability: '10-15 hrs/week',
      experience: '1 year',
      department: 'Data Science',
      year: '2nd Year',
      githubUsername: 'divya-data',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      skills: [
        { name: 'Python', prof: 'ADVANCED' },
        { name: 'Data Science', prof: 'ADVANCED' },
        { name: 'Machine Learning', prof: 'INTERMEDIATE' },
      ],
    },
    {
      name: 'Manoj Reddy',
      email: 'manoj@example.com',
      bio: 'DevOps enthusiast. CI/CD pipelines, Docker, Kubernetes, and Cloud infrastructure automation.',
      interests: 'DevOps, Cloud Computing, Backend',
      availability: '15-20 hrs/week',
      experience: '2 years',
      department: 'Computer Science & Engineering',
      year: 'Final Year',
      githubUsername: 'manoj-cloud',
      avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
      skills: [
        { name: 'DevOps', prof: 'EXPERT' },
        { name: 'Docker', prof: 'EXPERT' },
        { name: 'Cloud Computing', prof: 'ADVANCED' },
        { name: 'Git', prof: 'ADVANCED' },
      ],
    },
    {
      name: 'Pooja Hegde',
      email: 'pooja@example.com',
      bio: 'Product designer and frontend developer. Experienced in user research, wireframing, and React.',
      interests: 'UI/UX, Frontend, Web Development',
      availability: '10-15 hrs/week',
      experience: '1-2 years',
      department: 'Information Science',
      year: '3rd Year',
      githubUsername: 'pooja-ux',
      avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      skills: [
        { name: 'UI/UX', prof: 'ADVANCED' },
        { name: 'Figma', prof: 'ADVANCED' },
        { name: 'React', prof: 'INTERMEDIATE' },
        { name: 'JavaScript', prof: 'INTERMEDIATE' },
      ],
    },
    {
      name: 'Siddharth Joshi',
      email: 'siddharth@example.com',
      bio: 'Full-stack explorer with hands-on projects in Node.js, Next.js, and MongoDB.',
      interests: 'Web Development, Backend, Cloud Computing',
      availability: '15-20 hrs/week',
      experience: '2 years',
      department: 'Computer Science & Engineering',
      year: '3rd Year',
      githubUsername: 'sid-joshi',
      avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
      skills: [
        { name: 'Node.js', prof: 'ADVANCED' },
        { name: 'Next.js', prof: 'INTERMEDIATE' },
        { name: 'MongoDB', prof: 'ADVANCED' },
        { name: 'Git', prof: 'INTERMEDIATE' },
      ],
    },
    {
      name: 'Tanvi Nair',
      email: 'tanvi@example.com',
      bio: 'NLP and AI enthusiast. Working with transformers, PyTorch, and conversational agents.',
      interests: 'AI/ML, Python, Machine Learning',
      availability: '15-20 hrs/week',
      experience: 'Advanced',
      department: 'Artificial Intelligence',
      year: 'Final Year',
      githubUsername: 'tanvi-nlp',
      avatarUrl: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80',
      skills: [
        { name: 'Machine Learning', prof: 'ADVANCED' },
        { name: 'Python', prof: 'EXPERT' },
        { name: 'PyTorch', prof: 'INTERMEDIATE' },
      ],
    },
    {
      name: 'Aditya Sen',
      email: 'aditya@example.com',
      bio: 'Frontend developer and competitive programmer with strong C++ and React skills.',
      interests: 'Web Development, Frontend, Algorithms',
      availability: '5-10 hrs/week',
      experience: '1 year',
      department: 'Computer Science & Engineering',
      year: '2nd Year',
      githubUsername: 'aditya-sen',
      avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
      skills: [
        { name: 'React', prof: 'INTERMEDIATE' },
        { name: 'C++', prof: 'ADVANCED' },
        { name: 'JavaScript', prof: 'INTERMEDIATE' },
      ],
    },
  ];

  const studentMap: { [email: string]: string } = {
    'student@example.com': studentUser.id,
  };

  for (const s of otherStudentsData) {
    const user = await prisma.user.create({
      data: {
        name: s.name,
        email: s.email,
        passwordHash: defaultPasswordHash,
        role: 'STUDENT',
        profile: {
          create: {
            bio: s.bio,
            interests: s.interests,
            availability: s.availability,
            experience: s.experience,
            department: s.department,
            year: s.year,
            githubUsername: s.githubUsername,
            avatarUrl: s.avatarUrl,
          },
        },
      },
    });
    studentMap[s.email] = user.id;

    for (const sk of s.skills) {
      if (skillMap[sk.name]) {
        await prisma.studentSkill.create({
          data: {
            userId: user.id,
            skillId: skillMap[sk.name],
            proficiency: sk.prof,
          },
        });
      }
    }
  }

  console.log('🚀 Seeding Projects & Required Skills...');
  // 1. Smart Campus Navigation (Primary Demo Project owned by Karthik / student@example.com)
  const project1 = await prisma.project.create({
    data: {
      ownerId: studentUser.id,
      title: 'Smart Campus Navigation',
      description: 'A web application that helps students, visitors, and faculty navigate campus facilities, find available study rooms, locate lecture halls, and explore point-of-interest indoor routes.',
      category: 'Web Development',
      status: 'OPEN',
      preferredTeamSize: 5,
    },
  });

  const p1Skills = ['React', 'Node.js', 'PostgreSQL', 'UI/UX'];
  for (const sk of p1Skills) {
    if (skillMap[sk]) {
      await prisma.projectSkill.create({
        data: {
          projectId: project1.id,
          skillId: skillMap[sk],
          requiredLevel: 'ADVANCED',
        },
      });
    }
  }

  // 2. AI Study Planner (owned by Priya Iyer)
  const project2 = await prisma.project.create({
    data: {
      ownerId: studentMap['priya@example.com'],
      title: 'AI Study Planner & Exam Predictor',
      description: 'An intelligent academic scheduling assistant powered by machine learning that analyzes student course syllabi, past study patterns, and exam schedules to generate adaptive daily study plans.',
      category: 'AI/ML',
      status: 'IN_PROGRESS',
      preferredTeamSize: 4,
    },
  });
  const p2Skills = ['Python', 'Machine Learning', 'React', 'Next.js'];
  for (const sk of p2Skills) {
    if (skillMap[sk]) {
      await prisma.projectSkill.create({
        data: {
          projectId: project2.id,
          skillId: skillMap[sk],
          requiredLevel: 'INTERMEDIATE',
        },
      });
    }
  }

  // 3. College Event Management System (owned by Rahul Sharma)
  const project3 = await prisma.project.create({
    data: {
      ownerId: studentMap['rahul@example.com'],
      title: 'College Event Management System',
      description: 'A centralized portal for college clubs and department committees to publish hackathons, cultural festivals, tech talks, manage ticket registrations, and broadcast live announcements.',
      category: 'Web Development',
      status: 'OPEN',
      preferredTeamSize: 4,
    },
  });
  const p3Skills = ['React', 'Node.js', 'MongoDB', 'Figma'];
  for (const sk of p3Skills) {
    if (skillMap[sk]) {
      await prisma.projectSkill.create({
        data: {
          projectId: project3.id,
          skillId: skillMap[sk],
          requiredLevel: 'INTERMEDIATE',
        },
      });
    }
  }

  // 4. Campus Marketplace (owned by Ananya Verma)
  const project4 = await prisma.project.create({
    data: {
      ownerId: studentMap['ananya@example.com'],
      title: 'Campus Peer Marketplace',
      description: 'A verified peer-to-peer marketplace for college students to buy, sell, or rent used textbooks, engineering calculators, lab coats, drawing kits, and electronics within the campus perimeter.',
      category: 'Web Development',
      status: 'OPEN',
      preferredTeamSize: 4,
    },
  });
  const p4Skills = ['Next.js', 'TypeScript', 'PostgreSQL', 'Tailwind CSS'];
  for (const sk of p4Skills) {
    if (skillMap[sk]) {
      await prisma.projectSkill.create({
        data: {
          projectId: project4.id,
          skillId: skillMap[sk],
          requiredLevel: 'ADVANCED',
        },
      });
    }
  }

  // 5. Student Expense Tracker (owned by Sneha Kulkarni)
  const project5 = await prisma.project.create({
    data: {
      ownerId: studentMap['sneha@example.com'],
      title: 'Student Expense & Budget Tracker',
      description: 'A mobile-first expense tracker and bill splitting application tailored for student roommates and hostelites with offline synchronization and budget analytics.',
      category: 'Mobile App',
      status: 'OPEN',
      preferredTeamSize: 3,
    },
  });
  const p5Skills = ['Flutter', 'Android', 'UI/UX', 'JavaScript'];
  for (const sk of p5Skills) {
    if (skillMap[sk]) {
      await prisma.projectSkill.create({
        data: {
          projectId: project5.id,
          skillId: skillMap[sk],
          requiredLevel: 'INTERMEDIATE',
        },
      });
    }
  }

  // 6. Hackathon Team Finder (owned by Manoj Reddy)
  const project6 = await prisma.project.create({
    data: {
      ownerId: studentMap['manoj@example.com'],
      title: 'Hackathon Team Formation Hub',
      description: 'A rapid matching platform for competitive hackathon participants to pitch ideas, form cross-disciplinary squads, and coordinate 36-hour sprint milestones.',
      category: 'Web Development',
      status: 'OPEN',
      preferredTeamSize: 4,
    },
  });
  const p6Skills = ['React', 'Node.js', 'TypeScript', 'DevOps'];
  for (const sk of p6Skills) {
    if (skillMap[sk]) {
      await prisma.projectSkill.create({
        data: {
          projectId: project6.id,
          skillId: skillMap[sk],
          requiredLevel: 'ADVANCED',
        },
      });
    }
  }

  // 7. Open Source Contribution Hub (owned by Vikram Menon)
  const project7 = await prisma.project.create({
    data: {
      ownerId: studentMap['vikram@example.com'],
      title: 'Open Source Contribution Hub',
      description: 'A curated onboarding pipeline that matches junior students with good-first-issues in university open-source repositories with mentor code review workflows.',
      category: 'Tools',
      status: 'IN_PROGRESS',
      preferredTeamSize: 5,
    },
  });
  const p7Skills = ['Git', 'GitHub', 'Python', 'Next.js'];
  for (const sk of p7Skills) {
    if (skillMap[sk]) {
      await prisma.projectSkill.create({
        data: {
          projectId: project7.id,
          skillId: skillMap[sk],
          requiredLevel: 'INTERMEDIATE',
        },
      });
    }
  }

  // 8. Placement Preparation Platform (owned by Arjun Das)
  const project8 = await prisma.project.create({
    data: {
      ownerId: studentMap['arjun@example.com'],
      title: 'Placement Preparation & Mock Interview Hub',
      description: 'A peer-to-peer mock interview exchange and coding practice platform for final-year placement drives featuring algorithmic drills and resume reviews.',
      category: 'Web Development',
      status: 'OPEN',
      preferredTeamSize: 4,
    },
  });
  const p8Skills = ['React', 'Java', 'PostgreSQL', 'Data Science'];
  for (const sk of p8Skills) {
    if (skillMap[sk]) {
      await prisma.projectSkill.create({
        data: {
          projectId: project8.id,
          skillId: skillMap[sk],
          requiredLevel: 'ADVANCED',
        },
      });
    }
  }

  console.log('👥 Seeding Teams & Members...');
  // Team 1: Smart Campus Navigation (3 / 5 members currently: Karthik Rao (Owner), Ananya Verma (Member), Rohan Patel (Member))
  const team1 = await prisma.team.create({
    data: {
      projectId: project1.id,
      status: 'ACTIVE',
      members: {
        create: [
          { userId: studentUser.id, role: 'OWNER' },
          { userId: studentMap['ananya@example.com'], role: 'MEMBER' },
          { userId: studentMap['rohan@example.com'], role: 'MEMBER' },
        ],
      },
    },
  });

  // Team 2: AI Study Planner (Priya Iyer (Owner), Tanvi Nair (Member))
  const team2 = await prisma.team.create({
    data: {
      projectId: project2.id,
      status: 'ACTIVE',
      members: {
        create: [
          { userId: studentMap['priya@example.com'], role: 'OWNER' },
          { userId: studentMap['tanvi@example.com'], role: 'MEMBER' },
          { userId: studentMap['divya@example.com'], role: 'MEMBER' },
        ],
      },
    },
  });

  // Team 3: College Event Management System (Rahul Sharma (Owner), Neha Gupta (Member))
  const team3 = await prisma.team.create({
    data: {
      projectId: project3.id,
      status: 'FORMING',
      members: {
        create: [
          { userId: studentMap['rahul@example.com'], role: 'OWNER' },
          { userId: studentMap['neha@example.com'], role: 'MEMBER' },
        ],
      },
    },
  });

  // Team 4: Campus Peer Marketplace (Ananya Verma (Owner), Pooja Hegde (Member))
  const team4 = await prisma.team.create({
    data: {
      projectId: project4.id,
      status: 'FORMING',
      members: {
        create: [
          { userId: studentMap['ananya@example.com'], role: 'OWNER' },
          { userId: studentMap['pooja@example.com'], role: 'MEMBER' },
        ],
      },
    },
  });

  // Team 5: Open Source Contribution Hub (Vikram Menon (Owner))
  const team5 = await prisma.team.create({
    data: {
      projectId: project7.id,
      status: 'ACTIVE',
      members: {
        create: [
          { userId: studentMap['vikram@example.com'], role: 'OWNER' },
          { userId: studentMap['manoj@example.com'], role: 'MEMBER' },
        ],
      },
    },
  });

  console.log('📌 Seeding Tasks for Kanban Board...');
  // Tasks for Smart Campus Navigation (Project 1)
  const tasksP1 = [
    {
      projectId: project1.id,
      assigneeId: studentMap['rohan@example.com'],
      title: 'Design Database Schema for Campus Coordinates',
      description: 'Define relational entities for campus buildings, floors, rooms, and vector navigation nodes in PostgreSQL with Prisma schema.',
      status: 'COMPLETED',
      priority: 'HIGH',
      dueDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    },
    {
      projectId: project1.id,
      assigneeId: studentMap['ananya@example.com'],
      title: 'Create High-Fidelity UI Wireframes in Figma',
      description: 'Craft interactive wireframes for campus map exploration, search drawer, and indoor floor selector according to accessibility standards.',
      status: 'COMPLETED',
      priority: 'MEDIUM',
      dueDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1),
    },
    {
      projectId: project1.id,
      assigneeId: studentUser.id,
      title: 'Implement Interactive Vector Map & Pathfinding Algorithm',
      description: 'Develop Dijkstra/A* pathfinding engine over campus node network and render step-by-step route directions in React.',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3), // in 3 days
    },
    {
      projectId: project1.id,
      assigneeId: studentMap['rohan@example.com'],
      title: 'Build REST APIs for Room Availability & Scheduling',
      description: 'Create backend endpoints for checking live room occupancy and booking seminar halls with role-based auth.',
      status: 'IN_PROGRESS',
      priority: 'MEDIUM',
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5),
    },
    {
      projectId: project1.id,
      assigneeId: studentMap['ananya@example.com'],
      title: 'Implement Dark Mode and Responsive Mobile Drawer',
      description: 'Ensure map controls and navigation cards adapt seamlessly to mobile viewports (375px) with accessible dark mode toggle.',
      status: 'TODO',
      priority: 'LOW',
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    },
    {
      projectId: project1.id,
      assigneeId: null,
      title: 'Conduct End-to-End Latency and Load Testing',
      description: 'Benchmark route calculation response time under simulated 500 concurrent student users.',
      status: 'TODO',
      priority: 'MEDIUM',
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10),
    },
  ];

  for (const t of tasksP1) {
    await prisma.task.create({ data: t });
  }

  // Tasks for AI Study Planner (Project 2)
  const tasksP2 = [
    {
      projectId: project2.id,
      assigneeId: studentMap['priya@example.com'],
      title: 'Train Syllabus Parsing NLP Pipeline',
      description: 'Extract exam chapters and time weights from PDF syllabi using PyTorch text classification.',
      status: 'COMPLETED',
      priority: 'HIGH',
      dueDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    },
    {
      projectId: project2.id,
      assigneeId: studentMap['tanvi@example.com'],
      title: 'Build Daily Revision Schedule Generator',
      description: 'Implement spaced repetition algorithm (SM-2) for flashcards and topic mastery tracking.',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 4),
    },
    {
      projectId: project2.id,
      assigneeId: studentMap['divya@example.com'],
      title: 'Design Analytics Dashboard for Study Streaks',
      description: 'Create visual charts showing weekly study hours vs exam readiness percentage.',
      status: 'TODO',
      priority: 'MEDIUM',
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 8),
    },
  ];

  for (const t of tasksP2) {
    await prisma.task.create({ data: t });
  }

  console.log('🔗 Seeding GitHub Repositories...');
  await prisma.repository.create({
    data: {
      projectId: project1.id,
      githubUrl: 'https://github.com/karthik-rao-dev/smart-campus-navigation',
      owner: 'karthik-rao-dev',
      name: 'smart-campus-navigation',
      description: 'Autonomous indoor and outdoor campus navigation web system built with Next.js, Node.js, and PostgreSQL.',
      stars: 24,
      forks: 8,
      language: 'TypeScript',
      lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 5),
    },
  });

  await prisma.repository.create({
    data: {
      projectId: project2.id,
      githubUrl: 'https://github.com/priyaiyer-ml/ai-study-planner',
      owner: 'priyaiyer-ml',
      name: 'ai-study-planner',
      description: 'Machine learning powered study schedule optimizer and spaced-repetition exam planner.',
      stars: 42,
      forks: 14,
      language: 'Python',
      lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 12),
    },
  });

  console.log('📬 Seeding Collaboration Requests...');
  // Karthik received request from Neha Gupta for Smart Campus Navigation
  await prisma.collaborationRequest.create({
    data: {
      senderId: studentMap['neha@example.com'],
      receiverId: studentUser.id,
      projectId: project1.id,
      message: 'Hi Karthik, I saw Smart Campus Navigation! My React and TypeScript experience would be a great fit for building the front-end indoor map viewer.',
      status: 'PENDING',
    },
  });

  // Karthik received request from Rahul Sharma
  await prisma.collaborationRequest.create({
    data: {
      senderId: studentMap['rahul@example.com'],
      receiverId: studentUser.id,
      projectId: project1.id,
      message: 'Hi Karthik, your React and Node.js stack matches my skill set. I would love to collaborate on the API layer!',
      status: 'PENDING',
    },
  });

  // Karthik sent request to Priya Iyer for AI Study Planner
  await prisma.collaborationRequest.create({
    data: {
      senderId: studentUser.id,
      receiverId: studentMap['priya@example.com'],
      projectId: project2.id,
      message: 'Hi Priya, I can contribute Next.js frontend and dashboard UI components to your AI study planner project.',
      status: 'PENDING',
    },
  });

  // Accepted historical requests
  await prisma.collaborationRequest.create({
    data: {
      senderId: studentMap['ananya@example.com'],
      receiverId: studentUser.id,
      projectId: project1.id,
      message: 'Excited to contribute UI/UX designs and React components!',
      status: 'ACCEPTED',
    },
  });

  await prisma.collaborationRequest.create({
    data: {
      senderId: studentMap['rohan@example.com'],
      receiverId: studentUser.id,
      projectId: project1.id,
      message: 'Ready to build the PostgreSQL database models and Docker setup.',
      status: 'ACCEPTED',
    },
  });

  console.log('🔔 Seeding Notifications...');
  const notificationsData = [
    {
      userId: studentUser.id,
      type: 'COLLABORATION_REQUEST',
      message: 'You received a collaboration request from Neha Gupta for Smart Campus Navigation.',
      link: '/collaboration-requests',
      readStatus: false,
    },
    {
      userId: studentUser.id,
      type: 'COLLABORATION_REQUEST',
      message: 'You received a collaboration request from Rahul Sharma for Smart Campus Navigation.',
      link: '/collaboration-requests',
      readStatus: false,
    },
    {
      userId: studentUser.id,
      type: 'TASK_ASSIGNED',
      message: 'You were assigned a new task: "Implement Interactive Vector Map & Pathfinding Algorithm".',
      link: `/projects/${project1.id}/tasks`,
      readStatus: false,
    },
    {
      userId: studentUser.id,
      type: 'GITHUB_CONNECTED',
      message: 'GitHub repository karthik-rao-dev/smart-campus-navigation was successfully connected.',
      link: `/projects/${project1.id}/github`,
      readStatus: true,
    },
    {
      userId: studentUser.id,
      type: 'REQUEST_ACCEPTED',
      message: 'Ananya Verma accepted your invitation to join Smart Campus Navigation.',
      link: `/projects/${project1.id}/team`,
      readStatus: true,
    },
  ];

  for (const n of notificationsData) {
    await prisma.notification.create({ data: n });
  }

  console.log('🛡️ Seeding Moderation Reports...');
  await prisma.report.create({
    data: {
      reporterId: studentUser.id,
      projectId: project5.id,
      reason: 'Duplicate project listing with unclear scope description.',
      status: 'PENDING',
    },
  });

  console.log('✅ Database seeded successfully with 15 students, 1 admin, 26 skills, 8 projects, 5 teams, tasks, repositories, requests, and notifications!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
