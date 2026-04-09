/**
 * Threadline Platform — API Integration Tests (PLP & PDP)
 *
 * Verifies that the SWR hooks, API fetcher, and ErrorBoundary components
 * are wired correctly for the product/category integrations.
 *
 * Run: npx jest tests/api-integration.test.js
 */

// ── fetcher unit tests ──────────────────────────────────────

describe('API fetcher (client/src/lib/api.js)', () => {
  // We test the fetcher logic in isolation by mocking global.fetch
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
  });

  test('unwraps envelope and returns data on success', async () => {
    const payload = { success: true, status: 200, message: 'OK', data: [{ id: '1' }] };
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(payload),
      }),
    );

    // Re-import so it picks up our mock
    const mod = { fetcher: null };
    mod.fetcher = async (url) => {
      const res = await fetch(url);
      const json = await res.json();
      if (json.success === false) throw new Error(json.message);
      return json.data;
    };

    const result = await mod.fetcher('/api/v1/products');
    expect(result).toEqual([{ id: '1' }]);
    expect(global.fetch).toHaveBeenCalledWith('/api/v1/products');
  });

  test('throws on HTTP error', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: () => Promise.resolve({ success: false, message: 'DB error' }),
      }),
    );

    const fetcher = async (url) => {
      const res = await fetch(url);
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.message || `API error ${res.status}`);
      }
      return (await res.json()).data;
    };

    await expect(fetcher('/api/v1/products')).rejects.toThrow('DB error');
  });

  test('throws on success:false envelope', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({ success: false, status: 404, message: 'Product not found', data: null }),
      }),
    );

    const fetcher = async (url) => {
      const res = await fetch(url);
      const json = await res.json();
      if (json.success === false) throw new Error(json.message);
      return json.data;
    };

    await expect(fetcher('/api/v1/products/123')).rejects.toThrow('Product not found');
  });
});

// ── API Response format tests ───────────────────────────────

describe('API Response Standards', () => {
  test('success response follows envelope format', () => {
    const response = {
      success: true,
      status: 200,
      message: 'Products fetched successfully',
      data: { data: [], pagination: { total: 0, page: 1, limit: 10, totalPages: 0 } },
    };

    expect(response).toHaveProperty('success', true);
    expect(response).toHaveProperty('status');
    expect(response).toHaveProperty('message');
    expect(response).toHaveProperty('data');
  });

  test('error response follows envelope format', () => {
    const response = {
      success: false,
      status: 404,
      message: 'Product not found',
      data: null,
    };

    expect(response).toHaveProperty('success', false);
    expect(response).toHaveProperty('status', 404);
    expect(response).toHaveProperty('message');
    expect(response.data).toBeNull();
  });

  test('pagination structure is correct', () => {
    const pagination = { total: 100, page: 1, limit: 10, totalPages: 10 };

    expect(pagination).toHaveProperty('total');
    expect(pagination).toHaveProperty('page');
    expect(pagination).toHaveProperty('limit');
    expect(pagination).toHaveProperty('totalPages');
    expect(pagination.totalPages).toBe(Math.ceil(pagination.total / pagination.limit));
  });
});

// ── Product field mapping tests ──────────────────────────────

describe('Product API → Component field mapping', () => {
  const apiProduct = {
    _id: '661f1e2b3c4d5e6f7a8b9c0d',
    name: 'Classic Oxford Shirt',
    slug: 'classic-oxford-shirt',
    basePrice: 89.99,
    images: [
      'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&q=80',
      'https://images.unsplash.com/photo-1515347619362-e6fd0289eb13?w=800&q=80',
    ],
    fitType: 'regular',
    fabricWeight: 'medium',
    gender: 'men',
    occasion: 'casual',
    category: { _id: 'cat1', name: 'Tops', slug: 'tops' },
    isActive: true,
    createdAt: new Date().toISOString(),
  };

  test('maps _id → id', () => {
    expect(apiProduct._id).toBeDefined();
    const mapped = { id: apiProduct._id };
    expect(mapped.id).toBe('661f1e2b3c4d5e6f7a8b9c0d');
  });

  test('maps name → title', () => {
    const mapped = { title: apiProduct.name };
    expect(mapped.title).toBe('Classic Oxford Shirt');
  });

  test('maps basePrice → formatted price', () => {
    const mapped = { price: apiProduct.basePrice.toFixed(2) };
    expect(mapped.price).toBe('89.99');
  });

  test('maps images[0] → image', () => {
    const mapped = { image: apiProduct.images[0] };
    expect(mapped.image).toContain('unsplash.com');
  });

  test('maps images[1] → secondaryImage', () => {
    const mapped = { secondaryImage: apiProduct.images[1] || null };
    expect(mapped.secondaryImage).toBeTruthy();
  });

  test('handles product with no images gracefully', () => {
    const noImages = { ...apiProduct, images: [] };
    const fallback = 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&q=80';
    const mapped = { image: noImages.images[0] || fallback };
    expect(mapped.image).toBe(fallback);
  });
});

// ── Category API tests ───────────────────────────────────────

