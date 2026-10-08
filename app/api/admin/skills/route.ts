import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthFromRequest } from '@/lib/auth/jwt';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const auth = getAuthFromRequest(req);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized: Authentication required.' }, { status: 401 });
    }
    if (auth.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden: Admin access only.' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    const where: any = {};
    if (category && category !== 'ALL') {
      where.category = category;
    }
    if (search) {
      where.name = { contains: search };
    }

    const skills = await prisma.skill.findMany({
      where,
      include: {
        _count: {
          select: { studentSkills: true, projectSkills: true },
        },
      },
      orderBy: [{ category: 'asc' }, { name: 'asc' }],
    });

    return NextResponse.json({ skills });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = getAuthFromRequest(req);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized: Authentication required.' }, { status: 401 });
    }
    if (auth.role !== 'ADMIN') {
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
      return NextResponse.json({ error: `Skill "${cleanName}" already exists in the registry.` }, { status: 409 });
    }

    const skill = await prisma.skill.create({
      data: {
        name: cleanName,
        category: category.trim(),
      },
    });

    return NextResponse.json({ skill, message: 'Skill registered successfully' }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const auth = getAuthFromRequest(req);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized: Authentication required.' }, { status: 401 });
    }
    if (auth.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden: Admin access only.' }, { status: 403 });
    }

    const { id, name, category } = await req.json();
    if (!id) {
      return NextResponse.json({ error: 'Skill ID is required' }, { status: 400 });
    }

    const updated = await prisma.skill.update({
      where: { id },
      data: {
        ...(name && { name: name.trim() }),
        ...(category && { category: category.trim() }),
      },
    });

    return NextResponse.json({ skill: updated, message: 'Skill updated successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const auth = getAuthFromRequest(req);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized: Authentication required.' }, { status: 401 });
    }
    if (auth.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden: Admin access only.' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Skill ID is required' }, { status: 400 });
    }

    await prisma.skill.delete({ where: { id } });

    return NextResponse.json({ message: 'Skill removed from taxonomy.' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
