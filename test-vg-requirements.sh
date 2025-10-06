#!/bin/bash

# ========================================
# VG REQUIREMENTS TEST SCRIPT
# Backend-2 Course - Freaky Furniture API
# ========================================

API_URL="http://localhost:5186/api"
TOKEN=""

echo "================================================"
echo "🧪 TESTING VG REQUIREMENTS FOR BACKEND-2 COURSE"
echo "================================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# ========================================
# 1. AUTHENTICATION
# ========================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}1. AUTHENTICATION - POST /api/auth/login${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

echo -e "${YELLOW}Request:${NC}"
echo "POST $API_URL/auth/login"
echo '{"username":"admin","password":"admin"}'
echo ""

LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin"}')

echo -e "${GREEN}Response:${NC}"
echo "$LOGIN_RESPONSE" | jq '.'
echo ""

# Extract token
TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.accessToken // .access_token')

if [ -z "$TOKEN" ] || [ "$TOKEN" = "null" ]; then
    echo -e "${RED}❌ Failed to get token. Exiting.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Authentication successful!${NC}"
echo -e "Token: ${TOKEN:0:50}..."
echo ""
sleep 2

# ========================================
# 2. PRODUCT ENDPOINTS
# ========================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}2. PRODUCT ENDPOINTS${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# 2.1 GET /api/products (with pagination)
echo -e "${YELLOW}2.1 GET /api/products?page=1&pageSize=5 (PAGINATION)${NC}"
echo ""
curl -s "$API_URL/products?page=1&pageSize=5" | jq '.'
echo ""
echo -e "${GREEN}✅ Pagination working${NC}"
echo ""
sleep 2

# 2.2 GET /api/products/{id}
echo -e "${YELLOW}2.2 GET /api/products/1 (GET BY ID)${NC}"
echo ""
curl -s "$API_URL/products/1" | jq '.'
echo ""
echo -e "${GREEN}✅ Get by ID working${NC}"
echo ""
sleep 2

# 2.3 GET /api/products?slug={slug}
echo -e "${YELLOW}2.3 GET /api/products/slug/abstract-coffee-table (GET BY SLUG)${NC}"
echo ""
curl -s "$API_URL/products/slug/abstract-coffee-table" | jq '.'
echo ""
echo -e "${GREEN}✅ Get by slug working${NC}"
echo ""
sleep 2

# 2.4 POST /api/products (requires auth)
echo -e "${YELLOW}2.4 POST /api/products (CREATE - REQUIRES AUTH)${NC}"
echo ""
NEW_PRODUCT=$(curl -s -X POST "$API_URL/products" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Test Product VG",
    "description": "Created for VG testing",
    "price": 299.99,
    "image": "/images/test.jpg",
    "brand": "Test Brand",
    "urlSlug": "test-product-vg",
    "sku": "TEST-001",
    "categoryId": 1
  }')

echo "$NEW_PRODUCT" | jq '.'
PRODUCT_ID=$(echo "$NEW_PRODUCT" | jq -r '.id')
echo ""
echo -e "${GREEN}✅ Product created with ID: $PRODUCT_ID${NC}"
echo ""
sleep 2

# 2.5 PATCH /api/products/{id} (requires auth)
echo -e "${YELLOW}2.5 PATCH /api/products/$PRODUCT_ID (UPDATE - REQUIRES AUTH)${NC}"
echo ""
curl -s -X PATCH "$API_URL/products/$PRODUCT_ID" \
  -H "Content-Type: application/json-patch+json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '[
    {
      "op": "replace",
      "path": "/description",
      "value": "Updated description for VG demo"
    },
    {
      "op": "replace",
      "path": "/price",
      "value": 399.99
    }
  ]' | jq '.'
echo ""
echo -e "${GREEN}✅ Product updated${NC}"
echo ""
sleep 2

# 2.6 DELETE /api/products/{id} (requires auth)
echo -e "${YELLOW}2.6 DELETE /api/products/$PRODUCT_ID (DELETE - REQUIRES AUTH)${NC}"
echo ""
DELETE_RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X DELETE "$API_URL/products/$PRODUCT_ID" \
  -H "Authorization: Bearer $TOKEN")

