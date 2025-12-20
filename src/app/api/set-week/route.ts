import { NextResponse } from 'next/server';
import { setCurrentWeek } from '@/app/actions';

export async function POST(request: Request) {
  try {
    const { week } = await request.json();

    if (!week || week < 1 || week > 16) {
      return NextResponse.json(
        { success: false, error: 'Week must be between 1 and 16' },
        { status: 400 }
      );
    }

    await setCurrentWeek(week);
    return NextResponse.json({ success: true, message: `Current week set to ${week}` });
  } catch (error) {
    console.error('Set week error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to set week' },
      { status: 500 }
    );
  }
}
