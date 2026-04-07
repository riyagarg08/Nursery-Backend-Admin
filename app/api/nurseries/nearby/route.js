import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Nursery from '@/models/Nursery';

export async function GET(request) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');
  const radius = searchParams.get('radius') || 10; // default 10km

  // TODO: Use MongoDB $geoNear aggregation
  return NextResponse.json({ 
    success: true, 
    nurseries: [], 
    message: `Nearby nurseries within ${radius}km of ${lat},${lng}` 
  }, { status: 200 });
}