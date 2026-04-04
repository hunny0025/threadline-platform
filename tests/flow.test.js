const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/app');
const User = require('../src/models/User');
const Product = require('../src/models/Product');
const ProductVariant = require('../src/models/ProductVariant');
const Category = require('../src/models/Category');
const Cart = require('../src/models/Cart');
const Order = require('../src/models/Order');

let mongoServer;

// Test data
let authToken;
let testUser;
let testCategory;
let testProduct;
let testVariant;
let testOrder;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  // Clear collections
  await User.deleteMany({});
  await Product.deleteMany({});
  await ProductVariant.deleteMany({});
  await Category.deleteMany({});
  await Cart.deleteMany({});
  await Order.deleteMany({});

  // Create test category
  testCategory = await Category.create({
    name: 'T-Shirts',
    slug: 't-shirts',
    description: 'Casual t-shirts',
  });

  // Create test product
  testProduct = await Product.create({
    name: 'Classic White T-Shirt',
    slug: 'classic-white-tshirt',
    description: 'A classic white cotton t-shirt',
    basePrice: 499,
    category: testCategory._id,
    isActive: true,
    images: ['/uploads/tshirt.jpg'],
    tags: ['cotton', 'casual'],
    fitType: 'regular',
    fabricWeight: 'medium',
    gender: 'men',
    occasion: 'casual',
  });

  // Create test variant
  testVariant = await ProductVariant.create({
    product: testProduct._id,
    size: 'M',
    color: 'White',
    stock: 100,
    price: 499,
    sku: 'CWT-M-WH',
  });
});

describe('Auth Flow', () => {
  describe('POST /api/v1/auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('id');
      expect(res.body.data.email).toBe('test@example.com');
    });

    it('should reject duplicate email', async () => {
      await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'Test User',
          email: 'duplicate@example.com',
          password: 'password123',
        });

      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'Test User',
          email: 'duplicate@example.com',
          password: 'password123',
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('already registered');
    });

    it('should reject missing fields', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({ name: 'Test User' });

      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/v1/auth/login', () => {
    beforeEach(async () => {
      testUser = await User.create({
        name: 'Login Test',
        email: 'login@test.com',
        password: 'password123',
      });
    });

    it('should login with valid credentials', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'login@test.com',
          password: 'password123',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('accessToken');
      authToken = res.body.data.accessToken;
    });

    it('should reject invalid password', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'login@test.com',
          password: 'wrongpassword',
        });

      expect(res.status).toBe(401);
    });

    it('should reject non-existent user', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'nonexistent@test.com',
          password: 'password123',
        });

      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/v1/auth/logout', () => {
    it('should logout successfully', async () => {
      const res = await request(app)
        .post('/api/v1/auth/logout');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});

describe('Cart Flow', () => {
  beforeEach(async () => {
    testUser = await User.create({
      name: 'Cart Test',
      email: 'cart@test.com',
      password: 'password123',
    });

    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'cart@test.com',
        password: 'password123',
      });

    authToken = res.body.data.accessToken;
  });

  describe('GET /api/v1/cart', () => {
    it('should get empty cart for authenticated user', async () => {
      const res = await request(app)
        .get('/api/v1/cart')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('items');
    });

    it('should require auth or session', async () => {
      const res = await request(app)
        .get('/api/v1/cart');

      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/v1/cart/add', () => {
    it('should add item to cart', async () => {
      const res = await request(app)
        .post('/api/v1/cart/add')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          variantId: testVariant._id.toString(),
          quantity: 2,
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.items).toHaveLength(1);
    });

    it('should reject invalid variant', async () => {
      const res = await request(app)
        .post('/api/v1/cart/add')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          variantId: new mongoose.Types.ObjectId().toString(),
          quantity: 1,
        });

      expect(res.status).toBe(404);
    });

    it('should reject without variantId', async () => {
      const res = await request(app)
        .post('/api/v1/cart/add')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ quantity: 1 });

      expect(res.status).toBe(400);
    });
  });

  describe('PATCH /api/v1/cart/update', () => {
    beforeEach(async () => {
      // Create cart with item
      await Cart.create({
        userId: testUser._id,
        items: [{ variant: testVariant._id, quantity: 1 }],
      });
    });

    it('should update item quantity', async () => {
      const res = await request(app)
        .patch('/api/v1/cart/update')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          variantId: testVariant._id.toString(),
          quantity: 3,
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('should remove item when quantity is 0', async () => {
      const res = await request(app)
        .patch('/api/v1/cart/update')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          variantId: testVariant._id.toString(),
          quantity: 0,
        });

      expect(res.status).toBe(200);
    });
  });

  describe('DELETE /api/v1/cart/remove', () => {
    beforeEach(async () => {
      await Cart.create({
        userId: testUser._id,
        items: [{ variant: testVariant._id, quantity: 2 }],
      });
    });

    it('should remove item from cart', async () => {
      const res = await request(app)
        .delete('/api/v1/cart/remove')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          variantId: testVariant._id.toString(),
        });

      expect(res.status).toBe(200);
    });
  });
});

