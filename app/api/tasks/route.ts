import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { createTaskSchema } from '@/lib/validations';

// GET all tasks for current user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const tasks = await db.task.findMany({
      where: { userId: session.user.id },
      orderBy: [
        { status: 'asc' },
        { order: 'asc' },
        { createdAt: 'desc' },
      ],
    });

    return NextResponse.json(tasks);
  } catch (error) {
    console.error('GET tasks error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}

// POST create new task
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { title, description, priority } = createTaskSchema.parse(body);

    // Get the highest order number for todo tasks
    const highestOrderTask = await db.task.findFirst({
      where: {
        userId: session.user.id,
        status: 'todo',
      },
      orderBy: { order: 'desc' },
    });

    const task = await db.task.create({
      data: {
        title,
        description,
        priority,
        status: 'todo',
        order: (highestOrderTask?.order ?? -1) + 1,
        userId: session.user.id,
      },
    });

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error('POST task error:', error);
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    );
  }
}