import {
  INITIAL_USERS,
  INITIAL_PROJECTS,
  INITIAL_SKILLS,
  INITIAL_COLLABORATION_REQUESTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_REPORTS,
  DemoUser,
  DemoProject,
  DemoSkill,
  DemoCollaborationRequest,
  DemoNotification,
  DemoReport,
  DemoTask,
} from './demoData';
import {
  rankCandidatesForProject,
  rankProjectsForCandidate,
  CandidateStudent,
  TargetProject,
  MatchBreakdown,
} from '@/lib/matching';

export const DEMO_STORAGE_KEY = 'peer_collab_demo_state_v1';
export const DEMO_COOKIE_NAME = 'peer_collab_demo_role';

export interface DemoStatePayload {
  users: DemoUser[];
  projects: DemoProject[];
  skills: DemoSkill[];
  requests: DemoCollaborationRequest[];
  notifications: DemoNotification[];
  reports: DemoReport[];
}

function getDefaultState(): DemoStatePayload {
  // Deep clone initial constants so mutations don't mutate defaults
  return {
    users: JSON.parse(JSON.stringify(INITIAL_USERS)),
    projects: JSON.parse(JSON.stringify(INITIAL_PROJECTS)),
    skills: JSON.parse(JSON.stringify(INITIAL_SKILLS)),
    requests: JSON.parse(JSON.stringify(INITIAL_COLLABORATION_REQUESTS)),
    notifications: JSON.parse(JSON.stringify(INITIAL_NOTIFICATIONS)),
    reports: JSON.parse(JSON.stringify(INITIAL_REPORTS)),
  };
}

let inMemoryState: DemoStatePayload = getDefaultState();

export function getDemoState(): DemoStatePayload {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(DEMO_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Could not read demo state from localStorage:', e);
    }
  }
  return inMemoryState;
}

export function saveDemoState(state: DemoStatePayload): void {
  inMemoryState = state;
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Could not persist demo state to localStorage:', e);
    }
  }
}

export function resetDemoState(): DemoStatePayload {
  const fresh = getDefaultState();
  saveDemoState(fresh);
  return fresh;
}

// User Helpers
export function getDemoUserByRole(role: 'STUDENT' | 'ADMIN'): DemoUser {
  const state = getDemoState();
  if (role === 'ADMIN') {
    return state.users.find((u) => u.role === 'ADMIN') || state.users[0];
  }
  return state.users.find((u) => u.email === 'student@example.com') || state.users[1];
}

export function getDemoUserById(id: string): DemoUser | null {
  const state = getDemoState();
  return state.users.find((u) => u.id === id) || null;
}

