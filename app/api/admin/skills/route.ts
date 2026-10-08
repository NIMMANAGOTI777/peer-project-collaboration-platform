import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthFromRequest } from '@/lib/auth/jwt';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const auth = getAuthFromRequest(req);
    if (!auth || auth.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden: Admin access only.' }, { status: 403 });
    }

    const skills = await prisma.skill.findMany({
      include: {
        _count: {
          select: { studentSkills: true, projectSkills: true },
        },
      },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({ skills });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = getAuthFromRequest(req);
    if (!auth || auth.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden: Admin access only.' }, { status: 403 });
    }

    const { name, category } = await req.json();
    if (!name || !category) {
      return NextResponse.json({ error: 'Skill name and category are required' }, { status: 400 });
    }

    const cleanName = name.trim();
    const existing = await prisma.skill.findUnique({
      where: { name: cleanName },
    });

    if (existing) {
      return NextResponse.json({ error: 'Skill already exists' }, { status: 409 });
    }

    const skill = await prisma.skill.create({
      data: {
        name: cleanName,
        category: category.trim(),
      },
    });

    return NextResponse.json({ skill, message: 'Skill created successfully' }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const auth = getAuthFromRequest(req);
    if (!auth || auth.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden: Admin access only.' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Skill ID is required' }, { status: 400 });
    }

    await prisma.skill.delete({ where: { id } });

    return NextResponse.json({ message: 'Skill deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
