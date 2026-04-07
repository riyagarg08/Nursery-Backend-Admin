import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';

export async function GET(request) {
  try {
    await dbConnect();
    
    // Fetch all available products with basic details: name, price, and photos
    const products = await Product.find({ isActive: true })
      .select('name price discountedPrice stockQuantity category images description')
      .lean();

    return NextResponse.json({ 
      success: true, 
      count: products.length,
      data: products 
    }, { status: 200 });

  } catch (error) {
    console.error("Fetch Products Error: ", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
