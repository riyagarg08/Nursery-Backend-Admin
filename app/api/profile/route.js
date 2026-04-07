import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(request) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const user_id = searchParams.get('user_id');

  // TODO: Fetch user profile
  return NextResponse.json({ 
    success: true, 
    profile: { id: user_id, name: "Mock User" } 
  }, { status: 200 });
}

export async function PATCH(request) {
  await dbConnect();
  const body = await request.json();
  const { user_id, name, address } = body;

  // TODO: Update user's name and address
  return NextResponse.json({ 
    success: true, 
    message: "Profile updated successfully" 
  }, { status: 200 });
}