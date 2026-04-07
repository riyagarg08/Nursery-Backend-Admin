import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import OtpSession from '@/models/OtpSession';
import User from '@/models/User';

export async function POST(request) {
  try {
    await dbConnect(); // Connect to MongoDB
    
    const { phone } = await request.json();

    if (!phone) {
      return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
    }

    // Step 1: User Database me exists karta hai nahi? (Nahi to create kar do)
    let user = await User.findOne({ phone_number: phone });
    if (!user) {
      user = await User.create({ phone_number: phone, is_verified: false }); // New User
    }

    // Step 2: Generate 4-digit OTP (abhi ke liye '1234' rakhte hain ya random generate kar sakte hain)
    // const mockOtp = Math.floor(1000 + Math.random() * 9000).toString(); 
    const mockOtp = '1234'; 
    
    // OTP ki expiry set karna (Example: 5 mins from now)
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); 

    // Step 3: Purane (existing) OTP session inhi number ke delete ya invalidate kar do
    await OtpSession.deleteMany({ phone_number: phone });

    // Step 4: Naya OTP Session save karo DB me
    await OtpSession.create({
      phone_number: phone,
      otp_code: mockOtp,
      expires_at: expiresAt,
      is_used: false,
    });

    // TODO: Yahan par aapka actual SMS API (Twilio, Fast2SMS, etc.) trigger hoga
    console.log(`Mock: OTP ${mockOtp} saved in DB for ${phone}`);

    return NextResponse.json({ 
      success: true, 
      message: "OTP sent and saved in Database ! (Development mode: Use 1234)" 
    }, { status: 200 });

  } catch (error) {
    console.error("OTP Send Error Details: ", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
