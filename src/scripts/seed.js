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
  // ── Additional T-Shirts (Shivangi) ──
  {
    name: 'Essential Striped Tee',
    slug: 'essential-striped-tee',
    description: 'Classic Breton stripes on a relaxed-fit tee. Made from 100% combed cotton for a soft, breathable feel all day long.',
    basePrice: 799,
    fitType: 'regular',
    fabricWeight: 'light',
    gender: 'unisex',
    categorySlug: 't-shirts',
    images: ['https://images.unsplash.com/photo-1574180566232-aaad1b5b8450?w=600'],
  },
  {
    name: 'Acid Wash Oversized Tee',
    slug: 'acid-wash-oversized-tee',
    description: 'Vintage-inspired acid wash tee with a boxy oversized cut. Each piece has a unique wash pattern making it one of a kind.',
    basePrice: 999,
    fitType: 'oversized',
    fabricWeight: 'medium',
    gender: 'unisex',
    categorySlug: 't-shirts',
    images: ['https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=600'],
  },
  {
    name: 'Women Ribbed Fitted Tee',
    slug: 'women-ribbed-fitted-tee',
    description: 'Form-fitting ribbed tee in a stretchy cotton-lycra blend. Pairs perfectly with high-waist bottoms for an effortless look.',
    basePrice: 849,
    fitType: 'slim',
    fabricWeight: 'light',
    gender: 'women',
    categorySlug: 't-shirts',
    images: ['https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?w=600'],
  },
  {
    name: 'Long Line Hem Tee',
    slug: 'long-line-hem-tee',
    description: 'Extended length tee with a curved hem. The elongated silhouette layers beautifully over joggers or slim trousers.',
    basePrice: 949,
    fitType: 'oversized',
    fabricWeight: 'medium',
    gender: 'men',
    categorySlug: 't-shirts',
    images: ['https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600'],
  },
  {
    name: 'Pigment Dyed Pocket Tee',
    slug: 'pigment-dyed-pocket-tee',
    description: 'Garment-dyed for a rich, faded tone that gets better with every wash. Chest patch pocket adds a casual utilitarian touch.',
    basePrice: 1099,
    fitType: 'regular',
    fabricWeight: 'medium',
    gender: 'unisex',
    categorySlug: 't-shirts',
    images: ['https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600'],
  },
  // ── Additional Shirts (Shivangi) ──
  {
    name: 'Relaxed Fit Chambray Shirt',
    slug: 'relaxed-fit-chambray-shirt',
    description: 'Soft chambray fabric with a relaxed fit and subtle texture. Works effortlessly as a standalone shirt or open layer over a tee.',
    basePrice: 1399,
    fitType: 'regular',
    fabricWeight: 'light',
    gender: 'unisex',
    categorySlug: 'shirts',
    images: ['https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=600'],
  },
  {
    name: 'Printed Resort Shirt',
    slug: 'printed-resort-shirt',
    description: 'Bold tropical print on a relaxed silhouette. Made from lightweight viscose that drapes beautifully in warm weather.',
    basePrice: 1599,
    fitType: 'oversized',
    fabricWeight: 'light',
    gender: 'men',
    categorySlug: 'shirts',
    images: ['https://images.unsplash.com/photo-1588359348347-9bc6cbbb689e?w=600'],
  },
  {
    name: 'Women Oversized Flannel Shirt',
    slug: 'women-oversized-flannel-shirt',
    description: 'Cozy brushed flannel shirt in an oversized silhouette. Perfect as a light jacket or tied around the waist for a casual look.',
    basePrice: 1499,
    fitType: 'oversized',
    fabricWeight: 'medium',
    gender: 'women',
    categorySlug: 'shirts',
    images: ['https://images.unsplash.com/photo-1564584217132-2271feaeb3c5?w=600'],
  },
  {
    name: 'Mandarin Collar Slim Shirt',
    slug: 'mandarin-collar-slim-shirt',
    description: 'Minimalist mandarin collar shirt in premium cotton poplin. Clean lines and a slim fit make it ideal for smart casual occasions.',
    basePrice: 1799,
    fitType: 'slim',
    fabricWeight: 'light',
    gender: 'men',
    categorySlug: 'shirts',
    images: ['https://images.unsplash.com/photo-1603251579711-6b3b12e76e83?w=600'],
  },
  {
    name: 'Denim Western Shirt',
    slug: 'denim-western-shirt',
    description: 'Classic western shirt in medium-weight denim with snap buttons and yoke detailing. A rugged wardrobe essential.',
    basePrice: 1899,
    fitType: 'regular',
    fabricWeight: 'medium',
    gender: 'unisex',
    categorySlug: 'shirts',
    images: ['https://images.unsplash.com/photo-1589310243389-96a5483213a8?w=600'],
  },
  // ── Additional Jeans (Shivangi) ──
  {
    name: 'Relaxed Fit Baggy Jeans',
    slug: 'relaxed-fit-baggy-jeans',
    description: 'Wide leg baggy jeans in a soft mid-weight denim. The relaxed silhouette gives an effortlessly cool street style look.',
    basePrice: 2099,
    fitType: 'oversized',
    fabricWeight: 'medium',
    gender: 'unisex',
    categorySlug: 'jeans',
    images: ['https://images.unsplash.com/photo-1555689502-c4b22d76c56f?w=600'],
  },
  {
    name: 'Light Wash Slim Taper Jeans',
    slug: 'light-wash-slim-taper-jeans',
    description: 'Clean light wash with a slim taper cut that narrows at the ankle. Stretch denim ensures all day comfort without compromising fit.',
    basePrice: 1899,
    fitType: 'slim',
    fabricWeight: 'medium',
    gender: 'men',
    categorySlug: 'jeans',
    images: ['https://images.unsplash.com/photo-1475178626620-a4d074967452?w=600'],
  },
  {
    name: 'Women Wide Leg Crop Jeans',
    slug: 'women-wide-leg-crop-jeans',
    description: 'Cropped wide leg jeans with a high rise waist. The cropped length and wide leg create a balanced, fashion-forward silhouette.',
    basePrice: 2299,
    fitType: 'oversized',
    fabricWeight: 'medium',
    gender: 'women',
    categorySlug: 'jeans',
    images: ['https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?w=600'],
  },
  {
    name: 'Black Coated Skinny Jeans',
    slug: 'black-coated-skinny-jeans',
    description: 'Sleek coated finish gives these skinny jeans a leather-like look. Stretch fabric keeps them comfortable from morning to night.',
    basePrice: 2399,
    fitType: 'slim',
    fabricWeight: 'medium',
    gender: 'unisex',
    categorySlug: 'jeans',
    images: ['https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?w=600'],
  },
  {
    name: 'Vintage Bootcut Jeans',
    slug: 'vintage-bootcut-jeans',
    description: 'A throwback to classic denim with a subtle bootcut flare. Mid-rise waist and authentic whiskering for a genuine vintage feel.',
    basePrice: 1999,
    fitType: 'regular',
    fabricWeight: 'heavy',
    gender: 'women',
    categorySlug: 'jeans',
    images: ['https://images.unsplash.com/photo-1602293589930-45aad59ba3ab?w=600'],
  },
  // ── Additional Trousers (Shivangi) ──
  {
    name: 'Pleated Formal Trousers',
    slug: 'pleated-formal-trousers',
    description: 'Double-pleated formal trousers in premium wool-blend fabric. A sophisticated silhouette that transitions seamlessly from office to evening.',
    basePrice: 2199,
    fitType: 'regular',
    fabricWeight: 'medium',
    gender: 'men',
    categorySlug: 'trousers',
    images: ['https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=600'],
  },
  {
    name: 'Jogger Sweat Trousers',
    slug: 'jogger-sweat-trousers',
    description: 'Tapered jogger trousers in heavyweight French terry. Elasticated waist and cuffs for a snug comfortable fit all day.',
    basePrice: 1499,
    fitType: 'regular',
    fabricWeight: 'heavy',
    gender: 'unisex',
    categorySlug: 'trousers',
    images: ['https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=600'],
  },
  {
    name: 'Women Tailored Cigarette Trousers',
    slug: 'women-tailored-cigarette-trousers',
    description: 'Slim cigarette cut trousers with a high waist and cropped length. Sharp tailoring in a wrinkle-resistant fabric perfect for long work days.',
    basePrice: 1999,
    fitType: 'slim',
    fabricWeight: 'light',
    gender: 'women',
    categorySlug: 'trousers',
    images: ['https://images.unsplash.com/photo-1594938374182-a55e7cf71e73?w=600'],
  },
  {
    name: 'Parachute Utility Trousers',
    slug: 'parachute-utility-trousers',
    description: 'Lightweight parachute fabric with multiple zip pockets and a relaxed fit. The ultimate functional trouser for urban explorers.',
    basePrice: 2299,
    fitType: 'oversized',
    fabricWeight: 'light',
    gender: 'unisex',
    categorySlug: 'trousers',
    images: ['https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600'],
  },
  {
    name: 'Slim Fit Corduroy Trousers',
    slug: 'slim-fit-corduroy-trousers',
    description: 'Fine wale corduroy trousers in a slim fit cut. A tactile autumn essential that adds texture and warmth to any outfit.',
    basePrice: 1799,
    fitType: 'slim',
    fabricWeight: 'medium',
    gender: 'men',
    categorySlug: 'trousers',
    images: ['https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600'],
  },
  // ── Additional Hoodies (Shivangi) ──
  {
    name: 'Tie Dye Pullover Hoodie',
    slug: 'tie-dye-pullover-hoodie',
    description: 'Hand tie-dyed pullover hoodie in vibrant swirl patterns. Each piece is unique — no two hoodies look exactly the same.',
    basePrice: 2099,
    fitType: 'oversized',
    fabricWeight: 'heavy',
    gender: 'unisex',
    categorySlug: 'hoodies',
    images: ['https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=600'],
  },
  {
    name: 'Half Zip Fleece Hoodie',
    slug: 'half-zip-fleece-hoodie',
    description: 'Cosy half-zip fleece hoodie with a kangaroo pocket. Midlayer warmth without the bulk — perfect for layering on cold days.',
    basePrice: 2399,
    fitType: 'regular',
    fabricWeight: 'medium',
    gender: 'men',
    categorySlug: 'hoodies',
    images: ['https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?w=600'],
  },
  {
    name: 'Women Zip Up Cropped Hoodie',
    slug: 'women-zip-up-cropped-hoodie',
    description: 'Cropped zip-up hoodie in a soft cotton fleece blend. A versatile layering piece that pairs with everything from leggings to jeans.',
    basePrice: 1899,
    fitType: 'slim',
    fabricWeight: 'medium',
    gender: 'women',
    categorySlug: 'hoodies',
    images: ['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600'],
  },
  {
    name: 'Embroidered Logo Hoodie',
    slug: 'embroidered-logo-hoodie',
    description: 'Premium heavyweight hoodie with a tonal embroidered chest logo. 450 GSM fleece provides exceptional warmth and structure.',
    basePrice: 2799,
    fitType: 'regular',
    fabricWeight: 'heavy',
    gender: 'unisex',
    categorySlug: 'hoodies',
    images: ['https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600'],
  },
  {
    name: 'Lightweight Summer Hoodie',
    slug: 'lightweight-summer-hoodie',
    description: 'Thin cotton hoodie built for mild evenings and air conditioned spaces. Light enough to fold into a bag without taking up space.',
    basePrice: 1599,
    fitType: 'regular',
    fabricWeight: 'light',
    gender: 'unisex',
    categorySlug: 'hoodies',
    images: ['https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600'],
  },
  // ── Additional Jackets (Shivangi) ──
  {
    name: 'Leather Biker Jacket',
    slug: 'leather-biker-jacket',
    description: 'Classic asymmetric zip biker jacket in genuine leather. Quilted shoulder panels and silver hardware give it an edgy, timeless character.',
    basePrice: 7999,
    fitType: 'slim',
    fabricWeight: 'heavy',
    gender: 'unisex',
    categorySlug: 'jackets',
    images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600'],
  },
  {
    name: 'Corduroy Overshirt Jacket',
    slug: 'corduroy-overshirt-jacket',
    description: 'Fine wale corduroy overshirt jacket that works as both a shirt and a light layer. Chest patch pockets add a casual utilitarian detail.',
    basePrice: 2599,
    fitType: 'regular',
    fabricWeight: 'medium',
    gender: 'unisex',
    categorySlug: 'jackets',
    images: ['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600'],
  },
  {
    name: 'Women Cropped Puffer Jacket',
    slug: 'women-cropped-puffer-jacket',
    description: 'Cropped puffer jacket with recycled down fill and a glossy shell finish. Warm, lightweight and perfectly fitted for a modern silhouette.',
    basePrice: 3999,
    fitType: 'regular',
    fabricWeight: 'heavy',
    gender: 'women',
    categorySlug: 'jackets',
    images: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600'],
  },
  {
    name: 'Reversible Varsity Jacket',
    slug: 'reversible-varsity-jacket',
    description: 'Two jackets in one — wool body on one side, satin lining on the other. Leather sleeves and ribbed trims complete the collegiate aesthetic.',
    basePrice: 5499,
    fitType: 'regular',
    fabricWeight: 'heavy',
    gender: 'unisex',
    categorySlug: 'jackets',
    images: ['https://images.unsplash.com/photo-1543076447-215ad9ba6923?w=600'],
  },
  {
    name: 'Packable Rain Jacket',
    slug: 'packable-rain-jacket',
    description: 'Fully seam-sealed waterproof jacket that packs into its own hood pocket. Lightweight enough to carry everywhere, reliable enough for any downpour.',
    basePrice: 3799,
    fitType: 'regular',
    fabricWeight: 'light',
    gender: 'unisex',
    categorySlug: 'jackets',
    images: ['https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?w=600'],
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
