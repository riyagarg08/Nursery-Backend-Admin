import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request) {
  try {
    await dbConnect(); // Connect to MongoDB

    const body = await request.json();
    const { user_id, name, address } = body;

    // Validation
    if (!user_id) {
      return NextResponse.json({ error: "user_id is required" }, { status: 400 });
    }
    
    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    if (!address || !address.line1 || !address.city || !address.state || !address.pincode) {
      return NextResponse.json({ 
        error: "Complete address is required (line1, city, state, pincode)" 
      }, { status: 400 });
    }

    // Update process
    const updatedUser = await User.findByIdAndUpdate(
      user_id, // OTP verify hone par jo user_id milta hai
      { 
        name: name,
        address: {
          line1: address.line1,
          city: address.city,
          state: address.state,
          pincode: address.pincode,
          lat: address.lat || null,
          lng: address.lng || null
        }
      },
      { new: true } // Taaki update hone ke baad naya user data return ho
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found in DB" }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: "Profile and Address updated successfully!",
      user: {
        id: updatedUser._id,
        phone: updatedUser.phone_number,
        name: updatedUser.name,
        address: updatedUser.address
      }
    }, { status: 200 });

  } catch (error) {
    console.error("Profile Setup Error Details: ", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
