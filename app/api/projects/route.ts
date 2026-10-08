import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthFromRequest } from '@/lib/auth/jwt';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const skill = searchParams.get('skill') || '';
    const status = searchParams.get('status') || '';
    const teamSize = searchParams.get('teamSize');

    const where: any = {};

    if (category && category !== 'ALL') {
      where.category = category;
    }

    if (status && status !== 'ALL') {
      where.status = status;
    }

    if (teamSize && teamSize !== 'ALL') {
      where.preferredTeamSize = parseInt(teamSize, 10);
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { category: { contains: search } },
      ];
    }

    if (skill && skill !== 'ALL') {
      where.projectSkills = {
        some: {
          skill: {
            name: { contains: skill },
          },
        },
      };
    }

    const projects = await prisma.project.findMany({
      where,
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
            members: {
              include: {
                user: {
                  select: { id: true, name: true, profile: true },
                },
              },
            },
          },
        },
        _count: {
          select: { tasks: true, requests: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ projects });
  } catch (error: any) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = getAuthFromRequest(req);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized. Please login to create a project.' }, { status: 401 });
    }

    const body = await req.json();
    const {
      title,
      description,
      category,
      preferredTeamSize,
      status,
      skills, // array of { name: string, requiredLevel?: string }
      githubUrl,
    } = body;

    if (!title || !description || !category) {
      return NextResponse.json(
        { error: 'Title, description, and category are required.' },
        { status: 400 }
      );
    }

    const teamSize = preferredTeamSize ? parseInt(preferredTeamSize, 10) : 4;

    const project = await prisma.project.create({
      data: {
        ownerId: auth.id,
        title: title.trim(),
        description: description.trim(),
        category: category.trim(),
        status: status || 'OPEN',
        preferredTeamSize: teamSize,
        team: {
          create: {
            status: 'FORMING',
            members: {
              create: [
                {
                  userId: auth.id,
                  role: 'OWNER',
                },
              ],
            },
          },
        },
      },
    });

    // Create ProjectSkill records
    if (Array.isArray(skills) && skills.length > 0) {
      for (const s of skills) {
        if (!s.name) continue;
        const skillName = s.name.trim();

        let skillRecord = await prisma.skill.findUnique({
          where: { name: skillName },
        });
        if (!skillRecord) {
          skillRecord = await prisma.skill.create({
            data: {
              name: skillName,
              category: 'General',
            },
          });
        }

        await prisma.projectSkill.create({
          data: {
            projectId: project.id,
            skillId: skillRecord.id,
            requiredLevel: s.requiredLevel || 'INTERMEDIATE',
          },
        });
      }
    }

    // Connect GitHub repo if provided
    if (githubUrl && githubUrl.trim()) {
      const cleanUrl = githubUrl.trim();
      const parts = cleanUrl.split('/').filter(Boolean);
      const name = parts[parts.length - 1]?.replace('.git', '') || 'repo';
      const owner = parts[parts.length - 2] || 'student';

      await prisma.repository.create({
        data: {
          projectId: project.id,
          githubUrl: cleanUrl,
          owner,
          name,
          description: `Repository for ${project.title}`,
          language: 'TypeScript',
        },
      });
    }

    const fullProject = await prisma.project.findUnique({
      where: { id: project.id },
      include: {
        owner: { select: { id: true, name: true, profile: true } },
        projectSkills: { include: { skill: true } },
        team: { include: { members: true } },
      },
    });

    return NextResponse.json({ project: fullProject, message: 'Project created successfully' }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating project:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
