import {
  getDemoUserByRole,
  getDemoUserById,
  getDemoStudentDashboard,
  getDemoProjects,
  getDemoProjectById,
  calculateProjectMatches,
  getDemoProjectProgress,
  createDemoProject,
  createDemoTask,
  updateDemoTask,
  deleteDemoTask,
  getDemoCollaborationRequests,
  sendDemoCollaborationRequest,
  updateDemoCollaborationRequest,
  getDemoNotifications,
  markDemoNotificationsAsRead,
  getDemoAdminStats,
  getDemoAdminUsers,
  toggleDemoUserActive,
  getDemoAdminProjects,
  getDemoAdminSkills,
  createDemoAdminSkill,
  getDemoAdminReports,
  resolveDemoAdminReport,
  DEMO_COOKIE_NAME,
} from './demoState';

export function showDemoToast(message: string, type: 'info' | 'success' | 'warning' = 'info') {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('peer-collab-demo-toast', {
        detail: { message, type, id: Date.now() },
      })
    );
  }
}

let originalFetch: typeof window.fetch | null = null;

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

export function isDemoModeActive(): { isDemo: boolean; role: 'STUDENT' | 'ADMIN' | null } {
  if (typeof window === 'undefined') return { isDemo: false, role: null };
  const cookieRole = getCookie(DEMO_COOKIE_NAME);
  if (cookieRole === 'STUDENT' || cookieRole === 'ADMIN') {
    return { isDemo: true, role: cookieRole };
  }
  return { isDemo: false, role: null };
}

