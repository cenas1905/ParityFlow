import { createServerSupabase } from '@/lib/supabase';
import { NextResponse, NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const supabase = createServerSupabase();
    const { projectId, countryCode, eventType } = await req.json();

    if (!projectId || !countryCode || !eventType) {
      return NextResponse.json({ error: 'Missing params' }, { status: 400 });
    }

    if (!['impression', 'click'].includes(eventType)) {
      return NextResponse.json({ error: 'Invalid event type' }, { status: 400 });
    }

    const { error } = (await supabase.from('analytics').insert({
      project_id: projectId,
      country_code: countryCode.toUpperCase(),
      event_type: eventType,
      user_agent: req.headers.get('user-agent') || null,
    } as unknown as never)) as unknown as { error: Error | null };

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Analytics error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// CORS preflight icin OPTIONS
export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