describe('Order Flow', () => {
  beforeEach(async () => {
    testUser = await User.create({
      name: 'Order Test',
      email: 'order@test.com',
      password: 'password123',
    });

    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'order@test.com',
        password: 'password123',
      });

    authToken = res.body.data.accessToken;

    // Create cart with item
    await Cart.create({
      userId: testUser._id,
      items: [{ variant: testVariant._id, quantity: 1 }],
    });
  });

  describe('POST /api/v1/orders', () => {
    it('should create order from cart', async () => {
      const res = await request(app)
        .post('/api/v1/orders')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('totalAmount');
      expect(res.body.data.items).toHaveLength(1);
      testOrder = res.body.data;
    });

    it('should reject empty cart', async () => {
      await Cart.findOneAndUpdate(
        { userId: testUser._id },
        { items: [] }
      );

      const res = await request(app)
        .post('/api/v1/orders')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('empty');
    });

    it('should require authentication', async () => {
      const res = await request(app)
        .post('/api/v1/orders');

      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/v1/orders', () => {
    beforeEach(async () => {
      // Create an order
      testOrder = await Order.create({
        userId: testUser._id,
        items: [{
          productId: testProduct._id,
          variantId: testVariant._id,
          size: testVariant.size,
          color: testVariant.color,
          price: testVariant.price,
          quantity: 1,
        }],
        totalAmount: 499,
        statusHistory: [{ status: 'placed' }],
      });
    });

    it('should get user order history', async () => {
      const res = await request(app)
        .get('/api/v1/orders')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.data).toHaveLength(1);
    });

    it('should require authentication', async () => {
      const res = await request(app)
        .get('/api/v1/orders');

      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/v1/orders/:id', () => {
    beforeEach(async () => {
      testOrder = await Order.create({
        userId: testUser._id,
        items: [{
          productId: testProduct._id,
          variantId: testVariant._id,
          size: testVariant.size,
          color: testVariant.color,
          price: testVariant.price,
          quantity: 1,
        }],
        totalAmount: 499,
        statusHistory: [{ status: 'placed' }],
      });
    });

    it('should get order by id', async () => {
      const res = await request(app)
        .get(`/api/v1/orders/${testOrder._id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data._id).toBe(testOrder._id.toString());
    });

    it('should return 404 for non-existent order', async () => {
      const res = await request(app)
        .get(`/api/v1/orders/${new mongoose.Types.ObjectId()}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(404);
    });
  });

  describe('POST /api/v1/orders/:id/cancel', () => {
    beforeEach(async () => {
      testOrder = await Order.create({
        userId: testUser._id,
        items: [{
          productId: testProduct._id,
          variantId: testVariant._id,
          size: testVariant.size,
          color: testVariant.color,
          price: testVariant.price,
          quantity: 1,
        }],
        totalAmount: 499,
        statusHistory: [{ status: 'placed' }],
      });
    });

    it('should cancel placed order', async () => {
      const res = await request(app)
        .post(`/api/v1/orders/${testOrder._id}/cancel`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.statusHistory).toHaveLength(2);
    });

    it('should reject cancellation of shipped order', async () => {
      testOrder.statusHistory.push({ status: 'shipped' });
      await testOrder.save();

      const res = await request(app)
        .post(`/api/v1/orders/${testOrder._id}/cancel`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(400);
    });
  });
});

describe('Payment Flow', () => {
  beforeEach(async () => {
    testUser = await User.create({
      name: 'Payment Test',
      email: 'payment@test.com',
      password: 'password123',
    });

    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'payment@test.com',
        password: 'password123',
      });

    authToken = res.body.data.accessToken;

    // Create order
    testOrder = await Order.create({
      userId: testUser._id,
      items: [{
        productId: testProduct._id,
        variantId: testVariant._id,
        size: testVariant.size,
        color: testVariant.color,
        price: testVariant.price,
        quantity: 1,
      }],
      totalAmount: 499,
      statusHistory: [{ status: 'placed' }],
    });
  });

  describe('POST /api/v1/payment/create-intent', () => {
    it('should reject non-existent order', async () => {
      const res = await request(app)
        .post('/api/v1/payment/create-intent')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ orderId: new mongoose.Types.ObjectId().toString() });

      expect(res.status).toBe(404);
    });

    it('should reject without orderId', async () => {
      const res = await request(app)
        .post('/api/v1/payment/create-intent')
        .set('Authorization', `Bearer ${authToken}`)
        .send({});

      expect(res.status).toBe(400);
    });

    it('should require authentication', async () => {
      const res = await request(app)
        .post('/api/v1/payment/create-intent')
        .send({ orderId: testOrder._id.toString() });

      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/v1/payment/confirm', () => {
    it('should require all payment fields', async () => {
      const res = await request(app)
        .post('/api/v1/payment/confirm')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          razorpayOrderId: 'test_order',
          razorpayPaymentId: 'test_payment',
        });

      expect(res.status).toBe(400);
    });

    it('should require authentication', async () => {
      const res = await request(app)
        .post('/api/v1/payment/confirm')
        .send({});

      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/v1/payment/webhook', () => {
    it('should handle payment webhook', async () => {
      const res = await request(app)
        .post('/api/v1/payment/webhook')
        .send({
          event: 'payment.captured',
          payload: {
            payment: {
              entity: {
                id: 'pay_test',
                notes: { orderId: testOrder._id.toString() },
              },
            },
          },
        });

      expect(res.status).toBe(200);
    });

    it('should handle payment failed webhook', async () => {
      const res = await request(app)
        .post('/api/v1/payment/webhook')
        .send({
          event: 'payment.failed',
          payload: {
            payment: {
              entity: {
                id: 'pay_failed',
                notes: { orderId: testOrder._id.toString() },
              },
            },
          },
        });

      expect(res.status).toBe(200);
    });
  });
});

describe('Full Flow Integration', () => {
  it('should complete full flow: register → login → cart → order → payment', async () => {
    // 1. Register
    const registerRes = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Full Flow Test',
        email: 'fullflow@test.com',
        password: 'password123',
      });

    expect(registerRes.status).toBe(201);

    // 2. Login
    const loginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'fullflow@test.com',
        password: 'password123',
      });

    expect(loginRes.status).toBe(200);
    const token = loginRes.body.data.accessToken;

    // 3. Add to cart
    const addCartRes = await request(app)
      .post('/api/v1/cart/add')
      .set('Authorization', `Bearer ${token}`)
      .send({
        variantId: testVariant._id.toString(),
        quantity: 2,
      });

    expect(addCartRes.status).toBe(201);

    // 4. Create order
    const orderRes = await request(app)
      .post('/api/v1/orders')
      .set('Authorization', `Bearer ${token}`);

    expect(orderRes.status).toBe(201);
    const orderId = orderRes.body.data._id;

    // 5. Get order details
    const getOrderRes = await request(app)
      .get(`/api/v1/orders/${orderId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(getOrderRes.status).toBe(200);
    expect(getOrderRes.body.data.totalAmount).toBeGreaterThan(0);

    // 6. Get order history
    const historyRes = await request(app)
      .get('/api/v1/orders')
      .set('Authorization', `Bearer ${token}`);

    expect(historyRes.status).toBe(200);
    expect(historyRes.body.data.data).toHaveLength(1);
  });
});