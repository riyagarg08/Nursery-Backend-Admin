import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import OtpSession from '@/models/OtpSession';
import User from '@/models/User';

export async function POST(request) {
  try {
    await dbConnect(); // Connect to MongoDB

    const { phone, otp } = await request.json();

    if (!phone || !otp) {
      return NextResponse.json({ error: "Phone and OTP are required" }, { status: 400 });
    }

    // Step 1: Database me recent OtpSession check karein iss number ke liye
    const currentSession = await OtpSession.findOne({ 
        phone_number: phone, 
        is_used: false 
    }).sort({ created_at: -1 });

    if (!currentSession) {
      return NextResponse.json({ success: false, error: "No OTP request found for this number" }, { status: 404 });
    }

    // Step 2: Expiry Check
    if (new Date() > currentSession.expires_at) {
      return NextResponse.json({ success: false, error: "OTP expired. Please request a new one." }, { status: 401 });
    }

    // Step 3: Match the OTP
    if (currentSession.otp_code === otp) {
      
      // Mark OTP as used
      currentSession.is_used = true;
      await currentSession.save();

      // User ka verification status update kar do
      const activeUser = await User.findOneAndUpdate(
          { phone_number: phone },
          { is_verified: true },
          { new: true }
      );

      // Yahan par naya JWT token generate hoga
      const mockToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.MockToken1234";

      return NextResponse.json({ 
        success: true, 
        message: "Login successful. Verified in Database!",
        user_id: activeUser._id,
        token: mockToken
      }, { status: 200 });

    } else {
      return NextResponse.json({ success: false, error: "Invalid OTP" }, { status: 401 });
    }

  } catch (error) {
    console.error("OTP Verify Error Details: ", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