// Student Dashboard Helper
export function getDemoStudentDashboard(userId: string) {
  const state = getDemoState();
  const user = state.users.find((u) => u.id === userId) || getDemoUserByRole('STUDENT');

  const ownedProjects = state.projects.filter((p) => p.ownerId === user.id);
  const collaboratingProjects = state.projects.filter(
    (p) =>
      p.ownerId !== user.id &&
      p.team?.members.some((m) => m.userId === user.id)
  );

  const activeProjects = [...ownedProjects, ...collaboratingProjects];

  // Count unique team members across student's projects
  const memberSet = new Set<string>();
  for (const p of activeProjects) {
    p.team?.members.forEach((m) => memberSet.add(m.userId));
  }

  // Pending collaboration requests received
  const pendingRequests = state.requests.filter(
    (r) => r.receiverId === user.id && r.status === 'PENDING'
  );

  // Urgent tasks assigned to this user
  const allTasks: (DemoTask & { projectTitle: string })[] = [];
  for (const p of activeProjects) {
    for (const t of p.tasks) {
      if (t.assigneeId === user.id && t.status !== 'COMPLETED') {
        allTasks.push({ ...t, projectTitle: p.title });
      }
    }
  }

  // Candidate representation for matching
  const candidateStudent: CandidateStudent = {
    userId: user.id,
    name: user.name,
    email: user.email,
    bio: user.profile.bio,
    interests: user.profile.interests,
    availability: user.profile.availability,
    experience: user.profile.experience,
    department: user.profile.department,
    year: user.profile.year,
    githubUsername: user.profile.githubUsername,
    avatarUrl: user.profile.avatarUrl,
    skills: user.studentSkills.map((ss) => ({
      name: ss.skill.name,
      proficiency: ss.proficiency,
    })),
  };

  // Convert other projects to TargetProject for recommendations
  const candidateProjects = state.projects
    .filter((p) => p.ownerId !== user.id)
    .map((p) => ({
      ...p,
      requiredSkills: p.projectSkills.map((ps) => ({
        name: ps.skill.name,
        proficiency: ps.requiredLevel,
      })),
    }));

  const recommendedProjects = rankProjectsForCandidate(candidateStudent, candidateProjects as any).slice(0, 3);

  // Recommended teammates for first owned project
  let recommendedTeammates: MatchBreakdown[] = [];
  if (ownedProjects.length > 0) {
    const targetProject: TargetProject = {
      id: ownedProjects[0].id,
      title: ownedProjects[0].title,
      description: ownedProjects[0].description,
      category: ownedProjects[0].category,
      requiredSkills: ownedProjects[0].projectSkills.map((ps) => ({
        name: ps.skill.name,
        proficiency: ps.requiredLevel,
      })),
    };

    const studentCandidates: CandidateStudent[] = state.users
      .filter((u) => u.role === 'STUDENT' && u.id !== user.id)
      .map((u) => ({
        userId: u.id,
        name: u.name,
        email: u.email,
        bio: u.profile.bio,
        interests: u.profile.interests,
        availability: u.profile.availability,
        experience: u.profile.experience,
        department: u.profile.department,
        year: u.profile.year,
        githubUsername: u.profile.githubUsername,
        avatarUrl: u.profile.avatarUrl,
        skills: u.studentSkills.map((ss) => ({
          name: ss.skill.name,
          proficiency: ss.proficiency,
        })),
      }));

    recommendedTeammates = rankCandidatesForProject(studentCandidates, targetProject).slice(0, 3);
  }

  const userNotifications = state.notifications
    .filter((n) => n.userId === user.id)
    .slice(0, 5);

  return {
    user,
    summary: {
      activeProjectsCount: activeProjects.length,
      collaboratorsCount: Math.max(0, memberSet.size - 1),
      pendingRequestsCount: pendingRequests.length,
      urgentTasksCount: allTasks.length,
    },
    ownedProjects,
    collaboratingProjects,
    urgentTasks: allTasks.slice(0, 5),
    recommendedProjects,
    recommendedTeammates,
    notifications: userNotifications,
  };
}

// Project Helpers
export function getDemoProjects(search?: string, category?: string, status?: string) {
  const state = getDemoState();
  let list = [...state.projects];

  if (search) {
    const q = search.toLowerCase();
    list = list.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }

  if (category && category !== 'ALL') {
    list = list.filter((p) => p.category.toLowerCase() === category.toLowerCase());
  }

  if (status && status !== 'ALL') {
    list = list.filter((p) => p.status === status);
  }

  return {
    projects: list,
    total: list.length,
  };
}

export function getDemoProjectById(id: string): DemoProject | null {
  const state = getDemoState();
  return state.projects.find((p) => p.id === id) || null;
}

export function calculateProjectMatches(projectId: string): MatchBreakdown[] {
  const state = getDemoState();
  const project = state.projects.find((p) => p.id === projectId);
  if (!project) return [];

  const targetProject: TargetProject = {
    id: project.id,
    title: project.title,
    description: project.description,
    category: project.category,
    requiredSkills: project.projectSkills.map((ps) => ({
      name: ps.skill.name,
      proficiency: ps.requiredLevel,
    })),
  };

  const studentCandidates: CandidateStudent[] = state.users
    .filter((u) => u.role === 'STUDENT' && u.id !== project.ownerId)
    .map((u) => ({
      userId: u.id,
      name: u.name,
      email: u.email,
      bio: u.profile.bio,
      interests: u.profile.interests,
      availability: u.profile.availability,
      experience: u.profile.experience,
      department: u.profile.department,
      year: u.profile.year,
      githubUsername: u.profile.githubUsername,
      avatarUrl: u.profile.avatarUrl,
      skills: u.studentSkills.map((ss) => ({
        name: ss.skill.name,
        proficiency: ss.proficiency,
      })),
    }));

  return rankCandidatesForProject(studentCandidates, targetProject);
}

