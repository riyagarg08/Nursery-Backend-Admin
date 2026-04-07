import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Cart from '@/models/Cart';

export async function POST(request) {
  await dbConnect();
  const body = await request.json();
  const { user_id, item_id, type, qty } = body;

  // TODO: Add product or service to Cart schema
  return NextResponse.json({ 
    success: true, 
    message: "Item added to cart successfully" 
  }, { status: 200 });
}