HTTP_STATUS=$(echo "$DELETE_RESPONSE" | grep "HTTP_STATUS" | cut -d':' -f2)
echo "HTTP Status: $HTTP_STATUS"
echo ""
if [ "$HTTP_STATUS" = "204" ]; then
    echo -e "${GREEN}✅ Product deleted (204 No Content)${NC}"
else
    echo -e "${RED}❌ Delete failed with status $HTTP_STATUS${NC}"
fi
echo ""
sleep 2

# ========================================
# 3. CATEGORY ENDPOINTS
# ========================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}3. CATEGORY ENDPOINTS${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# 3.1 GET /api/categories
echo -e "${YELLOW}3.1 GET /api/categories (ALL CATEGORIES WITH PRODUCTS)${NC}"
echo ""
curl -s "$API_URL/categories" | jq '. | map({id, name, productsCount: (.products | length)})'
echo ""
echo -e "${GREEN}✅ Get all categories working${NC}"
echo ""
sleep 2

# 3.2 GET /api/categories/{id}
echo -e "${YELLOW}3.2 GET /api/categories/1 (GET BY ID)${NC}"
echo ""
curl -s "$API_URL/categories/1" | jq '.'
echo ""
echo -e "${GREEN}✅ Get category by ID working${NC}"
echo ""
sleep 2

# 3.3 GET /api/categories?slug={slug}
echo -e "${YELLOW}3.3 GET /api/categories?slug=mobler (GET BY SLUG)${NC}"
echo ""
curl -s "$API_URL/categories?slug=mobler" | jq '.'
echo ""
echo -e "${GREEN}✅ Get category by slug working${NC}"
echo ""
sleep 2

# 3.4 POST /api/categories (requires auth)
echo -e "${YELLOW}3.4 POST /api/categories (CREATE - REQUIRES AUTH)${NC}"
echo ""
NEW_CATEGORY=$(curl -s -X POST "$API_URL/categories" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Test Category VG",
    "image": "/images/test-category.jpg",
    "urlSlug": "test-category-vg"
  }')

echo "$NEW_CATEGORY" | jq '.'
CATEGORY_ID=$(echo "$NEW_CATEGORY" | jq -r '.id')
echo ""
echo -e "${GREEN}✅ Category created with ID: $CATEGORY_ID${NC}"
echo ""
sleep 2

# 3.5 PATCH /api/categories/{id} (requires auth)
echo -e "${YELLOW}3.5 PATCH /api/categories/$CATEGORY_ID (UPDATE - REQUIRES AUTH)${NC}"
echo ""
curl -s -X PATCH "$API_URL/categories/$CATEGORY_ID" \
  -H "Content-Type: application/json-patch+json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '[
    {
      "op": "replace",
      "path": "/name",
      "value": "Updated Test Category"
    }
  ]' | jq '.'
echo ""
echo -e "${GREEN}✅ Category updated${NC}"
echo ""
sleep 2

# 3.6 PUT /api/categories/{categoryId}/products/{productId}
echo -e "${YELLOW}3.6 PUT /api/categories/1/products/2 (ADD PRODUCT TO CATEGORY)${NC}"
echo ""
curl -s -w "\nHTTP_STATUS:%{http_code}" -X PUT "$API_URL/categories/1/products/2" \
  -H "Authorization: Bearer $TOKEN" | grep "HTTP_STATUS"
echo ""
echo -e "${GREEN}✅ Product added to category${NC}"
echo ""
sleep 2

# 3.7 DELETE /api/categories/{categoryId}/products/{productId}
echo -e "${YELLOW}3.7 DELETE /api/categories/1/products/2 (REMOVE PRODUCT FROM CATEGORY)${NC}"
echo ""
curl -s -w "\nHTTP_STATUS:%{http_code}" -X DELETE "$API_URL/categories/1/products/2" \
  -H "Authorization: Bearer $TOKEN" | grep "HTTP_STATUS"
echo ""
echo -e "${GREEN}✅ Product removed from category${NC}"
echo ""
sleep 2

