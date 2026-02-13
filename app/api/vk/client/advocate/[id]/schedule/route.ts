import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/vk-auth-middleware';
import { createServerClient } from '@/lib/supabase';

const supabase = createServerClient();

export const GET = withAuth(async (request, context) => {
  try {
    const pathSegments = request.nextUrl.pathname.split('/');
    const idIndex = pathSegments.indexOf('advocate') + 1;
    const idParam = pathSegments[idIndex];
    const advocateId = idParam ? parseInt(idParam, 10) : NaN;
    
    if (isNaN(advocateId)) {
      return NextResponse.json(
        { error: 'Invalid advocate ID' },
        { status: 400 }
      );
    }

    // Parse query parameters for date range
    const { searchParams } = new URL(request.url);
    const from = searchParams.get('from');
    const to = searchParams.get('to');

    // Build query for scheduled calls
    let query = supabase
      .from('calls')
      .select('*')
      .eq('receiver_id', advocateId)
      .eq('receiver_type', 'advocate')
      .in('status', ['initiated', 'accepted']);

    if (from) {
      query = query.gte('scheduled_at', from);
    }

    if (to) {
      query = query.lte('scheduled_at', to);
    }

    query = query.order('scheduled_at', { ascending: true });

    const { data: calls, error } = await query;

    if (error) {
      throw new Error(`Failed to fetch schedule: ${error.message}`);
    }

    // Transform schedule data
    const schedule = {
      advocate_id: advocateId,
      scheduled_calls: calls || [],
      available_slots: [], // This would be calculated based on advocate's working hours and existing calls
    };

    return NextResponse.json(schedule, { status: 200 });
  } catch (error: any) {
    console.error('Get advocate schedule error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch schedule' },
      { status: 500 }
    );
  }
});
