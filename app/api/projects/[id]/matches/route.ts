import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { rankCandidatesForProject, CandidateStudent, TargetProject } from '@/lib/matching';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Fetch target project with required skills
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
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

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Existing team member user IDs
    const currentMemberIds = new Set(
      project.team?.members.map((m) => m.userId) || [project.ownerId]
    );

    // Fetch candidate students (excluding current team members & admin)
    const students = await prisma.user.findMany({
      where: {
        role: 'STUDENT',
        isActive: true,
        id: {
          notIn: Array.from(currentMemberIds),
        },
      },
      include: {
        profile: true,
        studentSkills: {
          include: { skill: true },
        },
      },
    });

    const targetProject: TargetProject = {
      id: project.id,
      title: project.title,
      description: project.description,
      category: project.category,
      requiredSkills: project.projectSkills.map((ps) => ({
        id: ps.skill.id,
        name: ps.skill.name,
        proficiency: ps.requiredLevel,
      })),
    };

    const candidates: CandidateStudent[] = students.map((s) => ({
      userId: s.id,
      name: s.name,
      email: s.email,
      bio: s.profile?.bio,
      avatarUrl: s.profile?.avatarUrl,
      githubUsername: s.profile?.githubUsername,
      department: s.profile?.department,
      year: s.profile?.year,
      interests: s.profile?.interests,
      availability: s.profile?.availability,
      experience: s.profile?.experience,
      skills: s.studentSkills.map((sk) => ({
        id: sk.skill.id,
        name: sk.skill.name,
        proficiency: sk.proficiency,
      })),
    }));

    const rankedMatches = rankCandidatesForProject(candidates, targetProject);

    return NextResponse.json({
      projectId: project.id,
      projectTitle: project.title,
      requiredSkills: targetProject.requiredSkills,
      matches: rankedMatches,
    });
  } catch (error: any) {
    console.error('Error computing project matches:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
