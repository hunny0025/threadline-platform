// ============================================================
// Threadline Platform - MongoDB Seed Script
// Inserts realistic categories, products and variants.
// Run: npm run seed
// Requires MONGODB_URI in .env or environment.
// WARNING: Clears existing data before seeding.
// ============================================================

require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../db/mongoose');
const Category = require('../models/Category');
const Product = require('../models/Product');
const ProductVariant = require('../models/ProductVariant');

// ── Seed Data ─────────────────────────────────────────────

const categoryData = [
  { name: 'T-Shirts',  slug: 't-shirts',  description: 'Everyday essential tees',          sortOrder: 1 },
  { name: 'Shirts',    slug: 'shirts',    description: 'Formal and casual shirts',          sortOrder: 2 },
  { name: 'Jeans',     slug: 'jeans',     description: 'Denim essentials',                  sortOrder: 3 },
  { name: 'Trousers',  slug: 'trousers',  description: 'Tailored and relaxed trousers',    sortOrder: 4 },
  { name: 'Hoodies',   slug: 'hoodies',   description: 'Comfort-first layered style',      sortOrder: 5 },
  { name: 'Jackets',   slug: 'jackets',   description: 'Premium outerwear',                sortOrder: 6 },
];

const productData = [
  // ── T-Shirts ──
  {
    name: 'Urban Essentials Crew Tee',
    slug: 'urban-essentials-crew-tee',
    description: 'A minimal, breathable 100% cotton crew neck tee built for everyday wear. Preshrunk fabric keeps its shape wash after wash.',
    basePrice: 699,
    fitType: 'regular',
    fabricWeight: 'medium',
    gender: 'unisex',
    categorySlug: 't-shirts',
    images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600'],
  },
  {
    name: 'Threadline Graphic Print Tee',
    slug: 'threadline-graphic-print-tee',
    description: 'Bold street-art inspired print on a soft-touch jersey fabric. A statement piece for casual outings.',
    basePrice: 899,
    fitType: 'oversized',
    fabricWeight: 'light',
    gender: 'men',
    categorySlug: 't-shirts',
    images: ['https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600'],
  },
  {
    name: 'Core Pocket Tee',
    slug: 'core-pocket-tee',
    description: 'Classic fit tee with a chest pocket detail. Made from ring-spun cotton for superior softness.',
    basePrice: 599,
    fitType: 'regular',
    fabricWeight: 'light',
    gender: 'unisex',
    categorySlug: 't-shirts',
    images: ['https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600'],
  },
  {
    name: 'Slim Fit V-Neck Tee',
    slug: 'slim-fit-v-neck-tee',
    description: 'A versatile slim-fit V-neck crafted from premium combed cotton. Pairs effortlessly with jeans or chinos.',
    basePrice: 749,
    fitType: 'slim',
    fabricWeight: 'medium',
    gender: 'men',
    categorySlug: 't-shirts',
    images: ['https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600'],
  },
  {
    name: 'Women Relaxed Crop Tee',
    slug: 'women-relaxed-crop-tee',
    description: 'Effortlessly cool cropped tee with a relaxed silhouette. Made from GOTS-certified organic cotton.',
    basePrice: 799,
    fitType: 'oversized',
    fabricWeight: 'light',
    gender: 'women',
    categorySlug: 't-shirts',
    images: ['https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600'],
  },

  // ── Shirts ──
  {
    name: 'Oxford Button-Down Shirt',
    slug: 'oxford-button-down-shirt',
    description: 'A wardrobe staple. Classic Oxford cloth with a button-down collar — works just as well untucked on weekends.',
    basePrice: 1499,
    fitType: 'regular',
    fabricWeight: 'medium',
    gender: 'men',
    categorySlug: 'shirts',
    images: ['https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600'],
  },
  {
    name: 'Linen Blend Summer Shirt',
    slug: 'linen-blend-summer-shirt',
    description: 'Breathable linen-cotton blend shirt with a relaxed fit. Perfect for warm days and beach vacations.',
    basePrice: 1299,
    fitType: 'regular',
    fabricWeight: 'light',
    gender: 'unisex',
    categorySlug: 'shirts',
    images: ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600'],
  },
  {
    name: 'Slim Fit Formal Shirt',
    slug: 'slim-fit-formal-shirt',
    description: 'Tailored slim-fit formal shirt in premium cotton-poplin. Wrinkle-resistant finish for all-day crispness.',
    basePrice: 1699,
    fitType: 'slim',
    fabricWeight: 'light',
    gender: 'men',
    categorySlug: 'shirts',
    images: ['https://images.unsplash.com/photo-1594938298603-c8148c4b4b34?w=600'],
  },

  // ── Jeans ──
  {
    name: 'Indigo Raw Denim Jeans',
    slug: 'indigo-raw-denim-jeans',
    description: 'Selvedge raw denim that fades uniquely to your wear patterns. Built to last years, not seasons.',
    basePrice: 2499,
    fitType: 'slim',
    fabricWeight: 'heavy',
    gender: 'men',
    categorySlug: 'jeans',
    images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=600'],
  },
  {
    name: 'Classic Straight Leg Jeans',
    slug: 'classic-straight-leg-jeans',
    description: 'Timeless straight-leg cut in mid-weight denim. A reliable everyday staple for any wardrobe.',
    basePrice: 1799,
    fitType: 'regular',
    fabricWeight: 'medium',
    gender: 'unisex',
    categorySlug: 'jeans',
    images: ['https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600'],
  },
  {
    name: 'Women High-Rise Skinny Jeans',
    slug: 'women-high-rise-skinny-jeans',
    description: 'High-rise skinny jeans with stretch-denim for all-day comfort. Flattering silhouette with 4-way flexibility.',
    basePrice: 1999,
    fitType: 'slim',
    fabricWeight: 'medium',
    gender: 'women',
    categorySlug: 'jeans',
    images: ['https://images.unsplash.com/photo-1604176424472-9d7916236db3?w=600'],
  },
  {
    name: 'Distressed Slim Fit Jeans',
    slug: 'distressed-slim-fit-jeans',
    description: 'Street-ready jeans with subtle distressing. Premium stretch denim ensures comfort through long days.',
    basePrice: 2199,
    fitType: 'slim',
    fabricWeight: 'medium',
    gender: 'men',
    categorySlug: 'jeans',
    images: ['https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600'],
  },

  // ── Trousers ──
  {
    name: 'Tapered Chino Trousers',
    slug: 'tapered-chino-trousers',
    description: 'Versatile tapered chinos in garment-dyed twill. Bridge the gap between smart and casual effortlessly.',
    basePrice: 1599,
    fitType: 'slim',
    fabricWeight: 'medium',
    gender: 'men',
    categorySlug: 'trousers',
    images: ['https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600'],
  },
  {
    name: 'Wide Leg Linen Trousers',
    slug: 'wide-leg-linen-trousers',
    description: 'Relaxed wide-leg trousers in breathable linen. A summer essential that flows with every step.',
    basePrice: 1399,
    fitType: 'oversized',
    fabricWeight: 'light',
    gender: 'women',
    categorySlug: 'trousers',
    images: ['https://images.unsplash.com/photo-1594938298603-c8148c4b4b34?w=600'],
  },
  {
    name: 'Cargo Utility Trousers',
    slug: 'cargo-utility-trousers',
    description: 'Multi-pocket cargo trousers in durable ripstop fabric. Functional meets fashion in a single garment.',
    basePrice: 1899,
    fitType: 'regular',
    fabricWeight: 'heavy',
    gender: 'unisex',
    categorySlug: 'trousers',
    images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=600'],
  },

  // ── Hoodies ──
  {
    name: 'Classic Pullover Hoodie',
    slug: 'classic-pullover-hoodie',
    description: 'Ultra-soft French terry pullover hoodie. The perfect companion for cool mornings and lazy evenings.',
    basePrice: 1999,
    fitType: 'regular',
    fabricWeight: 'heavy',
    gender: 'unisex',
    categorySlug: 'hoodies',
    images: ['https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600'],
  },
  {
    name: 'Zip-Up Tech Fleece Hoodie',
    slug: 'zip-up-tech-fleece-hoodie',
    description: 'Lightweight tech-fleece zip hoodie engineered for movement. Moisture-wicking and quick-drying.',
    basePrice: 2499,
    fitType: 'slim',
    fabricWeight: 'medium',
    gender: 'men',
    categorySlug: 'hoodies',
    images: ['https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600'],
  },
  {
    name: 'Oversized Drop-Shoulder Hoodie',
    slug: 'oversized-drop-shoulder-hoodie',
    description: 'Street-style oversized hoodie with drop shoulders. 400 GSM fleece that keeps you warm without bulk.',
    basePrice: 2299,
    fitType: 'oversized',
    fabricWeight: 'heavy',
    gender: 'unisex',
    categorySlug: 'hoodies',
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600'],
  },
  {
    name: 'Women Cropped Hoodie',
    slug: 'women-cropped-hoodie',
    description: 'Trendy cropped hoodie in a relaxed fit. Soft brushed interior for all-day comfort.',
    basePrice: 1799,
    fitType: 'regular',
    fabricWeight: 'medium',
    gender: 'women',
    categorySlug: 'hoodies',
    images: ['https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600'],
  },
  {
    name: 'Vintage Wash Hoodie',
    slug: 'vintage-wash-hoodie',
    description: 'Garment-dyed for a broken-in vintage look from day one. Gets better with every wash.',
    basePrice: 2199,
    fitType: 'oversized',
    fabricWeight: 'heavy',
    gender: 'unisex',
    categorySlug: 'hoodies',
    images: ['https://images.unsplash.com/photo-1604176424472-9d7916236db3?w=600'],
  },

  // ── Jackets ──
  {
    name: 'Bomber Flight Jacket',
    slug: 'bomber-flight-jacket',
    description: 'Classic MA-1 bomber jacket in nylon shell with ribbed cuffs and waistband. An icon reinterpreted.',
    basePrice: 3999,
    fitType: 'regular',
    fabricWeight: 'heavy',
    gender: 'unisex',
    categorySlug: 'jackets',
    images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600'],
  },
  {
    name: 'Quilted Puffer Jacket',
    slug: 'quilted-puffer-jacket',
    description: 'Lightweight quilted puffer packed with recycled fill. Packs into its own pocket for easy carry.',
    basePrice: 4499,
    fitType: 'regular',
    fabricWeight: 'heavy',
    gender: 'unisex',
    categorySlug: 'jackets',
    images: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600'],
  },
  {
    name: 'Washed Denim Trucker Jacket',
    slug: 'washed-denim-trucker-jacket',
    description: 'Rugged trucker jacket in washed denim. A timeless layering piece with a lived-in character.',
    basePrice: 2999,
    fitType: 'regular',
    fabricWeight: 'heavy',
    gender: 'unisex',
    categorySlug: 'jackets',
    images: ['https://images.unsplash.com/photo-1543076447-215ad9ba6923?w=600'],
  },
  {
    name: 'Technical Windbreaker',
    slug: 'technical-windbreaker',
    description: 'Packable windbreaker in water-resistant ripstop. Seam-sealed construction for light rain protection.',
    basePrice: 3299,
    fitType: 'regular',
    fabricWeight: 'light',
    gender: 'unisex',
    categorySlug: 'jackets',
    images: ['https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?w=600'],
  },
  {
    name: 'Sherpa Lined Flannel Jacket',
    slug: 'sherpa-lined-flannel-jacket',
    description: 'Heavyweight flannel outer with a thick sherpa lining. Built for cold mornings and campfire nights.',
    basePrice: 3599,
    fitType: 'oversized',
    fabricWeight: 'heavy',
    gender: 'men',
    categorySlug: 'jackets',
    images: ['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600'],
  },
  {
    name: 'Women Trench Coat',
    slug: 'women-trench-coat',
    description: 'Double-breasted trench coat in water-repellent cotton-gabardine. A forever piece in your wardrobe.',
    basePrice: 5999,
    fitType: 'regular',
    fabricWeight: 'medium',
    gender: 'women',
    categorySlug: 'jackets',
    images: ['https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600'],
  },
  {
    name: 'Satin Coach Jacket',
    slug: 'satin-coach-jacket',
    description: 'Smooth satin coach jacket with contrast stitching. A premium casual layer for any outfit.',
    basePrice: 2799,
    fitType: 'regular',
    fabricWeight: 'light',
    gender: 'unisex',
    categorySlug: 'jackets',
    images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600'],
  },
];