export function getDemoProjectProgress(projectId: string) {
  const state = getDemoState();
  const project = state.projects.find((p) => p.id === projectId);
  if (!project) return null;

  const totalTasks = project.tasks.length;
  const completedTasks = project.tasks.filter((t) => t.status === 'COMPLETED').length;
  const inProgressTasks = project.tasks.filter((t) => t.status === 'IN_PROGRESS').length;
  const todoTasks = project.tasks.filter((t) => t.status === 'TODO').length;
  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const highPriority = project.tasks.filter((t) => t.priority === 'HIGH').length;
  const medPriority = project.tasks.filter((t) => t.priority === 'MEDIUM').length;
  const lowPriority = project.tasks.filter((t) => t.priority === 'LOW').length;

  const members = project.team?.members || [];
  const memberContributions = members.map((m) => {
    const userTasks = project.tasks.filter((t) => t.assigneeId === m.userId);
    const userCompleted = userTasks.filter((t) => t.status === 'COMPLETED').length;
    const userTotal = userTasks.length;
    const userPercent = userTotal > 0 ? Math.round((userCompleted / userTotal) * 100) : 0;

    return {
      userId: m.userId,
      name: m.user.name,
      completed: userCompleted,
      total: userTotal,
      percentage: userPercent,
      avatarUrl: m.user.profile?.avatarUrl,
    };
  });

  return {
    project: {
      id: project.id,
      title: project.title,
      category: project.category,
      preferredTeamSize: project.preferredTeamSize,
      currentTeamSize: members.length,
      status: project.status,
    },
    stats: {
      totalTasks,
      completedTasks,
      inProgressTasks,
      pendingTasks: todoTasks,
      progressPercentage,
      priorityBreakdown: {
        HIGH: highPriority,
        MEDIUM: medPriority,
        LOW: lowPriority,
      },
      isGitHubConnected: !!project.repository,
      repository: project.repository || null,
    },
    memberContributions,
  };
}

export function createDemoProject(data: any, ownerId: string): DemoProject {
  const state = getDemoState();
  const owner = state.users.find((u) => u.id === ownerId) || state.users[1];

  const newId = `demo-proj-${Date.now()}`;
  const skillsList = Array.isArray(data.skills) ? data.skills : [];

  const projectSkills = skillsList.map((sk: any, idx: number) => {
    let skillObj = state.skills.find(
      (s) => s.name.toLowerCase() === (sk.name || '').toLowerCase()
    );
    if (!skillObj) {
      skillObj = {
        id: `sk-custom-${Date.now()}-${idx}`,
        name: sk.name || 'General Skill',
        category: 'Custom',
      };
      state.skills.push(skillObj);
    }
    return {
      id: `ps-new-${Date.now()}-${idx}`,
      projectId: newId,
      skillId: skillObj.id,
      requiredLevel: (sk.requiredLevel || 'INTERMEDIATE') as any,
      skill: skillObj,
    };
  });

  const newProject: DemoProject = {
    id: newId,
    ownerId: owner.id,
    title: data.title,
    description: data.description,
    category: data.category || 'Web Development',
    status: data.status || 'OPEN',
    preferredTeamSize: Number(data.preferredTeamSize) || 4,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    owner: {
      id: owner.id,
      name: owner.name,
      email: owner.email,
      profile: owner.profile,
    },
    projectSkills,
    team: {
      id: `team-${newId}`,
      projectId: newId,
      status: 'FORMING',
      members: [
        {
          id: `tm-${newId}-owner`,
          teamId: `team-${newId}`,
          userId: owner.id,
          role: 'OWNER',
          joinedAt: new Date().toISOString(),
          user: owner,
        },
      ],
    },
    tasks: [],
    repository: data.githubUrl
      ? {
          id: `repo-${newId}`,
          projectId: newId,
          githubUrl: data.githubUrl,
          owner: owner.name.toLowerCase().replace(/\s+/g, '-'),
          name: data.title.toLowerCase().replace(/[^a-z0-9]/g, '-'),
          description: data.description,
          stars: 1,
          forks: 0,
          language: skillsList[0]?.name || 'TypeScript',
          lastUpdated: new Date().toISOString(),
        }
      : null,
  };

  state.projects.unshift(newProject);
  saveDemoState(state);
  return newProject;
}

// Task Helpers
export function createDemoTask(data: any): DemoTask {
  const state = getDemoState();
  const project = state.projects.find((p) => p.id === data.projectId);
  if (!project) throw new Error('Project not found');

  const assignee = data.assigneeId
    ? state.users.find((u) => u.id === data.assigneeId)
    : null;

  const newTask: DemoTask = {
    id: `task-new-${Date.now()}`,
    projectId: data.projectId,
    assigneeId: data.assigneeId || null,
    title: data.title,
    description: data.description || null,
    priority: data.priority || 'MEDIUM',
    status: data.status || 'TODO',
    dueDate: data.dueDate || null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    assignee: assignee
      ? {
          id: assignee.id,
          name: assignee.name,
          email: assignee.email,
          profile: { avatarUrl: assignee.profile.avatarUrl },
        }
      : null,
  };

  project.tasks.push(newTask);
  saveDemoState(state);
  return newTask;
}

