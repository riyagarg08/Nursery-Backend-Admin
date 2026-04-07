import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';

export async function POST(request) {
  await dbConnect();
  const body = await request.json();
  const { user_id, code } = body;

  // TODO: Verify coupon code and update Cart discount_amount
  return NextResponse.json({ 
    success: true, 
    message: `Coupon ${code} applied successfully` 
  }, { status: 200 });
}