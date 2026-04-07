require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

// Note: I'm redefining models for the script to avoid ES Import issues if the main models use ES modules
const ProductSchema = new mongoose.Schema({
  name: String,
  price: Number,
  category: String,
  images: [{ url: String, thumbnailUrl: String, isCover: Boolean }],
  isActive: { type: Boolean, default: true },
  nursery_id: mongoose.Schema.Types.ObjectId
}, { timestamps: true });

const ServiceSchema = new mongoose.Schema({
  name: String,
  price: Number,
  category: String,
  images: [{ url: String, thumbnailUrl: String }],
  isActive: { type: Boolean, default: true },
  nursery_id: mongoose.Schema.Types.ObjectId
}, { timestamps: true });

const NurserySchema = new mongoose.Schema({
  name: String,
  is_active: { type: Boolean, default: true }
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);
const Service = mongoose.models.Service || mongoose.model('Service', ServiceSchema);
const Nursery = mongoose.models.Nursery || mongoose.model('Nursery', NurserySchema);

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB for Seeding...");

  // 1. Create a dummy Nursery
  const nursery = await Nursery.create({ name: "Sunshine Gardens" });
  console.log(`Created Nursery: ${nursery.name} (ID: ${nursery._id})`);

  // 2. Add Products
  const products = [
    {
      name: "Money Plant",
      price: 150,
      category: "plant",
      nursery_id: nursery._id,
      images: [{ url: "https://example.com/moneyplant.jpg", isCover: true }]
    },
    {
      name: "Organic Soil Mix (5kg)",
      price: 299,
      category: "soil",
      nursery_id: nursery._id,
      images: [{ url: "https://example.com/soil.jpg", isCover: true }]
    }
  ];

  await Product.insertMany(products);
  console.log("Seeded Products.");

  // 3. Add Services
  const services = [
    {
      name: "Garden Maintenance",
      price: 500,
      category: "maintenance",
      nursery_id: nursery._id,
      images: [{ url: "https://example.com/gardening.jpg" }]
    },
    {
      name: "Plant Repotting Service",
      price: 100,
      category: "repotting",
      nursery_id: nursery._id,
      images: [{ url: "https://example.com/repotting.jpg" }]
    }
  ];

  await Service.insertMany(services);
  console.log("Seeded Services.");

  console.log("Seed complete! You can now test the APIs.");
  process.exit();
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