export function updateDemoTask(taskId: string, updates: Partial<DemoTask>): DemoTask | null {
  const state = getDemoState();
  for (const project of state.projects) {
    const taskIndex = project.tasks.findIndex((t) => t.id === taskId);
    if (taskIndex !== -1) {
      const existing = project.tasks[taskIndex];
      const updated: DemoTask = {
        ...existing,
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      if (updates.assigneeId !== undefined) {
        if (updates.assigneeId) {
          const u = state.users.find((user) => user.id === updates.assigneeId);
          updated.assignee = u
            ? {
                id: u.id,
                name: u.name,
                email: u.email,
                profile: { avatarUrl: u.profile.avatarUrl },
              }
            : null;
        } else {
          updated.assignee = null;
        }
      }
      project.tasks[taskIndex] = updated;
      saveDemoState(state);
      return updated;
    }
  }
  return null;
}

export function deleteDemoTask(taskId: string): boolean {
  const state = getDemoState();
  for (const project of state.projects) {
    const idx = project.tasks.findIndex((t) => t.id === taskId);
    if (idx !== -1) {
      project.tasks.splice(idx, 1);
      saveDemoState(state);
      return true;
    }
  }
  return false;
}

// Collaboration Request Helpers
export function getDemoCollaborationRequests(userId: string) {
  const state = getDemoState();
  const received = state.requests.filter((r) => r.receiverId === userId);
  const sent = state.requests.filter((r) => r.senderId === userId);
  return { received, sent };
}

export function sendDemoCollaborationRequest(senderId: string, data: any): DemoCollaborationRequest {
  const state = getDemoState();
  const sender = state.users.find((u) => u.id === senderId) || state.users[1];
  const receiver = state.users.find((u) => u.id === data.receiverId) || state.users[2];
  const project = state.projects.find((p) => p.id === data.projectId) || state.projects[0];

  const newReq: DemoCollaborationRequest = {
    id: `req-${Date.now()}`,
    senderId: sender.id,
    receiverId: receiver.id,
    projectId: project.id,
    message: data.message || `Hello, I'd like to collaborate on "${project.title}".`,
    status: 'PENDING',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    sender,
    receiver,
    project: {
      id: project.id,
      title: project.title,
      category: project.category,
      ownerId: project.ownerId,
    },
  };

  state.requests.unshift(newReq);

  // Also create a notification for receiver
  state.notifications.unshift({
    id: `notif-${Date.now()}`,
    userId: receiver.id,
    type: 'COLLABORATION_REQUEST',
    message: `You received a collaboration request from ${sender.name} for ${project.title}.`,
    link: '/collaboration-requests',
    readStatus: false,
    createdAt: new Date().toISOString(),
  });

  saveDemoState(state);
  return newReq;
}

export function updateDemoCollaborationRequest(
  requestId: string,
  status: 'ACCEPTED' | 'REJECTED' | 'CANCELLED'
): DemoCollaborationRequest | null {
  const state = getDemoState();
  const req = state.requests.find((r) => r.id === requestId);
  if (!req) return null;

  req.status = status;
  req.updatedAt = new Date().toISOString();

  // If ACCEPTED, add the sender to the project team!
  if (status === 'ACCEPTED') {
    const project = state.projects.find((p) => p.id === req.projectId);
    if (project && project.team) {
      const alreadyMember = project.team.members.some((m) => m.userId === req.senderId);
      if (!alreadyMember) {
        const sender = state.users.find((u) => u.id === req.senderId);
        if (sender) {
          project.team.members.push({
            id: `tm-${Date.now()}`,
            teamId: project.team.id,
            userId: sender.id,
            role: 'MEMBER',
            joinedAt: new Date().toISOString(),
            user: sender,
          });
        }
      }
    }

    // Add notification for sender
    state.notifications.unshift({
      id: `notif-${Date.now()}`,
      userId: req.senderId,
      type: 'REQUEST_ACCEPTED',
      message: `Your collaboration request for "${req.project.title}" was accepted! You are now a team member.`,
      link: `/projects/${req.projectId}/team`,
      readStatus: false,
      createdAt: new Date().toISOString(),
    });
  }

  saveDemoState(state);
  return req;
}

// Notifications Helpers
export function getDemoNotifications(userId: string) {
  const state = getDemoState();
  const userNotifs = state.notifications.filter((n) => n.userId === userId);
  const unreadCount = userNotifs.filter((n) => !n.readStatus).length;
  return { notifications: userNotifs, unreadCount };
}

export function markDemoNotificationsAsRead(userId: string, notificationId?: string) {
  const state = getDemoState();
  for (const n of state.notifications) {
    if (n.userId === userId) {
      if (!notificationId || n.id === notificationId) {
        n.readStatus = true;
      }
    }
  }
  saveDemoState(state);
}

// Admin Helpers
export function getDemoAdminStats() {
  const state = getDemoState();

  const totalUsers = state.users.length;
  const activeUsers = state.users.filter((u) => u.isActive).length;
  const totalStudents = state.users.filter((u) => u.role === 'STUDENT').length;
  const totalAdmins = state.users.filter((u) => u.role === 'ADMIN').length;

  const totalProjects = state.projects.length;
  const activeProjects = state.projects.filter((p) => ['OPEN', 'IN_PROGRESS'].includes(p.status)).length;
  const completedProjects = state.projects.filter((p) => p.status === 'COMPLETED').length;

  const totalTeams = state.projects.filter((p) => p.team).length;
  const activeTeams = state.projects.filter((p) => p.team?.status === 'ACTIVE').length;

  let totalTasks = 0;
  let completedTasks = 0;
  for (const p of state.projects) {
    totalTasks += p.tasks.length;
    completedTasks += p.tasks.filter((t) => t.status === 'COMPLETED').length;
  }

  const totalRequests = state.requests.length;
  const pendingRequests = state.requests.filter((r) => r.status === 'PENDING').length;
  const acceptedRequests = state.requests.filter((r) => r.status === 'ACCEPTED').length;

  const totalReports = state.reports.length;
  const pendingReports = state.reports.filter((r) => r.status === 'PENDING').length;
  const resolvedReports = state.reports.filter((r) => r.status === 'RESOLVED').length;

  const totalSkills = state.skills.length;

  const recentProjects = state.projects.slice(0, 6).map((p) => ({
    ...p,
    _count: { tasks: p.tasks.length, requests: state.requests.filter((r) => r.projectId === p.id).length },
  }));

  const recentUsers = state.users.slice(0, 6);
  const recentRequests = state.requests.slice(0, 5);

  return {
    stats: {
      totalUsers,
      activeUsers,
      totalStudents,
      totalAdmins,
      totalProjects,
      activeProjects,
      completedProjects,
      totalTeams,
      activeTeams,
      totalTasks,
      completedTasks,
      totalRequests,
      pendingRequests,
      acceptedRequests,
      totalReports,
      pendingReports,
      resolvedReports,
      totalSkills,
    },
    recentProjects,
    recentUsers,
    recentRequests,
  };
}

export function getDemoAdminUsers(search?: string, role?: string, status?: string) {
  const state = getDemoState();
  let list = [...state.users];

  if (search) {
    const q = search.toLowerCase();
    list = list.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
  }

  if (role) {
    list = list.filter((u) => u.role === role);
  }

  if (status === 'ACTIVE') {
    list = list.filter((u) => u.isActive);
  } else if (status === 'INACTIVE') {
    list = list.filter((u) => !u.isActive);
  }

  return { users: list, total: list.length };
}

export function toggleDemoUserActive(userId: string, isActive: boolean): DemoUser | null {
  const state = getDemoState();
  const user = state.users.find((u) => u.id === userId);
  if (!user) return null;
  user.isActive = isActive;
  saveDemoState(state);
  return user;
}

export function getDemoAdminProjects(search?: string, category?: string, status?: string) {
  return getDemoProjects(search, category, status);
}

export function getDemoAdminSkills() {
  const state = getDemoState();
  return { skills: state.skills };
}

export function createDemoAdminSkill(name: string, category: string): DemoSkill {
  const state = getDemoState();
  const newSkill: DemoSkill = {
    id: `sk-admin-${Date.now()}`,
    name,
    category,
  };
  state.skills.push(newSkill);
  saveDemoState(state);
  return newSkill;
}

export function getDemoAdminReports() {
  const state = getDemoState();
  return { reports: state.reports };
}

export function resolveDemoAdminReport(reportId: string, status: 'RESOLVED' | 'DISMISSED'): DemoReport | null {
  const state = getDemoState();
  const report = state.reports.find((r) => r.id === reportId);
  if (!report) return null;
  report.status = status;
  saveDemoState(state);
  return report;
}