// ── Variant Generator ─────────────────────────────────────
const COLORS = [
  { color: 'black',   colorLabel: 'Black' },
  { color: 'white',   colorLabel: 'White' },
  { color: 'navy',    colorLabel: 'Navy Blue' },
  { color: 'olive',   colorLabel: 'Olive Green' },
  { color: 'charcoal',colorLabel: 'Charcoal' },
];

function generateVariants(productId, basePrice) {
  const variants = [];
  // Pick 2 random colors
  const selectedColors = COLORS.sort(() => 0.5 - Math.random()).slice(0, 2);
  for (const { color, colorLabel } of selectedColors) {
    for (const size of ['S', 'M', 'L', 'XL']) {
      const skuParts = [productId.toString().slice(-6).toUpperCase(), color.slice(0, 3).toUpperCase(), size];
      variants.push({
        product: productId,
        size,
        color,
        colorLabel,
        stock: Math.floor(Math.random() * 50) + 5,
        price: basePrice + (size === 'XL' ? 100 : 0),
        sku: skuParts.join('-'),
      });
    }
  }
  return variants;
}

// ── Main Seed Function ────────────────────────────────────
async function seed() {
  await connectDB();
  console.log('🌱 Starting seed...');

  // Clear existing data
  await ProductVariant.deleteMany({});
  await Product.deleteMany({});
  await Category.deleteMany({});
  console.log('🗑️  Cleared existing data');

  // Insert categories
  const insertedCategories = await Category.insertMany(categoryData);
  const categoryMap = {};
  for (const cat of insertedCategories) {
    categoryMap[cat.slug] = cat._id;
  }
  console.log(`✅ Inserted ${insertedCategories.length} categories`);

  // Insert products
  const productsToInsert = productData.map(p => ({
    name: p.name,
    slug: p.slug,
    description: p.description,
    basePrice: p.basePrice,
    fitType: p.fitType,
    fabricWeight: p.fabricWeight,
    gender: p.gender,
    category: categoryMap[p.categorySlug],
    images: p.images,
    isActive: true,
  }));

  const insertedProducts = await Product.insertMany(productsToInsert);
  console.log(`✅ Inserted ${insertedProducts.length} products`);

  // Insert variants
  const allVariants = [];
  for (const product of insertedProducts) {
    const variants = generateVariants(product._id, product.basePrice);
    allVariants.push(...variants);
  }

  const insertedVariants = await ProductVariant.insertMany(allVariants);
  console.log(`✅ Inserted ${insertedVariants.length} product variants`);

  console.log('🎉 Seed complete!');
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(err => {
  console.error('❌ Seed failed:', err.message);
  process.exit(1);
});
