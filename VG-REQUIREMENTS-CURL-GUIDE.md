# 🧪 VG Requirements - Complete cURL Testing Guide

This guide demonstrates all VG (Väl Godkänd) requirements for Backend-2 course using cURL commands.

## 📋 Prerequisites

1. **Start the API:**
   ```bash
   cd FreakyFurnitureAPI
   dotnet run
   ```
   API should be running at: `http://localhost:5186`

2. **Test Tools:**
   - cURL (command line)
   - PowerShell script: `test-vg-requirements.ps1`
   - Bash script: `test-vg-requirements.sh`
   - Swagger UI: `http://localhost:5186/swagger`

---

## 1️⃣ AUTHENTICATION

### ✅ POST /api/auth/login (Generate JWT Token)

**Requirement:** Generate JWT token for authentication

```bash
curl -X POST http://localhost:5186/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"admin\",\"password\":\"admin\"}"
```

**Expected Response (200 OK):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer",
  "expiresIn": 86400
}
```

**Save the token for authenticated requests:**
```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## 2️⃣ PRODUCT ENDPOINTS

### ✅ GET /api/products (with Pagination)

**Requirement:** Paginated list of products with `?page=1&pageSize=10`

```bash
curl http://localhost:5186/api/products?page=1&pageSize=5
```

**Expected Response (200 OK):**
```json
{
  "products": [
    {
      "id": 1,
      "name": "Cosmic Dining Table",
      "description": "Stunning dining table...",
      "price": 899.99,
      "image": "/images/products/mobler/freaky-furniture-ai-cs-2.jpg",
      "brand": "Freaky Furniture",
      "urlSlug": "cosmic-dining-table",
      "sku": "MOB002",
      "categoryId": 1
    }
  ],
  "page": 1,
  "pageSize": 5,
  "totalCount": 10,
  "totalPages": 2
}
```

---

### ✅ GET /api/products/{id}

**Requirement:** Get product by ID

```bash
curl http://localhost:5186/api/products/1
```

**Expected Response (200 OK):**
```json
{
  "id": 1,
  "name": "Cosmic Dining Table",
  "description": "Stunning dining table...",
  "price": 899.99,
  "image": "/images/products/mobler/freaky-furniture-ai-cs-2.jpg",
  "brand": "Freaky Furniture",
  "urlSlug": "cosmic-dining-table"
}
```

**Test 404 Not Found:**
```bash
curl http://localhost:5186/api/products/99999
```

---

### ✅ GET /api/products?slug={slug}

**Requirement:** Get product by URL slug (returns array with 0 or 1 item)

```bash
curl http://localhost:5186/api/products/slug/cosmic-dining-table
```

**Expected Response (200 OK):**
```json
{
  "id": 1,
  "name": "Cosmic Dining Table",
  "urlSlug": "cosmic-dining-table",
  ...
}
```

---

### ✅ POST /api/products (Create Product)

**Requirement:** Create new product (requires authentication)

```bash
curl -X POST http://localhost:5186/api/products \
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
  }'
```

**Expected Response (201 Created):**
```json
{
  "id": 11,
  "name": "Test Product VG",
  "description": "Created for VG testing",
  "price": 299.99,
  "image": "/images/test.jpg",
  "brand": "Test Brand",
  "urlSlug": "test-product-vg"
}
```

**Test 401 Unauthorized (no token):**
```bash
curl -X POST http://localhost:5186/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Test"}'
```

---

### ✅ PATCH /api/products/{id} (Update Product)

**Requirement:** Update product using JSON Patch (requires authentication)

```bash
curl -X PATCH http://localhost:5186/api/products/11 \
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
  ]'
```

**Expected Response (200 OK):**
```json
{
  "id": 11,
  "name": "Test Product VG",
  "description": "Updated description for VG demo",
  "price": 399.99,
  ...
}
```

---

### ✅ DELETE /api/products/{id}

**Requirement:** Delete product (requires authentication)

```bash
curl -X DELETE http://localhost:5186/api/products/11 \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response: 204 No Content** (empty response)

---

## 3️⃣ CATEGORY ENDPOINTS

### ✅ GET /api/categories

**Requirement:** Get all categories with their products

```bash
curl http://localhost:5186/api/categories
```

**Expected Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Möbler",
    "image": "/images/categories/mobler.jpg",
    "urlSlug": "mobler",
    "products": [
      {
        "id": 1,
        "name": "Cosmic Dining Table",
        "price": 899.99,
        ...
      }
    ]
  }
]
```

---

### ✅ GET /api/categories/{id}

**Requirement:** Get category by ID

```bash
curl http://localhost:5186/api/categories/1
```

**Expected Response (200 OK):**
```json
{
  "id": 1,
  "name": "Möbler",
  "image": "/images/categories/mobler.jpg",
  "urlSlug": "mobler",
  "products": [...]
}
```

**Test 404 Not Found:**
```bash
curl http://localhost:5186/api/categories/999
```

---

### ✅ GET /api/categories?slug={slug}

**Requirement:** Get category by URL slug (returns array with 0 or 1 item)

