// ============================================================
// Threadline Platform — MongoDB Seed Script (100 Products)
// Run:  npm run seed
// Requires MONGODB_URI in .env
// WARNING: Clears existing Products, Variants, Categories
// ============================================================
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../db/mongoose');
const Category = require('../models/Category');
const Product = require('../models/Product');
const ProductVariant = require('../models/ProductVariant');

// ── 10 Categories ────────────────────────────────────────────
const categoryData = [
  { name: 'T-Shirts',    slug: 't-shirts',    description: 'Everyday essential tees',           sortOrder: 1 },
  { name: 'Shirts',      slug: 'shirts',      description: 'Formal and casual shirts',           sortOrder: 2 },
  { name: 'Jeans',       slug: 'jeans',       description: 'Denim essentials',                   sortOrder: 3 },
  { name: 'Trousers',    slug: 'trousers',    description: 'Tailored and relaxed trousers',      sortOrder: 4 },
  { name: 'Hoodies',     slug: 'hoodies',     description: 'Comfort-first layered style',        sortOrder: 5 },
  { name: 'Jackets',     slug: 'jackets',     description: 'Premium outerwear',                  sortOrder: 6 },
  { name: 'Shorts',      slug: 'shorts',      description: 'Casual and athletic shorts',         sortOrder: 7 },
  { name: 'Co-ords',     slug: 'co-ords',     description: 'Matching sets and co-ord suits',     sortOrder: 8 },
  { name: 'Sweatshirts', slug: 'sweatshirts', description: 'Cozy sweatshirt essentials',         sortOrder: 9 },
  { name: 'Accessories', slug: 'accessories', description: 'Caps, bags and accessories',         sortOrder: 10 },
];

