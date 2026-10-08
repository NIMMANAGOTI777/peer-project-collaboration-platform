import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthFromRequest } from '@/lib/auth/jwt';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const project = await prisma.project.findUnique({
      where: { id },
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
                  select: {
                    id: true,
                    name: true,
                    email: true,
                    profile: true,
                    studentSkills: { include: { skill: true } },
                  },
                },
              },
            },
          },
        },
        tasks: {
          include: {
            assignee: {
              select: { id: true, name: true, profile: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        repository: true,
        requests: {
          include: {
            sender: { select: { id: true, name: true, profile: true } },
          },
        },
      },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json({ project });
  } catch (error: any) {
    console.error('Error fetching project details:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = getAuthFromRequest(req);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const existing = await prisma.project.findUnique({
      where: { id },
      include: { team: { include: { members: true } } },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Owner or admin can edit
    const isOwner = existing.ownerId === auth.id;
    const isAdmin = auth.role === 'ADMIN';

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { error: 'Forbidden: Only the project owner or admin can edit this project.' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { title, description, category, status, preferredTeamSize, skills } = body;

    await prisma.project.update({
      where: { id },
      data: {
        ...(title && { title: title.trim() }),
        ...(description && { description: description.trim() }),
        ...(category && { category: category.trim() }),
        ...(status && { status }),
        ...(preferredTeamSize && { preferredTeamSize: parseInt(preferredTeamSize, 10) }),
      },
    });

    if (Array.isArray(skills)) {
      await prisma.projectSkill.deleteMany({
        where: { projectId: id },
      });

      for (const s of skills) {
        if (!s.name) continue;
        const skillName = s.name.trim();

        let skillRecord = await prisma.skill.findUnique({
          where: { name: skillName },
        });
        if (!skillRecord) {
          skillRecord = await prisma.skill.create({
            data: { name: skillName, category: 'General' },
          });
        }

        await prisma.projectSkill.create({
          data: {
            projectId: id,
            skillId: skillRecord.id,
            requiredLevel: s.requiredLevel || 'INTERMEDIATE',
          },
        });
      }
    }

    const updated = await prisma.project.findUnique({
      where: { id },
      include: {
        owner: { select: { id: true, name: true, profile: true } },
        projectSkills: { include: { skill: true } },
        team: { include: { members: true } },
        repository: true,
      },
    });

    return NextResponse.json({ project: updated, message: 'Project updated successfully' });
  } catch (error: any) {
    console.error('Error updating project:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = getAuthFromRequest(req);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const existing = await prisma.project.findUnique({ where: { id } });

    if (!existing) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    if (existing.ownerId !== auth.id && auth.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden: You do not have permission to delete this project.' },
        { status: 403 }
      );
    }

    await prisma.project.delete({ where: { id } });

    return NextResponse.json({ message: 'Project deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting project:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
