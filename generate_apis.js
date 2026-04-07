const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'app', 'api');

// Helper to ensure dir exists and write file
function createRoute(routePath, content) {
  const fullDirPath = path.join(baseDir, routePath);
  fs.mkdirSync(fullDirPath, { recursive: true });
  fs.writeFileSync(path.join(fullDirPath, 'route.js'), content.trim());
}

const APIS = {
  // 1. GET /home
  'home': `
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
`,

  // 2. GET /search?q=&type=
  'search': `
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';

export async function GET(request) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');
  const type = searchParams.get('type');
  
  // TODO: Search in Product, Service, or Nursery based on q and type
  return NextResponse.json({ 
    success: true, 
    results: [], 
    message: \`Searching for "\${q}" of type "\${type}"\` 
  }, { status: 200 });
}
`,

  // 3. GET /nurseries/nearby
  'nurseries/nearby': `
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
    message: \`Nearby nurseries within \${radius}km of \${lat},\${lng}\` 
  }, { status: 200 });
}
`,

  // 4. GET /nurseries/:id
  'nurseries/[id]': `
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Nursery from '@/models/Nursery';
import Product from '@/models/Product';
import Service from '@/models/Service';

export async function GET(request, { params }) {
  await dbConnect();
  const { id } = await params;
  
  // TODO: Fetch nursery info + products + services
  return NextResponse.json({ 
    success: true, 
    nursery: { id },
    products: [],
    services: []
  }, { status: 200 });
}
`,

  // 5. POST /cart/add
  'cart/add': `
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
`,

  // 6. DELETE /cart/clear
  'cart/clear': `
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Cart from '@/models/Cart';

export async function DELETE(request) {
  await dbConnect();
  const body = await request.json();
  const { user_id } = body;

  // TODO: Clear user's cart
  return NextResponse.json({ 
    success: true, 
    message: "Cart cleared" 
  }, { status: 200 });
}
`,

  // 7. POST /cart/schedule
  'cart/schedule': `
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';

export async function POST(request) {
  await dbConnect();
  const body = await request.json();
  const { user_id, service_id, scheduled_date, time_slot } = body;

  // TODO: Attach date and time_slot to the service in the cart
  return NextResponse.json({ 
    success: true, 
    message: "Service scheduled in cart" 
  }, { status: 200 });
}
`,

  // 8. GET /cart/summary
  'cart/summary': `
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Cart from '@/models/Cart';

export async function GET(request) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const user_id = searchParams.get('user_id');

  // TODO: Calculate subtotal, delivery charges, discounts, and total
  return NextResponse.json({ 
    success: true, 
    summary: { subtotal: 0, delivery: 0, discount: 0, total: 0 } 
  }, { status: 200 });
}
`,

  // 9. POST /cart/apply-coupon
  'cart/apply-coupon': `
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';

export async function POST(request) {
  await dbConnect();
  const body = await request.json();
  const { user_id, code } = body;

  // TODO: Verify coupon code and update Cart discount_amount
  return NextResponse.json({ 
    success: true, 
    message: \`Coupon \${code} applied successfully\` 
  }, { status: 200 });
}
`,

  // 10. POST /orders/create
  'orders/create': `
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';

export async function POST(request) {
  await dbConnect();
  const body = await request.json();
  const { user_id, delivery_address, payment_method } = body;

  // TODO: Convert Cart to Order, Initialize Razorpay order if payment_method === 'razorpay'
  return NextResponse.json({ 
    success: true, 
    order_id: "mock_order_123",
    razorpay_order_id: "order_xyz",
    message: "Order placed, proceed to payment" 
  }, { status: 200 });
}
`,

  // 11. POST /orders/payment-verify
  'orders/payment-verify': `
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';

export async function POST(request) {
  await dbConnect();
  const body = await request.json();
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

  // TODO: Verify signature via crypto, update Order status to 'paid'
  return NextResponse.json({ 
    success: true, 
    message: "Payment verified successfully" 
  }, { status: 200 });
}
`,

  // 12. GET /orders
  'orders': `
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';

export async function GET(request) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const user_id = searchParams.get('user_id');

  // TODO: Fetch user's orders sorted by date
  return NextResponse.json({ 
    success: true, 
    orders: [] 
  }, { status: 200 });
}
`,

  // 13. GET /orders/:id
  'orders/[id]': `
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
`,

  // 14 & 15. GET & PATCH /profile
  'profile': `
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(request) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const user_id = searchParams.get('user_id');

  // TODO: Fetch user profile
  return NextResponse.json({ 
    success: true, 
    profile: { id: user_id, name: "Mock User" } 
  }, { status: 200 });
}

export async function PATCH(request) {
  await dbConnect();
  const body = await request.json();
  const { user_id, name, address } = body;

  // TODO: Update user's name and address
  return NextResponse.json({ 
    success: true, 
    message: "Profile updated successfully" 
  }, { status: 200 });
}
`
};

for (const [routePath, content] of Object.entries(APIS)) {
  createRoute(routePath, content);
}

console.log("All 14 boilerplate API routes have been generated successfully in app/api/");