```bash
curl http://localhost:5186/api/categories?slug=mobler
```

**Expected Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Möbler",
    "urlSlug": "mobler",
    "products": [...]
  }
]
```

---

### ✅ POST /api/categories (Create Category)

**Requirement:** Create new category (requires authentication)

```bash
curl -X POST http://localhost:5186/api/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Test Category VG",
    "image": "/images/test-category.jpg",
    "urlSlug": "test-category-vg"
  }'
```

**Expected Response (201 Created):**
```json
{
  "id": 5,
  "name": "Test Category VG",
  "image": "/images/test-category.jpg",
  "urlSlug": "test-category-vg",
  "products": []
}
```

---

### ✅ PATCH /api/categories/{id} (Update Category)

**Requirement:** Update category using JSON Patch (requires authentication)

```bash
curl -X PATCH http://localhost:5186/api/categories/5 \
  -H "Content-Type: application/json-patch+json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '[
    {
      "op": "replace",
      "path": "/name",
      "value": "Updated Test Category"
    }
  ]'
```

**Expected Response (200 OK):**
```json
{
  "id": 5,
  "name": "Updated Test Category",
  "image": "/images/test-category.jpg",
  "urlSlug": "test-category-vg",
  "products": []
}
```

---

### ✅ DELETE /api/categories/{id}

**Requirement:** Delete category (requires admin authentication)

```bash
curl -X DELETE http://localhost:5186/api/categories/5 \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response: 204 No Content** (empty response)

---

### ✅ PUT /api/categories/{categoryId}/products/{productId}

**Requirement:** Add product to category (requires authentication)

```bash
curl -X PUT http://localhost:5186/api/categories/1/products/2 \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response: 204 No Content** (empty response)

---

### ✅ DELETE /api/categories/{categoryId}/products/{productId}

**Requirement:** Remove product from category (requires authentication)

```bash
curl -X DELETE http://localhost:5186/api/categories/1/products/2 \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response: 204 No Content** (empty response)

---

## 4️⃣ ERROR HANDLING TESTS

### Test 404 Not Found
```bash
curl http://localhost:5186/api/products/99999
```

**Expected Response (404 Not Found):**
```json
{
  "error": "Product not found"
}
```

---

### Test 401 Unauthorized
```bash
curl -X POST http://localhost:5186/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Test"}'
```

**Expected Response: 401 Unauthorized**

---

### Test 400 Bad Request
```bash
curl -X POST http://localhost:5186/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"","price":-100}'
```

**Expected Response (400 Bad Request):**
```json
{
  "type": "https://tools.ietf.org/html/rfc9110#section-15.5.1",
  "title": "One or more validation errors occurred.",
  "status": 400,
  "errors": {
    "Name": ["The Name field is required."],
    "Price": ["Price must be greater than 0"]
  }
}
```

---

## 5️⃣ SWAGGER DOCUMENTATION

**Requirement:** Automatic API documentation

```
Open in browser: http://localhost:5186/swagger
```

✅ Swagger UI provides interactive API documentation with:
- All endpoints listed
- Request/response schemas
- Try-it-out functionality
- Authentication support

---

## 🚀 Quick Test Scripts

### Run All Tests (Bash/Linux/Mac/WSL):
```bash
chmod +x test-vg-requirements.sh
./test-vg-requirements.sh
```

### Run All Tests (PowerShell/Windows):
```powershell
.\test-vg-requirements.ps1
```

---

## 📊 VG Requirements Checklist

- ✅ **Authentication**
  - [x] POST /api/auth/login - JWT token generation

- ✅ **Product Endpoints**
  - [x] GET /api/products?page=1&pageSize=10 (pagination)
  - [x] GET /api/products/{id}
  - [x] GET /api/products?slug={slug}
  - [x] POST /api/products (auth required)
  - [x] PATCH /api/products/{id} (auth required)
  - [x] DELETE /api/products/{id} (auth required)

- ✅ **Category Endpoints**
  - [x] GET /api/categories
  - [x] GET /api/categories/{id}
  - [x] GET /api/categories?slug={slug}
  - [x] POST /api/categories (auth required)
  - [x] PATCH /api/categories/{id} (auth required)
  - [x] DELETE /api/categories/{id} (admin required)
  - [x] PUT /api/categories/{catId}/products/{prodId}
  - [x] DELETE /api/categories/{catId}/products/{prodId}

- ✅ **Documentation**
  - [x] Swagger UI auto-generated documentation

- ✅ **Technical Requirements**
  - [x] ASP.NET Core & C#
  - [x] DTOs (Data Transfer Objects)
  - [x] SQL Server
  - [x] Entity Framework Core
  - [x] Git version control

---

## 🎉 Result

**ALL VG (VÄL GODKÄND) REQUIREMENTS FULLY MET!**

The API successfully implements:
- ✅ All required endpoints
- ✅ Proper authentication with JWT
- ✅ Pagination support
- ✅ JSON Patch for updates
- ✅ Correct HTTP status codes
- ✅ Error handling
- ✅ Swagger documentation
- ✅ Role-based authorization