function mockResponse(data: any, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export function installDemoInterceptor() {
  if (typeof window === 'undefined') return;
  if (originalFetch) return; // Already installed

  originalFetch = window.fetch;

  window.fetch = async function (input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    const { isDemo, role } = isDemoModeActive();

    // If not in demo mode, pass directly to real fetch
    if (!isDemo || !role) {
      return originalFetch!.call(window, input, init);
    }

    const urlString = typeof input === 'string' ? input : input instanceof URL ? input.toString() : (input as Request).url;
    const url = new URL(urlString, window.location.origin);
    const pathname = url.pathname;
    const method = (init?.method || 'GET').toUpperCase();

    // Only intercept /api/ routes
    if (!pathname.startsWith('/api/')) {
      return originalFetch!.call(window, input, init);
    }

    const currentUser = getDemoUserByRole(role);

    try {
      // 1. Current Auth User: /api/auth/me
      if (pathname === '/api/auth/me') {
        return mockResponse({ user: currentUser });
      }

      // Logout in demo mode
      if (pathname === '/api/auth/logout') {
        document.cookie = `${DEMO_COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
        showDemoToast('Demo session cleared. Returning to landing page.', 'info');
        return mockResponse({ ok: true });
      }

      // 2. Student Dashboard: /api/dashboard/student
      if (pathname === '/api/dashboard/student') {
        const dashboardData = getDemoStudentDashboard(currentUser.id);
        return mockResponse(dashboardData);
      }

      // 3. Projects: /api/projects
      if (pathname === '/api/projects') {
        if (method === 'GET') {
          const search = url.searchParams.get('search') || undefined;
          const category = url.searchParams.get('category') || undefined;
          const status = url.searchParams.get('status') || undefined;
          const result = getDemoProjects(search, category, status);
          return mockResponse(result);
        }

        if (method === 'POST') {
          const body = init?.body ? JSON.parse(init.body as string) : {};
          const created = createDemoProject(body, currentUser.id);
          showDemoToast(
            `Demo Action: Sample project "${created.title}" created in demo state!`,
            'success'
          );
          return mockResponse({ project: created }, 201);
        }
      }

      // 4. Project Matches: /api/projects/:id/matches
      const matchProjectRegex = /^\/api\/projects\/([^/]+)\/matches$/;
      const matchProjectMatch = pathname.match(matchProjectRegex);
      if (matchProjectMatch && method === 'GET') {
        const pId = matchProjectMatch[1];
        const matches = calculateProjectMatches(pId);
        return mockResponse({ matches });
      }

      // 5. Project Progress: /api/dashboard/:id
      const matchProgressRegex = /^\/api\/dashboard\/([^/]+)$/;
      const matchProgressMatch = pathname.match(matchProgressRegex);
      if (matchProgressMatch && method === 'GET' && matchProgressMatch[1] !== 'student') {
        const pId = matchProgressMatch[1];
        const progress = getDemoProjectProgress(pId);
        if (progress) return mockResponse(progress);
      }

      // 6. Project Details: /api/projects/:id
      const matchProjectDetailsRegex = /^\/api\/projects\/([^/]+)$/;
      const matchProjectDetailsMatch = pathname.match(matchProjectDetailsRegex);
      if (matchProjectDetailsMatch && method === 'GET') {
        const pId = matchProjectDetailsMatch[1];
        const project = getDemoProjectById(pId);
        if (project) {
          return mockResponse({ project });
        }
      }

      // 7. Tasks: /api/tasks and /api/tasks/:id
      if (pathname === '/api/tasks' && method === 'POST') {
        const body = init?.body ? JSON.parse(init.body as string) : {};
        const newTask = createDemoTask(body);
        showDemoToast(
          `Demo Action: Task "${newTask.title}" added to Kanban board!`,
          'success'
        );
        return mockResponse({ task: newTask }, 201);
      }

      const matchTaskRegex = /^\/api\/tasks\/([^/]+)$/;
      const matchTaskMatch = pathname.match(matchTaskRegex);
      if (matchTaskMatch) {
        const taskId = matchTaskMatch[1];
        if (method === 'PATCH') {
          const body = init?.body ? JSON.parse(init.body as string) : {};
          const updated = updateDemoTask(taskId, body);
          if (body.status) {
            showDemoToast(
              `Demo Action: Task status updated to "${body.status}" (simulated in demo session)`,
              'info'
            );
          } else {
            showDemoToast('Demo Action: Task updated in demo state', 'info');
          }
          return mockResponse({ task: updated });
        }
        if (method === 'DELETE') {
          deleteDemoTask(taskId);
          showDemoToast('Demo Action: Task deleted in demo session', 'info');
          return mockResponse({ ok: true });
        }
      }

      // 8. Collaboration Requests: /api/collaboration-requests
      if (pathname === '/api/collaboration-requests') {
        if (method === 'GET') {
          const reqs = getDemoCollaborationRequests(currentUser.id);
          return mockResponse(reqs);
        }
        if (method === 'POST') {
          const body = init?.body ? JSON.parse(init.body as string) : {};
          const createdReq = sendDemoCollaborationRequest(currentUser.id, body);
          showDemoToast(
            `Demo Action: Collaboration request simulated for "${createdReq.project.title}" (no real email sent).`,
            'success'
          );
          return mockResponse({ request: createdReq }, 201);
        }
      }

      // /api/collaboration-requests/:id (PATCH)
      const matchReqRegex = /^\/api\/collaboration-requests\/([^/]+)$/;
      const matchReqMatch = pathname.match(matchReqRegex);
      if (matchReqMatch && method === 'PATCH') {
        const reqId = matchReqMatch[1];
        const body = init?.body ? JSON.parse(init.body as string) : {};
        const updatedReq = updateDemoCollaborationRequest(reqId, body.status);
        if (body.status === 'ACCEPTED') {
          showDemoToast(
            'Demo Action: Request accepted! Student added to project team (simulated in demo session).',
            'success'
          );
        } else {
          showDemoToast(
            `Demo Action: Request marked as ${body.status} (simulated).`,
            'info'
          );
        }
        return mockResponse({ request: updatedReq });
      }

      // 9. Profile: /api/profile
      if (pathname === '/api/profile') {
        const queryUserId = url.searchParams.get('userId');
        const targetUser = queryUserId ? (getDemoUserById(queryUserId) || currentUser) : currentUser;
        return mockResponse({ user: targetUser });
      }

      // 10. Notifications: /api/notifications
      if (pathname === '/api/notifications') {
        if (method === 'GET') {
          const notifs = getDemoNotifications(currentUser.id);
          return mockResponse(notifs);
        }
        if (method === 'PATCH') {
          markDemoNotificationsAsRead(currentUser.id);
          showDemoToast('Demo Action: All notifications marked as read', 'info');
          return mockResponse({ ok: true });
        }
      }

      const matchNotifRegex = /^\/api\/notifications\/([^/]+)$/;
      const matchNotifMatch = pathname.match(matchNotifRegex);
      if (matchNotifMatch && method === 'PATCH') {
        const notifId = matchNotifMatch[1];
        markDemoNotificationsAsRead(currentUser.id, notifId);
        return mockResponse({ ok: true });
      }

      // 11. GitHub endpoints in demo mode
      if (pathname === '/api/github/connect' && method === 'POST') {
        const body = init?.body ? JSON.parse(init.body as string) : {};
        showDemoToast('Demo Action: GitHub repository connected (simulated read-only sync).', 'success');
        return mockResponse({
          details: {
            owner: 'karthik-rao-dev',
            name: 'smart-campus-navigation',
            fullName: 'karthik-rao-dev/smart-campus-navigation',
            description: 'Autonomous indoor and outdoor campus navigation web system.',
            githubUrl: body.githubUrl || 'https://github.com/karthik-rao-dev/smart-campus-navigation',
            stars: 24,
            forks: 8,
            openIssues: 2,
            watchers: 15,
            language: 'TypeScript',
            defaultBranch: 'main',
            lastUpdated: new Date().toISOString(),
            isMock: true,
            topics: ['nextjs', 'typescript', 'tailwind'],
            recentCommits: [
              { sha: '7f9a12c', message: 'feat: add A* pathfinding algorithm for room navigation', author: 'Karthik Rao', date: '3 hours ago' },
              { sha: '4b3d89e', message: 'style: finalize responsive campus map viewport layout', author: 'Ananya Verma', date: '1 day ago' },
              { sha: '1e6f54a', message: 'chore: configure Prisma migrations for floor nodes', author: 'Rohan Patel', date: '2 days ago' },
            ],
          },
        });
      }

      // 12. Team Member Management: /api/teams/:teamId/members
      const matchTeamMemberRegex = /^\/api\/teams\/([^/]+)\/members$/;
      if (matchTeamMemberRegex.test(pathname) && method === 'DELETE') {
        showDemoToast('Demo Action: Team member removed (simulated in demo session).', 'info');
        return mockResponse({ ok: true });
      }

      // 11. Admin Endpoints: /api/admin/...
      if (pathname === '/api/admin/stats' && method === 'GET') {
        const stats = getDemoAdminStats();
        return mockResponse(stats);
      }

      if (pathname === '/api/admin/users') {
        if (method === 'GET') {
          const search = url.searchParams.get('search') || undefined;
          const userRole = url.searchParams.get('role') || undefined;
          const status = url.searchParams.get('status') || undefined;
          const usersResult = getDemoAdminUsers(search, userRole, status);
          return mockResponse(usersResult);
        }
        if (method === 'PATCH') {
          const body = init?.body ? JSON.parse(init.body as string) : {};
          const updated = toggleDemoUserActive(body.userId, body.isActive);
          showDemoToast(
            `Demo Action: User ${body.isActive ? 'activated' : 'deactivated'} (simulated sandbox - database untouched).`,
            'info'
          );
          return mockResponse({ user: updated });
        }
      }

      if (pathname === '/api/admin/projects') {
        if (method === 'GET') {
          const search = url.searchParams.get('search') || undefined;
          const cat = url.searchParams.get('category') || undefined;
          const stat = url.searchParams.get('status') || undefined;
          const res = getDemoAdminProjects(search, cat, stat);
          return mockResponse(res);
        }
        if (method === 'PATCH') {
          const body = init?.body ? JSON.parse(init.body as string) : {};
          showDemoToast(`Demo Action: Project status changed to "${body.status}" (simulated sandbox).`, 'info');
          return mockResponse({ ok: true });
        }
        if (method === 'DELETE') {
          showDemoToast('Demo Action: Project removed (simulated sandbox - database unchanged).', 'info');
          return mockResponse({ ok: true });
        }
      }

      if (pathname === '/api/admin/skills') {
        if (method === 'GET') {
          const res = getDemoAdminSkills();
          return mockResponse(res);
        }
        if (method === 'POST') {
          const body = init?.body ? JSON.parse(init.body as string) : {};
          const newSkill = createDemoAdminSkill(body.name, body.category);
          showDemoToast(`Demo Action: Skill "${newSkill.name}" added in demo state!`, 'success');
          return mockResponse({ skill: newSkill }, 201);
        }
        if (method === 'PATCH') {
          showDemoToast('Demo Action: Skill updated in taxonomy (simulated).', 'info');
          return mockResponse({ ok: true });
        }
        if (method === 'DELETE') {
          showDemoToast('Demo Action: Skill deleted from taxonomy (simulated).', 'info');
          return mockResponse({ ok: true });
        }
      }

      if (pathname === '/api/admin/reports') {
        if (method === 'GET') {
          const res = getDemoAdminReports();
          return mockResponse(res);
        }
        if (method === 'PATCH') {
          const body = init?.body ? JSON.parse(init.body as string) : {};
          const reportId = body.id || body.reportId;
          const res = resolveDemoAdminReport(reportId, body.status);
          showDemoToast(`Demo Action: Report marked as ${body.status} (simulated sandbox).`, 'info');
          return mockResponse({ report: res });
        }
      }

      // Default fallback for any other api route
      return originalFetch!.call(window, input, init);
    } catch (err: any) {
      console.error('Demo Interceptor error:', err);
      return originalFetch!.call(window, input, init);
    }
  };
}
