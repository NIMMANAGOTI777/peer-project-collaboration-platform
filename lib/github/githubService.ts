export interface GitHubRepoDetails {
  owner: string;
  name: string;
  fullName: string;
  description: string;
  githubUrl: string;
  stars: number;
  forks: number;
  openIssues: number;
  watchers: number;
  language: string;
  defaultBranch: string;
  lastUpdated: string;
  isMock: boolean;
  topics?: string[];
  recentCommits?: {
    sha: string;
    message: string;
    author: string;
    date: string;
  }[];
}

export function parseGitHubUrl(url: string): { owner: string; name: string } | null {
  if (!url) return null;
  const cleanUrl = url.trim().replace(/\/$/, '');
  
  // Format: https://github.com/owner/name or github.com/owner/name or owner/name
  const match = cleanUrl.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+)/i)
    || cleanUrl.match(/^([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+)$/);

  if (match) {
    return {
      owner: match[1],
      name: match[2].replace(/\.git$/, ''),
    };
  }
  return null;
}

export async function fetchGitHubRepo(urlOrRepo: string): Promise<GitHubRepoDetails> {
  const parsed = parseGitHubUrl(urlOrRepo);
  const owner = parsed?.owner || 'campus-collab';
  const name = parsed?.name || 'smart-campus-nav';

  const token = process.env.GITHUB_TOKEN;
  const headers: HeadersInit = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'Peer-Project-Collab-Platform',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`https://api.github.com/repos/${owner}/${name}`, {
      headers,
      next: { revalidate: 300 },
    });

    if (res.ok) {
      const data = await res.json();
      
      // Optionally fetch recent commits
      let recentCommits = [];
      try {
        const commitsRes = await fetch(`https://api.github.com/repos/${owner}/${name}/commits?per_page=5`, {
          headers,
        });
        if (commitsRes.ok) {
          const commitsData = await commitsRes.json();
          recentCommits = commitsData.map((c: any) => ({
            sha: c.sha.substring(0, 7),
            message: c.commit.message.split('\n')[0],
            author: c.commit.author?.name || c.author?.login || 'Contributor',
            date: c.commit.author?.date || new Date().toISOString(),
          }));
        }
      } catch (e) {
        // non-blocking
      }

      return {
        owner: data.owner.login,
        name: data.name,
        fullName: data.full_name,
        description: data.description || 'Academic peer collaboration project repository.',
        githubUrl: data.html_url,
        stars: data.stargazers_count,
        forks: data.forks_count,
        openIssues: data.open_issues_count,
        watchers: data.watchers_count,
        language: data.language || 'TypeScript',
        defaultBranch: data.default_branch || 'main',
        lastUpdated: data.updated_at,
        isMock: false,
        topics: data.topics || ['nextjs', 'btech-project', 'collaboration', 'react'],
        recentCommits: recentCommits.length > 0 ? recentCommits : undefined,
      };
    }
  } catch (error) {
    console.warn(`[GitHub API] Live fetch error for ${owner}/${name}, falling back to mock provider:`, error);
  }

  // Fallback demo/mock data with clear flag
  return {
    owner,
    name,
    fullName: `${owner}/${name}`,
    description: `Peer collaboration repository for ${name}. Includes full source code, architecture designs, API specifications, and task tracking.`,
    githubUrl: `https://github.com/${owner}/${name}`,
    stars: 18,
    forks: 6,
    openIssues: 3,
    watchers: 12,
    language: 'TypeScript',
    defaultBranch: 'main',
    lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
    isMock: true,
    topics: ['peer-collab', 'nextjs', 'typescript', 'btech-cse', 'tailwind'],
    recentCommits: [
      {
        sha: '7f9a2b1',
        message: 'feat: implement interactive Kanban task board and assignee filter',
        author: 'Karthik Rao',
        date: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
      },
      {
        sha: 'e4d8c12',
        message: 'refactor: optimize matching algorithm with explainable breakdown',
        author: 'Ananya Sharma',
        date: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
      },
      {
        sha: '2b91c89',
        message: 'feat: add GitHub REST API sync and real-time dashboard stats',
        author: 'Rohan Patel',
        date: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
      },
      {
        sha: 'a10b4f5',
        message: 'chore: configure Prisma database schema and migrations',
        author: 'Karthik Rao',
        date: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
      },
    ],
  };
}
