import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';

export async function GET() {
  await dbConnect();
  // TODO: Fetch banners, top categories, popular nurseries
  return NextResponse.json({ 
    success: true, 
    data: { banners: [], categories: [], popular_nurseries: [] } 
  }, { status: 200 });
}