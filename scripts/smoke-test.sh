#!/usr/bin/env bash
# =============================================================
# Threadline Platform — Staging Smoke Test
# Usage: BASE_URL=https://your-staging-url.railway.app bash scripts/smoke-test.sh
# Runs after every staging deploy in CI/CD.
# =============================================================

BASE_URL="${BASE_URL:-http://localhost:3000}"
PASS=0
FAIL=0

check() {
  local label="$1"
  local method="${3:-GET}"
  local expected="${4:-200}"
  local actual

  actual=$(curl -s -o /dev/null -w "%{http_code}" -X "$method" "$BASE_URL$2" \
    -H "Content-Type: application/json" --max-time 10)

  if [ "$actual" -eq "$expected" ]; then
    echo "  ✅  PASS  [$actual]  $label"
    PASS=$((PASS + 1))
  else
    echo "  ❌  FAIL  [expected $expected, got $actual]  $label"
    FAIL=$((FAIL + 1))
  fi
}

echo ""
echo "🔍 Smoke tests against: $BASE_URL"
echo "---------------------------------------------------"

check "Health check"              /health
check "Swagger docs"              /api/docs                        GET 200
check "Products list"             /api/v1/products
check "Categories list"           /api/v1/categories
check "Search endpoint"           /api/v1/search?q=test
check "Users list (auth guard)"   /api/v1/users                   GET 401
check "Orders list (auth guard)"  /api/v1/orders                  GET 401
check "Variants list"             /api/v1/products/nonexistent/variants GET 404
check "Auth – login missing body" /api/v1/auth/login              POST 400
check "Analytics (auth guard)"    /api/v1/analytics               GET 401

echo "---------------------------------------------------"
echo "Results: $PASS passed, $FAIL failed"
echo ""

if [ "$FAIL" -gt 0 ]; then
  echo "❌ Smoke tests FAILED"
  exit 1
fi

echo "✅ All smoke tests passed"
exit 0
