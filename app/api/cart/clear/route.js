import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Cart from '@/models/Cart';

export async function DELETE(request) {
  await dbConnect();
  const body = await request.json();
  const { user_id } = body;

  // TODO: Clear user's cart
  return NextResponse.json({ 
    success: true, 
    message: "Cart cleared" 
  }, { status: 200 });
}