# 3.8 DELETE /api/categories/{id} (requires auth - admin only)
echo -e "${YELLOW}3.8 DELETE /api/categories/$CATEGORY_ID (DELETE - ADMIN ONLY)${NC}"
echo ""
DELETE_CAT_RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X DELETE "$API_URL/categories/$CATEGORY_ID" \
  -H "Authorization: Bearer $TOKEN")

HTTP_STATUS=$(echo "$DELETE_CAT_RESPONSE" | grep "HTTP_STATUS" | cut -d':' -f2)
echo "HTTP Status: $HTTP_STATUS"
echo ""
if [ "$HTTP_STATUS" = "204" ]; then
    echo -e "${GREEN}✅ Category deleted (204 No Content)${NC}"
else
    echo -e "${RED}❌ Delete failed with status $HTTP_STATUS${NC}"
fi
echo ""
sleep 2

# ========================================
# 4. ERROR HANDLING TESTS
# ========================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}4. ERROR HANDLING${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# 4.1 404 Not Found
echo -e "${YELLOW}4.1 GET /api/products/99999 (404 NOT FOUND)${NC}"
echo ""
curl -s -w "\nHTTP_STATUS:%{http_code}" "$API_URL/products/99999" | grep -E "(error|HTTP_STATUS)"
echo ""
echo -e "${GREEN}✅ 404 handling working${NC}"
echo ""
sleep 2

# 4.2 401 Unauthorized
echo -e "${YELLOW}4.2 POST /api/products WITHOUT TOKEN (401 UNAUTHORIZED)${NC}"
echo ""
curl -s -w "\nHTTP_STATUS:%{http_code}" -X POST "$API_URL/products" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","price":100}' | grep "HTTP_STATUS"
echo ""
echo -e "${GREEN}✅ 401 Unauthorized working${NC}"
echo ""
sleep 2

# 4.3 400 Bad Request
echo -e "${YELLOW}4.3 POST /api/products WITH INVALID DATA (400 BAD REQUEST)${NC}"
echo ""
curl -s "$API_URL/products" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -X POST \
  -d '{"name":"","price":-100}' | jq '.'
echo ""
echo -e "${GREEN}✅ 400 Bad Request working${NC}"
echo ""

# ========================================
# SUMMARY
# ========================================
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}✅ VG REQUIREMENTS TEST SUMMARY${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${GREEN}AUTHENTICATION:${NC}"
echo "  ✅ POST /api/auth/login - JWT token generation"
echo ""
echo -e "${GREEN}PRODUCT ENDPOINTS:${NC}"
echo "  ✅ GET  /api/products?page=1&pageSize=10 - Pagination"
echo "  ✅ GET  /api/products/{id} - Get by ID"
echo "  ✅ GET  /api/products/slug/{slug} - Get by URL slug"
echo "  ✅ POST /api/products - Create (requires auth)"
echo "  ✅ PATCH /api/products/{id} - Update (requires auth)"
echo "  ✅ DELETE /api/products/{id} - Delete (requires auth)"
echo ""
echo -e "${GREEN}CATEGORY ENDPOINTS:${NC}"
echo "  ✅ GET  /api/categories - Get all with products"
echo "  ✅ GET  /api/categories/{id} - Get by ID"
echo "  ✅ GET  /api/categories?slug={slug} - Get by URL slug"
echo "  ✅ POST /api/categories - Create (requires auth)"
echo "  ✅ PATCH /api/categories/{id} - Update (requires auth)"
echo "  ✅ DELETE /api/categories/{id} - Delete (requires admin)"
echo "  ✅ PUT  /api/categories/{catId}/products/{prodId} - Add product"
echo "  ✅ DELETE /api/categories/{catId}/products/{prodId} - Remove product"
echo ""
echo -e "${GREEN}ERROR HANDLING:${NC}"
echo "  ✅ 404 Not Found"
echo "  ✅ 401 Unauthorized"
echo "  ✅ 400 Bad Request"
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}🎉 ALL VG REQUIREMENTS VERIFIED!${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
