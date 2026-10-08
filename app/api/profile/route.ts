import { NextRequest, NextResponse } from 'next/server';
import { getAuthFromRequest } from '@/lib/auth/jwt';
import { prisma } from '@/lib/prisma';

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
        studentSkills: {
          include: { skill: true },
        },
        ownedProjects: {
          include: {
            projectSkills: { include: { skill: true } },
            team: { include: { members: true } },
          },
        },
        teamMemberships: {
          include: {
            team: {
              include: {
                project: {
                  include: {
                    owner: { select: { id: true, name: true, email: true } },
                  },
                },
                members: {
                  include: {
                    user: { select: { id: true, name: true, email: true, profile: true } },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error: any) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const auth = getAuthFromRequest(req);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const {
      name,
      bio,
      interests,
      availability,
      experience,
      department,
      year,
      githubUsername,
      avatarUrl,
      skills, // array of { name: string, proficiency: string }
    } = body;

    // Update user name if provided
    if (name) {
      await prisma.user.update({
        where: { id: auth.id },
        data: { name: name.trim() },
      });
    }

    // Upsert StudentProfile
    await prisma.studentProfile.upsert({
      where: { userId: auth.id },
      create: {
        userId: auth.id,
        bio,
        interests,
        availability,
        experience,
        department,
        year,
        githubUsername,
        avatarUrl,
      },
      update: {
        bio,
        interests,
        availability,
        experience,
        department,
        year,
        githubUsername,
        avatarUrl,
      },
    });

    // Update skills if provided
    if (Array.isArray(skills)) {
      // Clear existing student skills
      await prisma.studentSkill.deleteMany({
        where: { userId: auth.id },
      });

      for (const item of skills) {
        if (!item.name) continue;
        const skillName = item.name.trim();
        // find or create skill
        let skillRecord = await prisma.skill.findUnique({
          where: { name: skillName },
        });
        if (!skillRecord) {
          skillRecord = await prisma.skill.create({
            data: {
              name: skillName,
              category: item.category || 'General',
            },
          });
        }

        await prisma.studentSkill.create({
          data: {
            userId: auth.id,
            skillId: skillRecord.id,
            proficiency: item.proficiency || 'INTERMEDIATE',
          },
        });
      }
    }

    const updatedUser = await prisma.user.findUnique({
      where: { id: auth.id },
      include: {
        profile: true,
        studentSkills: {
          include: { skill: true },
        },
      },
    });

    return NextResponse.json({
      message: 'Profile updated successfully',
      user: updatedUser,
    });
  } catch (error: any) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