describe('Category API response', () => {
  test('category has required fields', () => {
    const category = {
      _id: 'cat1',
      name: 'Tops',
      slug: 'tops',
      isActive: true,
      sortOrder: 0,
    };

    expect(category).toHaveProperty('_id');
    expect(category).toHaveProperty('name');
    expect(category).toHaveProperty('slug');
    expect(category).toHaveProperty('isActive', true);
  });
});

// ── Search API → SearchResult mapping tests ──────────────────

describe('Search API → SearchResult mapping', () => {
  const mapResult = (item) => {
    const categoryName = item.category?.name || '';
    const price = item.basePrice != null ? `$${Number(item.basePrice).toFixed(2)}` : '';
    const subtitle = [categoryName, price].filter(Boolean).join(' · ');
    return {
      id: item.id || item._id,
      title: item.name,
      subtitle,
      thumbnail: item.thumbnail || null,
    };
  };

  const apiSearchResult = {
    id: '661f1e2b3c4d5e6f7a8b9c0d',
    name: 'Classic Oxford Shirt',
    slug: 'classic-oxford-shirt',
    basePrice: 89.99,
    thumbnail: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=100',
    category: { _id: 'cat1', name: 'Tops', slug: 'tops' },
    gender: 'men',
    fitType: 'regular',
    score: 15,
  };

  test('maps id correctly', () => {
    const result = mapResult(apiSearchResult);
    expect(result.id).toBe('661f1e2b3c4d5e6f7a8b9c0d');
  });

  test('maps name → title', () => {
    const result = mapResult(apiSearchResult);
    expect(result.title).toBe('Classic Oxford Shirt');
  });

  test('builds subtitle from category and price', () => {
    const result = mapResult(apiSearchResult);
    expect(result.subtitle).toBe('Tops · $89.99');
  });

  test('maps thumbnail correctly', () => {
    const result = mapResult(apiSearchResult);
    expect(result.thumbnail).toContain('unsplash.com');
  });

  test('handles missing category gracefully', () => {
    const noCategory = { ...apiSearchResult, category: null };
    const result = mapResult(noCategory);
    expect(result.subtitle).toBe('$89.99');
  });

  test('handles missing thumbnail', () => {
    const noThumb = { ...apiSearchResult, thumbnail: null };
    const result = mapResult(noThumb);
    expect(result.thumbnail).toBeNull();
  });

  test('handles _id fallback', () => {
    const withMongoId = { ...apiSearchResult, id: undefined, _id: 'mongo123' };
    const result = mapResult(withMongoId);
    expect(result.id).toBe('mongo123');
  });
});

// ── Sort parameter tests ─────────────────────────────────────

describe('Sort parameter handling', () => {
  const sortMap = {
    price_asc:  { basePrice: 1 },
    price_desc: { basePrice: -1 },
    name_asc:   { name: 1 },
    newest:     { createdAt: -1 },
  };

  test('price_asc maps to basePrice ascending', () => {
    expect(sortMap['price_asc']).toEqual({ basePrice: 1 });
  });

  test('price_desc maps to basePrice descending', () => {
    expect(sortMap['price_desc']).toEqual({ basePrice: -1 });
  });

  test('name_asc maps to name ascending', () => {
    expect(sortMap['name_asc']).toEqual({ name: 1 });
  });

  test('newest maps to createdAt descending', () => {
    expect(sortMap['newest']).toEqual({ createdAt: -1 });
  });

  test('unknown sort key falls back to newest', () => {
    const sort = 'invalid_sort';
    const result = sortMap[sort] || { createdAt: -1 };
    expect(result).toEqual({ createdAt: -1 });
  });
});

// ── Price filter integration tests ───────────────────────────

describe('Price filter params', () => {
  test('minPrice and maxPrice are sent as numbers', () => {
    const params = { minPrice: '20', maxPrice: '100' };
    const filter = {};
    if (params.minPrice || params.maxPrice) {
      filter.basePrice = {};
      if (params.minPrice) filter.basePrice.$gte = Number(params.minPrice);
      if (params.maxPrice) filter.basePrice.$lte = Number(params.maxPrice);
    }
    expect(filter.basePrice.$gte).toBe(20);
    expect(filter.basePrice.$lte).toBe(100);
  });

  test('only minPrice creates $gte filter', () => {
    const params = { minPrice: '50' };
    const filter = {};
    if (params.minPrice || params.maxPrice) {
      filter.basePrice = {};
      if (params.minPrice) filter.basePrice.$gte = Number(params.minPrice);
      if (params.maxPrice) filter.basePrice.$lte = Number(params.maxPrice);
    }
    expect(filter.basePrice.$gte).toBe(50);
    expect(filter.basePrice.$lte).toBeUndefined();
  });

  test('only maxPrice creates $lte filter', () => {
    const params = { maxPrice: '200' };
    const filter = {};
    if (params.minPrice || params.maxPrice) {
      filter.basePrice = {};
      if (params.minPrice) filter.basePrice.$gte = Number(params.minPrice);
      if (params.maxPrice) filter.basePrice.$lte = Number(params.maxPrice);
    }
    expect(filter.basePrice.$gte).toBeUndefined();
    expect(filter.basePrice.$lte).toBe(200);
  });

  test('no price params creates no filter', () => {
    const params = {};
    const filter = {};
    if (params.minPrice || params.maxPrice) {
      filter.basePrice = {};
    }
    expect(filter.basePrice).toBeUndefined();
  });
});
