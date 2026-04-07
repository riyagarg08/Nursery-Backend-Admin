import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';

export async function GET(request) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const user_id = searchParams.get('user_id');

  // TODO: Fetch user's orders sorted by date
  return NextResponse.json({ 
    success: true, 
    orders: [] 
  }, { status: 200 });
}