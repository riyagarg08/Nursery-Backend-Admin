import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';

export async function POST(request) {
  await dbConnect();
  const body = await request.json();
  const { user_id, service_id, scheduled_date, time_slot } = body;

  // TODO: Attach date and time_slot to the service in the cart
  return NextResponse.json({ 
    success: true, 
    message: "Service scheduled in cart" 
  }, { status: 200 });
}