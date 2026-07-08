import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET: List all game saves or get a specific save by id
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (id) {
      const save = await prisma.gameSave.findUnique({
        where: { id },
        include: {
          nationState: true,
          factions: true,
          newsItems: { orderBy: { createdAt: 'desc' } },
          timeline: { orderBy: { createdAt: 'desc' } },
          diplomacy: true,
        },
      });
      if (!save) return NextResponse.json({ error: 'Save not found' }, { status: 404 });
      return NextResponse.json({ success: true, gameSave: save });
    }

    const saves = await prisma.gameSave.findMany({
      orderBy: { updatedAt: 'desc' },
      include: {
        nationState: true,
      },
    });

    return NextResponse.json({ success: true, saves });
  } catch (err: any) {
    console.error('Error fetching saves:', err);
    return NextResponse.json({ error: err.message || 'Failed to fetch saves' }, { status: 500 });
  }
}

// DELETE: Delete a save game
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    await prisma.gameSave.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Error deleting save:', err);
    return NextResponse.json({ error: err.message || 'Failed to delete save' }, { status: 500 });
  }
}
