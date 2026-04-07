import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Nursery from '@/models/Nursery';
import Product from '@/models/Product';
import Service from '@/models/Service';

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    
    // 1. Fetch Nursery Details
    const nursery = await Nursery.findById(id).lean();
    if (!nursery) {
      return NextResponse.json({ success: false, error: "Nursery not found" }, { status: 404 });
    }

    // 2. Fetch Products for this Nursery
    const products = await Product.find({ nursery_id: id, isActive: true })
      .select('name price discountedPrice images stockQuantity category description')
      .lean();

    // 3. Fetch Services for this Nursery
    const services = await Service.find({ nursery_id: id, isActive: true })
      .select('name price priceOnwards durationMinutes images category description')
      .lean();

    return NextResponse.json({ 
      success: true, 
      nursery: nursery,
      products: products,
      services: services
    }, { status: 200 });

  } catch (error) {
    console.error("Fetch Nursery Details Error: ", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}