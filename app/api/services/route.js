import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Service from '@/models/Service';

export async function GET(request) {
  try {
    await dbConnect();
    
    // Fetch all available services with basic details: name, price, and photos
    const services = await Service.find({ isActive: true })
      .select('name price priceOnwards durationMinutes category images description')
      .lean();

    return NextResponse.json({ 
      success: true, 
      count: services.length,
      data: services 
    }, { status: 200 });

  } catch (error) {
    console.error("Fetch Services Error: ", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
