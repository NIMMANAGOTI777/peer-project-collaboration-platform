import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthFromRequest } from '@/lib/auth/jwt';

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
    const body = await req.json();
    const { status } = body; // ACCEPTED, REJECTED, CANCELLED

    const request = await prisma.collaborationRequest.findUnique({
      where: { id },
      include: {
        project: {
          include: {
            team: true,
          },
        },
        sender: { select: { id: true, name: true } },
        receiver: { select: { id: true, name: true } },
      },
    });

    if (!request) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    // Only receiver can accept/reject, or sender can cancel
    if (status === 'ACCEPTED' || status === 'REJECTED') {
      if (request.receiverId !== auth.id && request.project.ownerId !== auth.id && auth.role !== 'ADMIN') {
        return NextResponse.json(
          { error: 'Forbidden: Only the recipient can accept or reject this request.' },
          { status: 403 }
        );
      }
    } else if (status === 'CANCELLED') {
      if (request.senderId !== auth.id && auth.role !== 'ADMIN') {
        return NextResponse.json(
          { error: 'Forbidden: Only the sender can cancel this request.' },
          { status: 403 }
        );
      }
    }

    if (status === 'ACCEPTED') {
      // Find or create team for the project
      let team = request.project.team;
      if (!team) {
        team = await prisma.team.create({
          data: {
            projectId: request.projectId,
            status: 'ACTIVE',
            members: {
              create: [{ userId: request.project.ownerId, role: 'OWNER' }],
            },
          },
        });
      }

      // Add student to the team (sender or receiver depending on who was invited)
      const newMemberUserId = request.senderId === request.project.ownerId ? request.receiverId : request.senderId;

      const existingMember = await prisma.teamMember.findUnique({
        where: {
          teamId_userId: {
            teamId: team.id,
            userId: newMemberUserId,
          },
        },
      });

      if (!existingMember) {
        await prisma.teamMember.create({
          data: {
            teamId: team.id,
            userId: newMemberUserId,
            role: 'MEMBER',
          },
        });
      }

      // Update team status to ACTIVE if forming
      await prisma.team.update({
        where: { id: team.id },
        data: { status: 'ACTIVE' },
      });

      // Update request status
      const updated = await prisma.collaborationRequest.update({
        where: { id },
        data: { status: 'ACCEPTED' },
      });

      // Notify the applicant / sender
      await prisma.notification.create({
        data: {
          userId: request.senderId,
          type: 'REQUEST_ACCEPTED',
          message: `Your collaboration request for "${request.project.title}" has been accepted! You are now a team member.`,
          link: `/projects/${request.projectId}/team`,
        },
      });

      return NextResponse.json({
        request: updated,
        message: 'Collaboration request accepted and team member added successfully!',
      });
    }

    // For REJECTED
    const updated = await prisma.collaborationRequest.update({
      where: { id },
      data: { status: status === 'CANCELLED' ? 'REJECTED' : status },
    });

    if (status === 'REJECTED') {
      await prisma.notification.create({
        data: {
          userId: request.senderId,
          type: 'REQUEST_REJECTED',
          message: `Your collaboration request for "${request.project.title}" was declined.`,
          link: `/projects/${request.projectId}`,
        },
      });
    }

    return NextResponse.json({
      request: updated,
      message: `Collaboration request marked as ${status.toLowerCase()}.`,
    });
  } catch (error: any) {
    console.error('Error updating collaboration request:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
