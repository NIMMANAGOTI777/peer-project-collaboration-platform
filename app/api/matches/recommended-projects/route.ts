import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthFromRequest } from '@/lib/auth/jwt';
import { rankProjectsForCandidate, CandidateStudent, TargetProject } from '@/lib/matching';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const auth = getAuthFromRequest(req);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: auth.id },
      include: {
        profile: true,
        studentSkills: { include: { skill: true } },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const candidate: CandidateStudent = {
      userId: user.id,
      name: user.name,
      email: user.email,
      bio: user.profile?.bio,
      avatarUrl: user.profile?.avatarUrl,
      githubUsername: user.profile?.githubUsername,
      department: user.profile?.department,
      year: user.profile?.year,
      interests: user.profile?.interests,
      availability: user.profile?.availability,
      experience: user.profile?.experience,
      skills: user.studentSkills.map((sk) => ({
        id: sk.skill.id,
        name: sk.skill.name,
        proficiency: sk.proficiency,
      })),
    };

    // Find open projects not owned by this student
    const projects = await prisma.project.findMany({
      where: {
        ownerId: { not: user.id },
        status: { in: ['OPEN', 'IN_PROGRESS'] },
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            profile: true,
          },
        },
        projectSkills: {
          include: { skill: true },
        },
        team: {
          include: {
            members: true,
          },
        },
      },
    });

    const targetProjects: TargetProject[] = projects.map((p) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      category: p.category,
      requiredSkills: p.projectSkills.map((ps) => ({
        id: ps.skill.id,
        name: ps.skill.name,
        proficiency: ps.requiredLevel,
      })),
    }));

    const ranked = rankProjectsForCandidate(candidate, targetProjects);

    // Map back with full project metadata
    const projectMap = new Map(projects.map((p) => [p.id, p]));
    const result = ranked.map((r) => {
      const full = projectMap.get(r.id);
      return {
        ...full,
        match: r.match,
      };
    });

    return NextResponse.json({ recommendations: result });
  } catch (error: any) {
    console.error('Error fetching recommended projects:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
