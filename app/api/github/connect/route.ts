import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthFromRequest } from '@/lib/auth/jwt';
import { fetchGitHubRepo, parseGitHubUrl } from '@/lib/github/githubService';

export async function POST(req: NextRequest) {
  try {
    const auth = getAuthFromRequest(req);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { projectId, githubUrl } = body;

    if (!projectId || !githubUrl) {
      return NextResponse.json(
        { error: 'Project ID and GitHub URL are required.' },
        { status: 400 }
      );
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { team: { include: { members: true } } },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const isMember =
      project.team?.members.some((m) => m.userId === auth.id) ||
      project.ownerId === auth.id;

    if (!isMember && auth.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden: You must be a project team member to connect GitHub repository.' },
        { status: 403 }
      );
    }

    // Fetch repository data from GitHub REST API (or fallback mock)
    const repoDetails = await fetchGitHubRepo(githubUrl);

    const repository = await prisma.repository.upsert({
      where: { projectId },
      create: {
        projectId,
        githubUrl: repoDetails.githubUrl,
        owner: repoDetails.owner,
        name: repoDetails.name,
        description: repoDetails.description,
        stars: repoDetails.stars,
        forks: repoDetails.forks,
        language: repoDetails.language,
        lastUpdated: new Date(repoDetails.lastUpdated),
      },
      update: {
        githubUrl: repoDetails.githubUrl,
        owner: repoDetails.owner,
        name: repoDetails.name,
        description: repoDetails.description,
        stars: repoDetails.stars,
        forks: repoDetails.forks,
        language: repoDetails.language,
        lastUpdated: new Date(repoDetails.lastUpdated),
      },
    });

    // Notify project members
    await prisma.notification.create({
      data: {
        userId: auth.id,
        type: 'GITHUB_CONNECTED',
        message: `GitHub repository ${repoDetails.fullName} connected successfully to ${project.title}.`,
        link: `/projects/${projectId}/github`,
      },
    });

    return NextResponse.json({
      repository,
      details: repoDetails,
      message: 'GitHub repository connected successfully!',
    });
  } catch (error: any) {
    console.error('Error connecting GitHub repository:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
