

import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../app.js'; // Express app (no listen())
import AnalyticsEvent from '../models/AnalyticsEvent.js';


let mongod;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

afterEach(async () => {
  await AnalyticsEvent.deleteMany({});
});



const SESSION_ID = 'sess_test_abc123xyz';
const PRODUCT_ID = new mongoose.Types.ObjectId().toString();

const validPageView = {
  eventType: 'page_view',
  sessionId: SESSION_ID,
  page: '/shop/men',
  referrer: 'https://instagram.com',
};

const validProductClick = {
  eventType: 'product_click',
  sessionId: SESSION_ID,
  productId: PRODUCT_ID,
  productName: 'Linen Overshirt',
  category: 'Tops',
};

const validCartAdd = {
  eventType: 'cart_add',
  sessionId: SESSION_ID,
  productId: PRODUCT_ID,
  productName: 'Linen Overshirt',
  category: 'Tops',
  quantity: 2,
  price: 2499,
};


describe('POST /api/analytics/events', () => {


  test('logs a page_view event successfully', async () => {
    const res = await request(app)
      .post('/api/analytics/events')
      .send(validPageView)
      .expect(201);

    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('eventId');

    const saved = await AnalyticsEvent.findById(res.body.data.eventId);
    expect(saved).not.toBeNull();
    expect(saved.eventType).toBe('page_view');
    expect(saved.payload.page).toBe('/shop/men');
    expect(saved.payload.referrer).toBe('https://instagram.com');
    expect(saved.sessionId).toBe(SESSION_ID);
  });

  test('logs a product_click event successfully', async () => {
    const res = await request(app)
      .post('/api/analytics/events')
      .send(validProductClick)
      .expect(201);

    expect(res.body.success).toBe(true);
    const saved = await AnalyticsEvent.findById(res.body.data.eventId);
    expect(saved.eventType).toBe('product_click');
    expect(saved.payload.productId.toString()).toBe(PRODUCT_ID);
    expect(saved.payload.productName).toBe('Linen Overshirt');
  });

  test('logs a cart_add event with quantity + price', async () => {
    const res = await request(app)
      .post('/api/analytics/events')
      .send(validCartAdd)
      .expect(201);

    const saved = await AnalyticsEvent.findById(res.body.data.eventId);
    expect(saved.eventType).toBe('cart_add');
    expect(saved.payload.quantity).toBe(2);
    expect(saved.payload.price).toBe(2499);
  });

  test('logs event with userId when provided', async () => {
    const userId = new mongoose.Types.ObjectId().toString();
    const res = await request(app)
      .post('/api/analytics/events')
      .send({ ...validPageView, userId })
      .expect(201);

    const saved = await AnalyticsEvent.findById(res.body.data.eventId);
    expect(saved.userId.toString()).toBe(userId);
  });

  test('userId defaults to null for anonymous/guest sessions', async () => {
    const res = await request(app)
      .post('/api/analytics/events')
      .send(validPageView)
      .expect(201);

    const saved = await AnalyticsEvent.findById(res.body.data.eventId);
    expect(saved.userId).toBeNull();
  });

  test('captures device type from User-Agent header', async () => {
    const res = await request(app)
      .post('/api/analytics/events')
      .set('User-Agent', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17)')
      .send(validPageView)
      .expect(201);

    const saved = await AnalyticsEvent.findById(res.body.data.eventId);
    expect(saved.meta.device).toBe('mobile');
  });


  test('returns 400 when eventType is missing', async () => {
    const { eventType, ...body } = validPageView;
    const res = await request(app)
      .post('/api/analytics/events')
      .send(body)
      .expect(400);

    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/eventType/i);
  });

  test('returns 400 when eventType is invalid', async () => {
    const res = await request(app)
      .post('/api/analytics/events')
      .send({ ...validPageView, eventType: 'wishlist_add' })
      .expect(400);

    expect(res.body.success).toBe(false);
  });

  test('returns 400 when sessionId is missing', async () => {
    const { sessionId, ...body } = validPageView;
    const res = await request(app)
      .post('/api/analytics/events')
      .send(body)
      .expect(400);

    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/sessionId/i);
  });

  test('returns 400 when sessionId is too short (< 8 chars)', async () => {
    const res = await request(app)
      .post('/api/analytics/events')
      .send({ ...validPageView, sessionId: 'ab' })
      .expect(400);

    expect(res.body.success).toBe(false);
  });

  test('returns 400 for page_view without page field', async () => {
    const { page, ...body } = validPageView;
    const res = await request(app)
      .post('/api/analytics/events')
      .send(body)
      .expect(400);

    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/page/i);
  });

  test('returns 400 for product_click without productId', async () => {
    const { productId, ...body } = validProductClick;
    const res = await request(app)
      .post('/api/analytics/events')
      .send(body)
      .expect(400);

    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/productId/i);
  });

  test('returns 400 for cart_add without productId', async () => {
    const { productId, ...body } = validCartAdd;
    const res = await request(app)
      .post('/api/analytics/events')
      .send(body)
      .expect(400);

    expect(res.body.success).toBe(false);
  });

  test('returns 400 when userId is a malformed ObjectId', async () => {
    const res = await request(app)
      .post('/api/analytics/events')
      .send({ ...validPageView, userId: 'not-an-objectid' })
      .expect(400);

    expect(res.body.success).toBe(false);
  });

  

  test('cart_add defaults quantity to 1 when not provided', async () => {
    const { quantity, ...body } = validCartAdd;
    const res = await request(app)
      .post('/api/analytics/events')
      .send(body)
      .expect(201);

    const saved = await AnalyticsEvent.findById(res.body.data.eventId);
    expect(saved.payload.quantity).toBe(1);
  });

  test('page_view stores null referrer when not provided', async () => {
    const { referrer, ...body } = validPageView;
    const res = await request(app)
      .post('/api/analytics/events')
      .send(body)
      .expect(201);

    const saved = await AnalyticsEvent.findById(res.body.data.eventId);
    expect(saved.payload.referrer).toBeNull();
  });
});



describe('GET /api/analytics/summary', () => {
  // Seed some events before running summary tests
  beforeEach(async () => {
    await AnalyticsEvent.insertMany([
      {
        eventType: 'page_view', sessionId: SESSION_ID,
        payload: { page: '/' }, meta: { device: 'desktop' },
      },
      {
        eventType: 'product_click', sessionId: SESSION_ID,
        payload: { productId: PRODUCT_ID, productName: 'Linen Overshirt' },
        meta: { device: 'mobile' },
      },
      {
        eventType: 'cart_add', sessionId: SESSION_ID,
        payload: { productId: PRODUCT_ID, productName: 'Linen Overshirt', quantity: 1, price: 2499 },
        meta: { device: 'mobile' },
      },
    ]);
  });

  test('requires authentication (returns 401 for unauthenticated requests)', async () => {
    await request(app)
      .get('/api/analytics/summary')
      .expect(401);
  });


  test.todo('returns summary data for authenticated admin');
  test.todo('respects ?days query param for windowing');
});
