import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { seedDatabase } from '@/lib/seed';

// POST /api/admin/seed — force seed the database
export async function POST() {
  try {
    await connectDB();
    const result = await seedDatabase();
    return NextResponse.json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Seed failed';
    console.error('Seed error:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}