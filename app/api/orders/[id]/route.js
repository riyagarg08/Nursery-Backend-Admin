import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';

export async function GET(request, { params }) {
  await dbConnect();
  const { id } = await params;

  // TODO: Fetch single order details including status_history
  return NextResponse.json({ 
    success: true, 
    order_details: { id, status: "placed" } 
  }, { status: 200 });
}