// ── 100 Products (10 per category) ───────────────────────────
const productData = [
  // ── T-SHIRTS (10) ───────────────────────────────────────────
  { name: 'Urban Essentials Crew Tee',      slug: 'urban-essentials-crew-tee',      basePrice: 699,  fitType: 'regular',   fabricWeight: 'medium', gender: 'unisex', occasion: 'casual',  categorySlug: 't-shirts',    tags: ['cotton','basics','crew'],       images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600'] },
  { name: 'Threadline Graphic Print Tee',   slug: 'threadline-graphic-print-tee',   basePrice: 899,  fitType: 'oversized', fabricWeight: 'light',  gender: 'men',    occasion: 'casual',  categorySlug: 't-shirts',    tags: ['graphic','streetwear'],         images: ['https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600'] },
  { name: 'Core Pocket Tee',               slug: 'core-pocket-tee',               basePrice: 599,  fitType: 'regular',   fabricWeight: 'light',  gender: 'unisex', occasion: 'casual',  categorySlug: 't-shirts',    tags: ['pocket','basics'],              images: ['https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600'] },
  { name: 'Slim Fit V-Neck Tee',           slug: 'slim-fit-v-neck-tee',           basePrice: 749,  fitType: 'slim',      fabricWeight: 'medium', gender: 'men',    occasion: 'casual',  categorySlug: 't-shirts',    tags: ['vneck','slim','premium'],       images: ['https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600'] },
  { name: 'Women Relaxed Crop Tee',        slug: 'women-relaxed-crop-tee',        basePrice: 799,  fitType: 'oversized', fabricWeight: 'light',  gender: 'women',  occasion: 'casual',  categorySlug: 't-shirts',    tags: ['crop','organic','women'],       images: ['https://images.unsplash.com/photo-1554568218-0f1715e72254?w=600'] },
  { name: 'Acid Wash Oversized Tee',       slug: 'acid-wash-oversized-tee',       basePrice: 949,  fitType: 'oversized', fabricWeight: 'medium', gender: 'unisex', occasion: 'casual',  categorySlug: 't-shirts',    tags: ['acidwash','vintage','streetwear'], images: ['https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600'] },
  { name: 'Essential White Tee',           slug: 'essential-white-tee',           basePrice: 549,  fitType: 'regular',   fabricWeight: 'light',  gender: 'unisex', occasion: 'casual',  categorySlug: 't-shirts',    tags: ['white','basics','everyday'],    images: ['https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600'] },
  { name: 'Ribbed Muscle Tee',             slug: 'ribbed-muscle-tee',             basePrice: 649,  fitType: 'slim',      fabricWeight: 'light',  gender: 'men',    occasion: 'sports',  categorySlug: 't-shirts',    tags: ['ribbed','gym','muscle'],        images: ['https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=600'] },
  { name: 'Women Tie-Dye Tee',             slug: 'women-tie-dye-tee',             basePrice: 849,  fitType: 'regular',   fabricWeight: 'light',  gender: 'women',  occasion: 'casual',  categorySlug: 't-shirts',    tags: ['tiedye','colorful','women'],    images: ['https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600'] },
  { name: 'Longline Curved Hem Tee',       slug: 'longline-curved-hem-tee',       basePrice: 799,  fitType: 'oversized', fabricWeight: 'medium', gender: 'men',    occasion: 'casual',  categorySlug: 't-shirts',    tags: ['longline','curved','premium'],  images: ['https://images.unsplash.com/photo-1503342394128-c104d54dba01?w=600'] },

  // ── SHIRTS (10) ─────────────────────────────────────────────
  { name: 'Oxford Button-Down Shirt',      slug: 'oxford-button-down-shirt',      basePrice: 1299, fitType: 'regular',   fabricWeight: 'medium', gender: 'men',    occasion: 'formal',  categorySlug: 'shirts',       tags: ['oxford','formal','cotton'],     images: ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600'] },
  { name: 'Linen Blend Summer Shirt',      slug: 'linen-blend-summer-shirt',      basePrice: 1199, fitType: 'regular',   fabricWeight: 'light',  gender: 'men',    occasion: 'casual',  categorySlug: 'shirts',       tags: ['linen','summer','breathable'],  images: ['https://images.unsplash.com/photo-1604335399105-a0c585fd81a1?w=600'] },
  { name: 'Slim Fit Formal Shirt',         slug: 'slim-fit-formal-shirt',         basePrice: 1399, fitType: 'slim',      fabricWeight: 'medium', gender: 'men',    occasion: 'formal',  categorySlug: 'shirts',       tags: ['formal','slim','office'],       images: ['https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=600'] },
  { name: 'Women Oversized Flannel Shirt', slug: 'women-oversized-flannel-shirt', basePrice: 1099, fitType: 'oversized', fabricWeight: 'heavy',  gender: 'women',  occasion: 'casual',  categorySlug: 'shirts',       tags: ['flannel','oversized','cozy'],   images: ['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600'] },
  { name: 'Cuban Collar Resort Shirt',     slug: 'cuban-collar-resort-shirt',     basePrice: 1249, fitType: 'regular',   fabricWeight: 'light',  gender: 'men',    occasion: 'casual',  categorySlug: 'shirts',       tags: ['cuban','resort','vacation'],    images: ['https://images.unsplash.com/photo-1563630423918-b58f07336ac9?w=600'] },
  { name: 'Denim Overshirt',               slug: 'denim-overshirt',               basePrice: 1599, fitType: 'oversized', fabricWeight: 'heavy',  gender: 'unisex', occasion: 'casual',  categorySlug: 'shirts',       tags: ['denim','overshirt','layer'],    images: ['https://images.unsplash.com/photo-1603344204980-4edb0ea63148?w=600'] },
  { name: 'Women Satin Slip Shirt',        slug: 'women-satin-slip-shirt',        basePrice: 1349, fitType: 'regular',   fabricWeight: 'light',  gender: 'women',  occasion: 'party',   categorySlug: 'shirts',       tags: ['satin','elegant','party'],      images: ['https://images.unsplash.com/photo-1591085686350-798c0f9faa1f?w=600'] },
  { name: 'Oversized Check Shirt',         slug: 'oversized-check-shirt',         basePrice: 1149, fitType: 'oversized', fabricWeight: 'medium', gender: 'unisex', occasion: 'casual',  categorySlug: 'shirts',       tags: ['check','plaid','oversized'],    images: ['https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=600'] },
  { name: 'Mandarin Collar Kurta Shirt',   slug: 'mandarin-collar-kurta-shirt',   basePrice: 999,  fitType: 'regular',   fabricWeight: 'light',  gender: 'men',    occasion: 'ethnic',  categorySlug: 'shirts',       tags: ['mandarin','ethnic','kurta'],    images: ['https://images.unsplash.com/photo-1583922606661-0822ed0bd916?w=600'] },
  { name: 'Half-Sleeve Printed Shirt',     slug: 'half-sleeve-printed-shirt',     basePrice: 1049, fitType: 'regular',   fabricWeight: 'light',  gender: 'men',    occasion: 'casual',  categorySlug: 'shirts',       tags: ['printed','tropical','summer'],  images: ['https://images.unsplash.com/photo-1598522335241-31b7af97fe3e?w=600'] },

  // ── JEANS (10) ──────────────────────────────────────────────
  { name: 'Indigo Raw Denim Jeans',        slug: 'indigo-raw-denim-jeans',        basePrice: 2499, fitType: 'slim',      fabricWeight: 'heavy',  gender: 'men',    occasion: 'casual',  categorySlug: 'jeans',        tags: ['raw','denim','indigo'],         images: ['https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=600'] },
  { name: 'Classic Straight-Leg Jeans',    slug: 'classic-straight-leg-jeans',    basePrice: 1999, fitType: 'regular',   fabricWeight: 'heavy',  gender: 'unisex', occasion: 'casual',  categorySlug: 'jeans',        tags: ['straight','classic','denim'],   images: ['https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600'] },
  { name: 'Women High-Rise Skinny Jeans',  slug: 'women-high-rise-skinny-jeans',  basePrice: 1799, fitType: 'slim',      fabricWeight: 'heavy',  gender: 'women',  occasion: 'casual',  categorySlug: 'jeans',        tags: ['highrise','skinny','women'],    images: ['https://images.unsplash.com/photo-1475178626620-a4d074967452?w=600'] },
  { name: 'Distressed Slim Fit Jeans',     slug: 'distressed-slim-fit-jeans',     basePrice: 2199, fitType: 'slim',      fabricWeight: 'heavy',  gender: 'men',    occasion: 'casual',  categorySlug: 'jeans',        tags: ['distressed','ripped','slim'],   images: ['https://images.unsplash.com/photo-1604176424472-17cd740f5c4f?w=600'] },
  { name: 'Wide Leg Boyfriend Jeans',      slug: 'wide-leg-boyfriend-jeans',      basePrice: 2099, fitType: 'oversized', fabricWeight: 'heavy',  gender: 'women',  occasion: 'casual',  categorySlug: 'jeans',        tags: ['wideleg','boyfriend','relaxed'], images: ['https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?w=600'] },
  { name: 'Tapered Ankle Jeans',           slug: 'tapered-ankle-jeans',           basePrice: 1899, fitType: 'slim',      fabricWeight: 'medium', gender: 'men',    occasion: 'casual',  categorySlug: 'jeans',        tags: ['tapered','ankle','cropped'],    images: ['https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600'] },
  { name: 'Black Coated Skinny Jeans',     slug: 'black-coated-skinny-jeans',     basePrice: 2299, fitType: 'slim',      fabricWeight: 'medium', gender: 'unisex', occasion: 'party',   categorySlug: 'jeans',        tags: ['black','coated','party'],       images: ['https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=600'] },
  { name: 'Light Wash Mom Jeans',          slug: 'light-wash-mom-jeans',          basePrice: 1749, fitType: 'regular',   fabricWeight: 'medium', gender: 'women',  occasion: 'casual',  categorySlug: 'jeans',        tags: ['lightwash','mom','vintage'],    images: ['https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=600'] },
  { name: 'Cargo Denim Jeans',             slug: 'cargo-denim-jeans',             basePrice: 2399, fitType: 'regular',   fabricWeight: 'heavy',  gender: 'men',    occasion: 'casual',  categorySlug: 'jeans',        tags: ['cargo','utility','pockets'],    images: ['https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600'] },
  { name: 'Flared Bell-Bottom Jeans',      slug: 'flared-bell-bottom-jeans',      basePrice: 1999, fitType: 'regular',   fabricWeight: 'heavy',  gender: 'women',  occasion: 'party',   categorySlug: 'jeans',        tags: ['flared','bellbottom','retro'],  images: ['https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=600'] },

  // ── TROUSERS (10) ───────────────────────────────────────────
  { name: 'Tapered Chino Trousers',        slug: 'tapered-chino-trousers',        basePrice: 1599, fitType: 'slim',      fabricWeight: 'medium', gender: 'men',    occasion: 'casual',  categorySlug: 'trousers',     tags: ['chino','tapered','versatile'],  images: ['https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600'] },
  { name: 'Wide Leg Linen Trousers',       slug: 'wide-leg-linen-trousers',       basePrice: 1799, fitType: 'oversized', fabricWeight: 'light',  gender: 'women',  occasion: 'casual',  categorySlug: 'trousers',     tags: ['linen','wideleg','summer'],     images: ['https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600'] },
  { name: 'Cargo Utility Trousers',        slug: 'cargo-utility-trousers',        basePrice: 1899, fitType: 'regular',   fabricWeight: 'heavy',  gender: 'men',    occasion: 'casual',  categorySlug: 'trousers',     tags: ['cargo','utility','tactical'],   images: ['https://images.unsplash.com/photo-1594938298603-c8148c4b4545?w=600'] },
  { name: 'Tailored Formal Trousers',      slug: 'tailored-formal-trousers',      basePrice: 2199, fitType: 'slim',      fabricWeight: 'medium', gender: 'men',    occasion: 'formal',  categorySlug: 'trousers',     tags: ['formal','tailored','office'],   images: ['https://images.unsplash.com/photo-1580657018950-c7f7d6a6d990?w=600'] },
  { name: 'Women Palazzo Trousers',        slug: 'women-palazzo-trousers',        basePrice: 1499, fitType: 'oversized', fabricWeight: 'light',  gender: 'women',  occasion: 'ethnic',  categorySlug: 'trousers',     tags: ['palazzo','flowy','ethnic'],     images: ['https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600'] },
  { name: 'Jogger Track Trousers',         slug: 'jogger-track-trousers',         basePrice: 1299, fitType: 'regular',   fabricWeight: 'medium', gender: 'unisex', occasion: 'sports',  categorySlug: 'trousers',     tags: ['jogger','track','sports'],      images: ['https://images.unsplash.com/photo-1547592180-85f173990554?w=600'] },
  { name: 'Pleated High-Waist Trousers',   slug: 'pleated-high-waist-trousers',   basePrice: 1999, fitType: 'regular',   fabricWeight: 'medium', gender: 'women',  occasion: 'formal',  categorySlug: 'trousers',     tags: ['pleated','highwaist','formal'], images: ['https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600'] },
  { name: 'Slim Corduroy Trousers',        slug: 'slim-corduroy-trousers',        basePrice: 1699, fitType: 'slim',      fabricWeight: 'heavy',  gender: 'men',    occasion: 'casual',  categorySlug: 'trousers',     tags: ['corduroy','autumn','textured'],  images: ['https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=600'] },
  { name: 'Women Satin Drape Trousers',    slug: 'women-satin-drape-trousers',    basePrice: 1849, fitType: 'regular',   fabricWeight: 'light',  gender: 'women',  occasion: 'party',   categorySlug: 'trousers',     tags: ['satin','party','elegant'],      images: ['https://images.unsplash.com/photo-1566206091558-7f218b696731?w=600'] },
  { name: 'Technical Slim Trousers',       slug: 'technical-slim-trousers',       basePrice: 2099, fitType: 'slim',      fabricWeight: 'medium', gender: 'men',    occasion: 'formal',  categorySlug: 'trousers',     tags: ['technical','stretch','travel'],  images: ['https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600'] },

  // ── HOODIES (10) ────────────────────────────────────────────
  { name: 'Classic Pullover Hoodie',       slug: 'classic-pullover-hoodie',       basePrice: 1699, fitType: 'regular',   fabricWeight: 'heavy',  gender: 'unisex', occasion: 'casual',  categorySlug: 'hoodies',      tags: ['pullover','fleece','basics'],   images: ['https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600'] },
  { name: 'Zip-Up Tech Fleece Hoodie',     slug: 'zip-up-tech-fleece-hoodie',     basePrice: 2299, fitType: 'slim',      fabricWeight: 'heavy',  gender: 'men',    occasion: 'sports',  categorySlug: 'hoodies',      tags: ['zipup','tech','athletic'],      images: ['https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600'] },
  { name: 'Oversized Drop-Shoulder Hoodie',slug: 'oversized-drop-shoulder-hoodie',basePrice: 1999, fitType: 'oversized', fabricWeight: 'heavy',  gender: 'unisex', occasion: 'casual',  categorySlug: 'hoodies',      tags: ['oversized','dropshoulder','streetwear'], images: ['https://images.unsplash.com/photo-1614495640710-e710a3a461fc?w=600'] },
  { name: 'Women Cropped Hoodie',          slug: 'women-cropped-hoodie',          basePrice: 1599, fitType: 'oversized', fabricWeight: 'medium', gender: 'women',  occasion: 'casual',  categorySlug: 'hoodies',      tags: ['cropped','women','cozy'],       images: ['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600'] },
  { name: 'Vintage Wash Hoodie',           slug: 'vintage-wash-hoodie',           basePrice: 1849, fitType: 'regular',   fabricWeight: 'heavy',  gender: 'unisex', occasion: 'casual',  categorySlug: 'hoodies',      tags: ['vintage','wash','retro'],       images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600'] },
  { name: 'Tie-Dye Pullover Hoodie',       slug: 'tie-dye-pullover-hoodie',       basePrice: 1749, fitType: 'oversized', fabricWeight: 'medium', gender: 'unisex', occasion: 'casual',  categorySlug: 'hoodies',      tags: ['tiedye','colorful','festival'], images: ['https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600'] },
  { name: 'Half-Zip Fleece Hoodie',        slug: 'half-zip-fleece-hoodie',        basePrice: 1999, fitType: 'regular',   fabricWeight: 'heavy',  gender: 'men',    occasion: 'sports',  categorySlug: 'hoodies',      tags: ['halfzip','fleece','outdoor'],   images: ['https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600'] },
  { name: 'Kangaroo Pocket Hoodie',        slug: 'kangaroo-pocket-hoodie',        basePrice: 1499, fitType: 'regular',   fabricWeight: 'heavy',  gender: 'unisex', occasion: 'casual',  categorySlug: 'hoodies',      tags: ['kangaroo','pocket','basics'],   images: ['https://images.unsplash.com/photo-1614495640710-e710a3a461fc?w=600'] },
  { name: 'Sherpa Lined Hoodie',           slug: 'sherpa-lined-hoodie',           basePrice: 2599, fitType: 'regular',   fabricWeight: 'heavy',  gender: 'unisex', occasion: 'casual',  categorySlug: 'hoodies',      tags: ['sherpa','lined','winter'],      images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600'] },
  { name: 'Women Fitted Zip Hoodie',       slug: 'women-fitted-zip-hoodie',       basePrice: 1699, fitType: 'slim',      fabricWeight: 'medium', gender: 'women',  occasion: 'sports',  categorySlug: 'hoodies',      tags: ['fitted','women','gym'],         images: ['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600'] },

  // ── JACKETS (10) ────────────────────────────────────────────
  { name: 'Bomber Flight Jacket',          slug: 'bomber-flight-jacket',          basePrice: 3499, fitType: 'regular',   fabricWeight: 'heavy',  gender: 'men',    occasion: 'casual',  categorySlug: 'jackets',      tags: ['bomber','flight','premium'],    images: ['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600'] },
  { name: 'Quilted Puffer Jacket',         slug: 'quilted-puffer-jacket',         basePrice: 3999, fitType: 'regular',   fabricWeight: 'heavy',  gender: 'unisex', occasion: 'casual',  categorySlug: 'jackets',      tags: ['puffer','quilted','winter'],    images: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600'] },
  { name: 'Washed Denim Trucker Jacket',   slug: 'washed-denim-trucker-jacket',   basePrice: 2999, fitType: 'regular',   fabricWeight: 'heavy',  gender: 'unisex', occasion: 'casual',  categorySlug: 'jackets',      tags: ['denim','trucker','vintage'],    images: ['https://images.unsplash.com/photo-1523205771623-e0faa4d2813d?w=600'] },
  { name: 'Technical Windbreaker',         slug: 'technical-windbreaker',         basePrice: 3299, fitType: 'regular',   fabricWeight: 'light',  gender: 'unisex', occasion: 'sports',  categorySlug: 'jackets',      tags: ['windbreaker','technical','outdoor'], images: ['https://images.unsplash.com/photo-1561052967-61fc91e48d79?w=600'] },
  { name: 'Women Cropped Blazer',          slug: 'women-cropped-blazer',          basePrice: 3199, fitType: 'slim',      fabricWeight: 'medium', gender: 'women',  occasion: 'formal',  categorySlug: 'jackets',      tags: ['blazer','cropped','formal'],    images: ['https://images.unsplash.com/photo-1580651315530-69c8e0026377?w=600'] },
  { name: 'Sherpa Fleece Jacket',          slug: 'sherpa-fleece-jacket',          basePrice: 3699, fitType: 'regular',   fabricWeight: 'heavy',  gender: 'unisex', occasion: 'casual',  categorySlug: 'jackets',      tags: ['sherpa','fleece','cozy'],       images: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600'] },
  { name: 'Leather Biker Jacket',          slug: 'leather-biker-jacket',          basePrice: 5999, fitType: 'slim',      fabricWeight: 'heavy',  gender: 'men',    occasion: 'casual',  categorySlug: 'jackets',      tags: ['leather','biker','premium'],    images: ['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600'] },
  { name: 'Coach Jacket',                  slug: 'coach-jacket',                  basePrice: 2799, fitType: 'regular',   fabricWeight: 'light',  gender: 'unisex', occasion: 'casual',  categorySlug: 'jackets',      tags: ['coach','nylon','streetwear'],   images: ['https://images.unsplash.com/photo-1523205771623-e0faa4d2813d?w=600'] },
  { name: 'Women Parka Winter Jacket',     slug: 'women-parka-winter-jacket',     basePrice: 4499, fitType: 'regular',   fabricWeight: 'heavy',  gender: 'women',  occasion: 'casual',  categorySlug: 'jackets',      tags: ['parka','winter','women'],       images: ['https://images.unsplash.com/photo-1580651315530-69c8e0026377?w=600'] },
  { name: 'Overshirt Utility Jacket',      slug: 'overshirt-utility-jacket',      basePrice: 2499, fitType: 'oversized', fabricWeight: 'heavy',  gender: 'men',    occasion: 'casual',  categorySlug: 'jackets',      tags: ['utility','overshirt','layer'],  images: ['https://images.unsplash.com/photo-1561052967-61fc91e48d79?w=600'] },

  // ── SHORTS (10) ─────────────────────────────────────────────
  { name: 'Chino Shorts',                  slug: 'chino-shorts',                  basePrice: 999,  fitType: 'regular',   fabricWeight: 'medium', gender: 'men',    occasion: 'casual',  categorySlug: 'shorts',       tags: ['chino','summer','casual'],      images: ['https://images.unsplash.com/photo-1591195853828-11db59a44f43?w=600'] },
  { name: 'Athletic Running Shorts',       slug: 'athletic-running-shorts',       basePrice: 899,  fitType: 'regular',   fabricWeight: 'light',  gender: 'men',    occasion: 'sports',  categorySlug: 'shorts',       tags: ['athletic','running','dri-fit'], images: ['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600'] },
  { name: 'Women Denim Cutoff Shorts',     slug: 'women-denim-cutoff-shorts',     basePrice: 1099, fitType: 'regular',   fabricWeight: 'medium', gender: 'women',  occasion: 'casual',  categorySlug: 'shorts',       tags: ['denim','cutoff','summer'],      images: ['https://images.unsplash.com/photo-1591195853828-11db59a44f43?w=600'] },
  { name: 'Cargo Shorts',                  slug: 'cargo-shorts',                  basePrice: 1199, fitType: 'regular',   fabricWeight: 'medium', gender: 'men',    occasion: 'casual',  categorySlug: 'shorts',       tags: ['cargo','utility','pockets'],    images: ['https://images.unsplash.com/photo-1594938298603-c8148c4b4545?w=600'] },
  { name: 'Swim Board Shorts',             slug: 'swim-board-shorts',             basePrice: 1299, fitType: 'regular',   fabricWeight: 'light',  gender: 'men',    occasion: 'casual',  categorySlug: 'shorts',       tags: ['swim','beach','tropical'],      images: ['https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600'] },
  { name: 'Women Biker Shorts',            slug: 'women-biker-shorts',            basePrice: 799,  fitType: 'slim',      fabricWeight: 'medium', gender: 'women',  occasion: 'sports',  categorySlug: 'shorts',       tags: ['biker','gym','spandex'],        images: ['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600'] },
  { name: 'Linen Drawstring Shorts',       slug: 'linen-drawstring-shorts',       basePrice: 1099, fitType: 'regular',   fabricWeight: 'light',  gender: 'men',    occasion: 'casual',  categorySlug: 'shorts',       tags: ['linen','drawstring','resort'],  images: ['https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600'] },
  { name: 'Women Tennis Shorts',           slug: 'women-tennis-shorts',           basePrice: 949,  fitType: 'regular',   fabricWeight: 'light',  gender: 'women',  occasion: 'sports',  categorySlug: 'shorts',       tags: ['tennis','pleated','athletic'],  images: ['https://images.unsplash.com/photo-1591195853828-11db59a44f43?w=600'] },
  { name: 'Tailored Bermuda Shorts',       slug: 'tailored-bermuda-shorts',       basePrice: 1349, fitType: 'regular',   fabricWeight: 'medium', gender: 'men',    occasion: 'casual',  categorySlug: 'shorts',       tags: ['bermuda','tailored','smart'],   images: ['https://images.unsplash.com/photo-1594938298603-c8148c4b4545?w=600'] },
  { name: 'Thermal Compression Shorts',    slug: 'thermal-compression-shorts',    basePrice: 1199, fitType: 'slim',      fabricWeight: 'medium', gender: 'unisex', occasion: 'sports',  categorySlug: 'shorts',       tags: ['compression','thermal','gym'],  images: ['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600'] },

  // ── CO-ORDS (10) ─────────────────────────────────────────────
  { name: 'Linen Co-ord Set',              slug: 'linen-co-ord-set',              basePrice: 2499, fitType: 'regular',   fabricWeight: 'light',  gender: 'men',    occasion: 'casual',  categorySlug: 'co-ords',      tags: ['linen','coord','matching'],     images: ['https://images.unsplash.com/photo-1594938298603-c8148c4b4545?w=600'] },
  { name: 'Women Floral Print Co-ord',     slug: 'women-floral-print-co-ord',     basePrice: 2199, fitType: 'regular',   fabricWeight: 'light',  gender: 'women',  occasion: 'casual',  categorySlug: 'co-ords',      tags: ['floral','coord','summer'],      images: ['https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600'] },
  { name: 'Tracksuit Co-ord Set',          slug: 'tracksuit-co-ord-set',          basePrice: 2799, fitType: 'regular',   fabricWeight: 'medium', gender: 'unisex', occasion: 'sports',  categorySlug: 'co-ords',      tags: ['tracksuit','athletic','coord'],  images: ['https://images.unsplash.com/photo-1547592180-85f173990554?w=600'] },
  { name: 'Satin Evening Co-ord',          slug: 'satin-evening-co-ord',          basePrice: 3199, fitType: 'regular',   fabricWeight: 'light',  gender: 'women',  occasion: 'party',   categorySlug: 'co-ords',      tags: ['satin','evening','party'],      images: ['https://images.unsplash.com/photo-1566206091558-7f218b696731?w=600'] },
  { name: 'Striped Casual Co-ord',         slug: 'striped-casual-co-ord',         basePrice: 1999, fitType: 'regular',   fabricWeight: 'medium', gender: 'men',    occasion: 'casual',  categorySlug: 'co-ords',      tags: ['striped','coord','basics'],     images: ['https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600'] },
  { name: 'Women Tie-Dye Co-ord',          slug: 'women-tie-dye-co-ord',          basePrice: 2299, fitType: 'oversized', fabricWeight: 'light',  gender: 'women',  occasion: 'casual',  categorySlug: 'co-ords',      tags: ['tiedye','coord','colorful'],    images: ['https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600'] },
  { name: 'Ethnic Kurta Set',              slug: 'ethnic-kurta-set',              basePrice: 2699, fitType: 'regular',   fabricWeight: 'light',  gender: 'men',    occasion: 'ethnic',  categorySlug: 'co-ords',      tags: ['kurta','ethnic','festive'],     images: ['https://images.unsplash.com/photo-1583922606661-0822ed0bd916?w=600'] },
  { name: 'Denim Co-ord Set',              slug: 'denim-co-ord-set',              basePrice: 3499, fitType: 'regular',   fabricWeight: 'heavy',  gender: 'unisex', occasion: 'casual',  categorySlug: 'co-ords',      tags: ['denim','matching','coord'],     images: ['https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600'] },
  { name: 'Women Crop Top Skirt Set',      slug: 'women-crop-top-skirt-set',      basePrice: 1899, fitType: 'regular',   fabricWeight: 'light',  gender: 'women',  occasion: 'party',   categorySlug: 'co-ords',      tags: ['crop','skirt','set'],           images: ['https://images.unsplash.com/photo-1566206091558-7f218b696731?w=600'] },
  { name: 'Matching Shorts And Tee Set',   slug: 'matching-shorts-and-tee-set',   basePrice: 1799, fitType: 'regular',   fabricWeight: 'medium', gender: 'unisex', occasion: 'sports',  categorySlug: 'co-ords',      tags: ['matching','set','gym'],         images: ['https://images.unsplash.com/photo-1547592180-85f173990554?w=600'] },

  // ── SWEATSHIRTS (10) ────────────────────────────────────────
  { name: 'Classic Crewneck Sweatshirt',   slug: 'classic-crewneck-sweatshirt',   basePrice: 1399, fitType: 'regular',   fabricWeight: 'heavy',  gender: 'unisex', occasion: 'casual',  categorySlug: 'sweatshirts',  tags: ['crewneck','fleece','basics'],   images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600'] },
  { name: 'Graphic Print Sweatshirt',      slug: 'graphic-print-sweatshirt',      basePrice: 1599, fitType: 'oversized', fabricWeight: 'heavy',  gender: 'unisex', occasion: 'casual',  categorySlug: 'sweatshirts',  tags: ['graphic','print','streetwear'], images: ['https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600'] },
  { name: 'Women Cropped Sweatshirt',      slug: 'women-cropped-sweatshirt',      basePrice: 1299, fitType: 'regular',   fabricWeight: 'medium', gender: 'women',  occasion: 'casual',  categorySlug: 'sweatshirts',  tags: ['cropped','women','cozy'],       images: ['https://images.unsplash.com/photo-1614495640710-e710a3a461fc?w=600'] },
  { name: 'Embroidered Sweatshirt',        slug: 'embroidered-sweatshirt',        basePrice: 1799, fitType: 'regular',   fabricWeight: 'heavy',  gender: 'unisex', occasion: 'casual',  categorySlug: 'sweatshirts',  tags: ['embroidered','premium','detail'], images: ['https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600'] },
  { name: 'Quarter Zip Sweatshirt',        slug: 'quarter-zip-sweatshirt',        basePrice: 1699, fitType: 'slim',      fabricWeight: 'heavy',  gender: 'men',    occasion: 'casual',  categorySlug: 'sweatshirts',  tags: ['quarterzip','preppy','collegiate'], images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600'] },
  { name: 'Tie-Dye Crewneck Sweatshirt',  slug: 'tie-dye-crewneck-sweatshirt',   basePrice: 1499, fitType: 'oversized', fabricWeight: 'heavy',  gender: 'unisex', occasion: 'casual',  categorySlug: 'sweatshirts',  tags: ['tiedye','crewneck','colorful'],  images: ['https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600'] },
  { name: 'College Varsity Sweatshirt',    slug: 'college-varsity-sweatshirt',    basePrice: 1549, fitType: 'regular',   fabricWeight: 'heavy',  gender: 'unisex', occasion: 'casual',  categorySlug: 'sweatshirts',  tags: ['varsity','college','retro'],    images: ['https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600'] },
  { name: 'Brushed Cotton Sweatshirt',     slug: 'brushed-cotton-sweatshirt',     basePrice: 1649, fitType: 'regular',   fabricWeight: 'heavy',  gender: 'unisex', occasion: 'casual',  categorySlug: 'sweatshirts',  tags: ['brushed','cotton','soft'],      images: ['https://images.unsplash.com/photo-1614495640710-e710a3a461fc?w=600'] },
  { name: 'Women Drop Shoulder Sweatshirt',slug: 'women-drop-shoulder-sweatshirt',basePrice: 1449, fitType: 'oversized', fabricWeight: 'medium', gender: 'women',  occasion: 'casual',  categorySlug: 'sweatshirts',  tags: ['dropshoulder','cozy','women'],  images: ['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600'] },
  { name: 'Thermal Waffle Sweatshirt',     slug: 'thermal-waffle-sweatshirt',     basePrice: 1349, fitType: 'regular',   fabricWeight: 'medium', gender: 'unisex', occasion: 'casual',  categorySlug: 'sweatshirts',  tags: ['waffle','thermal','textured'],  images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600'] },

  // ── ACCESSORIES (10)
  { name: 'Classic Baseball Cap',          slug: 'classic-baseball-cap',          basePrice: 599,  fitType: 'regular',   fabricWeight: 'light',  gender: 'unisex', occasion: 'casual',  categorySlug: 'accessories',  tags: ['cap','baseball','streetwear'],  images: ['https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600'] },
  { name: 'Canvas Tote Bag',               slug: 'canvas-tote-bag',               basePrice: 799,  fitType: 'regular',   fabricWeight: 'medium', gender: 'unisex', occasion: 'casual',  categorySlug: 'accessories',  tags: ['tote','canvas','eco'],          images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600'] },
  { name: 'Knit Beanie',                   slug: 'knit-beanie',                   basePrice: 499,  fitType: 'regular',   fabricWeight: 'heavy',  gender: 'unisex', occasion: 'casual',  categorySlug: 'accessories',  tags: ['beanie','knit','winter'],       images: ['https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=600'] },
  { name: 'Leather Belt',                  slug: 'leather-belt',                  basePrice: 899,  fitType: 'regular',   fabricWeight: 'medium', gender: 'men',    occasion: 'formal',  categorySlug: 'accessories',  tags: ['belt','leather','formal'],      images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600'] },
  { name: 'Chunky Knit Scarf',             slug: 'chunky-knit-scarf',             basePrice: 699,  fitType: 'regular',   fabricWeight: 'heavy',  gender: 'unisex', occasion: 'casual',  categorySlug: 'accessories',  tags: ['scarf','knit','winter'],        images: ['https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=600'] },
  { name: 'Crossbody Mini Bag',            slug: 'crossbody-mini-bag',            basePrice: 1299, fitType: 'regular',   fabricWeight: 'medium', gender: 'women',  occasion: 'casual',  categorySlug: 'accessories',  tags: ['crossbody','bag','women'],      images: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600'] },
  { name: 'Sunglasses Aviator Style',      slug: 'sunglasses-aviator-style',      basePrice: 999,  fitType: 'regular',   fabricWeight: 'light',  gender: 'unisex', occasion: 'casual',  categorySlug: 'accessories',  tags: ['sunglasses','aviator','summer'], images: ['https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600'] },
  { name: 'Wool Blend Gloves',             slug: 'wool-blend-gloves',             basePrice: 549,  fitType: 'regular',   fabricWeight: 'heavy',  gender: 'unisex', occasion: 'casual',  categorySlug: 'accessories',  tags: ['gloves','wool','winter'],       images: ['https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=600'] },
  { name: 'Backpack 20L',                  slug: 'backpack-20l',                  basePrice: 2199, fitType: 'regular',   fabricWeight: 'medium', gender: 'unisex', occasion: 'casual',  categorySlug: 'accessories',  tags: ['backpack','travel','everyday'], images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600'] },
  { name: 'Bucket Hat',                    slug: 'bucket-hat',                    basePrice: 649,  fitType: 'regular',   fabricWeight: 'light',  gender: 'unisex', occasion: 'casual',  categorySlug: 'accessories',  tags: ['bucket','hat','festival'],      images: ['https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600'] },
];

// ── Variant Generator ─────────────────────────────────────────
const COLORS = [
  { color: 'black',    colorLabel: 'Black' },
  { color: 'white',    colorLabel: 'White' },
  { color: 'navy',     colorLabel: 'Navy Blue' },
  { color: 'olive',    colorLabel: 'Olive Green' },
  { color: 'charcoal', colorLabel: 'Charcoal' },
  { color: 'beige',    colorLabel: 'Beige' },
  { color: 'red',      colorLabel: 'Crimson Red' },
  { color: 'brown',    colorLabel: 'Chocolate Brown' },
];

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

function generateVariants(productId, basePrice, index) {
  const variants = [];
  // Pick 2 deterministic colors per product (not random so seed is reproducible)
  const colorA = COLORS[index % COLORS.length];
  const colorB = COLORS[(index + 3) % COLORS.length];

  for (const { color, colorLabel } of [colorA, colorB]) {
    for (const size of SIZES) {
      const skuParts = [
        productId.toString().slice(-6).toUpperCase(),
        color.slice(0, 3).toUpperCase(),
        size,
      ];
      const priceAdj = size === 'XXL' ? 150 : size === 'XL' ? 100 : 0;
      const stockLevel = 5 + ((index * 7 + SIZES.indexOf(size) * 3) % 46); // 5–50, deterministic

      variants.push({
        product: productId,
        size,
        color,
        colorLabel,
        stock: stockLevel,
        reserved: 0,
        price: basePrice + priceAdj,
        sku: skuParts.join('-'),
      });
    }
  }
  return variants;
}

// ── Main Seed ─────────────────────────────────────────────────
async function seed() {
  await connectDB();
  console.log('🌱 Starting seed — 10 categories, 100 products...');

  await ProductVariant.deleteMany({});
  await Product.deleteMany({});
  await Category.deleteMany({});
  console.log('🗑️  Cleared existing data');

  const insertedCategories = await Category.insertMany(categoryData);
  const categoryMap = {};
  for (const cat of insertedCategories) {
    categoryMap[cat.slug] = cat._id;
  }
  console.log(`✅ Inserted ${insertedCategories.length} categories`);

  const productsToInsert = productData.map((p) => ({
    name: p.name,
    slug: p.slug,
    description: `${p.name} — crafted for the modern wardrobe. ${p.tags.join(', ')}.`,
    basePrice: p.basePrice,
    fitType: p.fitType,
    fabricWeight: p.fabricWeight,
    gender: p.gender,
    occasion: p.occasion,
    category: categoryMap[p.categorySlug],
    images: p.images,
    tags: p.tags,
    isActive: true,
  }));

  const insertedProducts = await Product.insertMany(productsToInsert);
  console.log(`✅ Inserted ${insertedProducts.length} products`);

  const allVariants = [];
  insertedProducts.forEach((product, i) => {
    const variants = generateVariants(product._id, product.basePrice, i);
    allVariants.push(...variants);
  });

  const insertedVariants = await ProductVariant.insertMany(allVariants);
  console.log(`✅ Inserted ${insertedVariants.length} variants (${insertedProducts.length} products × 2 colors × 6 sizes)`);

  console.log('🎉 Seed complete! Summary:');
  console.log(`   Categories : ${insertedCategories.length}`);
  console.log(`   Products   : ${insertedProducts.length}`);
  console.log(`   Variants   : ${insertedVariants.length}`);

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err.message);
  process.exit(1);
});
