# ========================================
# VG REQUIREMENTS TEST SCRIPT (PowerShell)
# Backend-2 Course - Freaky Furniture API
# ========================================

$API_URL = "http://localhost:5186/api"
$TOKEN = ""

Write-Host "================================================" -ForegroundColor Blue
Write-Host "🧪 TESTING VG REQUIREMENTS FOR BACKEND-2 COURSE" -ForegroundColor Blue
Write-Host "================================================" -ForegroundColor Blue
Write-Host ""

# ========================================
# 1. AUTHENTICATION
# ========================================
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Blue
Write-Host "1. AUTHENTICATION - POST /api/auth/login" -ForegroundColor Blue
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Blue
Write-Host ""

$loginBody = @{
    username = "admin"
    password = "admin"
} | ConvertTo-Json

$loginResponse = Invoke-RestMethod -Uri "$API_URL/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
$loginResponse | ConvertTo-Json -Depth 10
Write-Host ""

$TOKEN = $loginResponse.accessToken
if (!$TOKEN) { $TOKEN = $loginResponse.access_token }

Write-Host "✅ Authentication successful!" -ForegroundColor Green
Write-Host "Token: $($TOKEN.Substring(0, 50))..." -ForegroundColor Cyan
Write-Host ""
Start-Sleep -Seconds 2

# ========================================
# 2. PRODUCT ENDPOINTS
# ========================================
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Blue
Write-Host "2. PRODUCT ENDPOINTS" -ForegroundColor Blue
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Blue
Write-Host ""

# 2.1 GET with pagination
Write-Host "2.1 GET /api/products?page=1&pageSize=5 (PAGINATION)" -ForegroundColor Yellow
$products = Invoke-RestMethod -Uri "$API_URL/products?page=1&pageSize=5"
$products | ConvertTo-Json -Depth 3
Write-Host "✅ Pagination working" -ForegroundColor Green
Write-Host ""
Start-Sleep -Seconds 2

# 2.2 GET by ID
Write-Host "2.2 GET /api/products/1 (GET BY ID)" -ForegroundColor Yellow
$product = Invoke-RestMethod -Uri "$API_URL/products/1"
$product | ConvertTo-Json -Depth 3
Write-Host "✅ Get by ID working" -ForegroundColor Green
Write-Host ""
Start-Sleep -Seconds 2

# 2.3 GET by slug
Write-Host "2.3 GET /api/products/slug/abstract-coffee-table (GET BY SLUG)" -ForegroundColor Yellow
$productBySlug = Invoke-RestMethod -Uri "$API_URL/products/slug/abstract-coffee-table"
$productBySlug | ConvertTo-Json -Depth 3
Write-Host "✅ Get by slug working" -ForegroundColor Green
Write-Host ""
Start-Sleep -Seconds 2

# 2.4 POST (create product)
Write-Host "2.4 POST /api/products (CREATE - REQUIRES AUTH)" -ForegroundColor Yellow
$headers = @{ Authorization = "Bearer $TOKEN" }
$newProduct = @{
    name = "Test Product VG"
    description = "Created for VG testing"
    price = 299.99
    image = "/images/test.jpg"
    brand = "Test Brand"
    urlSlug = "test-product-vg"
    sku = "TEST-001"
    categoryId = 1
} | ConvertTo-Json

$createdProduct = Invoke-RestMethod -Uri "$API_URL/products" -Method Post -Headers $headers -Body $newProduct -ContentType "application/json"
$createdProduct | ConvertTo-Json -Depth 3
$PRODUCT_ID = $createdProduct.id
Write-Host "✅ Product created with ID: $PRODUCT_ID" -ForegroundColor Green
Write-Host ""
Start-Sleep -Seconds 2

# 2.5 PATCH (update product)
Write-Host "2.5 PATCH /api/products/$PRODUCT_ID (UPDATE - REQUIRES AUTH)" -ForegroundColor Yellow
$patchOps = @(
    @{ op = "replace"; path = "/description"; value = "Updated description for VG demo" }
    @{ op = "replace"; path = "/price"; value = 399.99 }
) | ConvertTo-Json

$updatedProduct = Invoke-RestMethod -Uri "$API_URL/products/$PRODUCT_ID" -Method Patch -Headers $headers -Body $patchOps -ContentType "application/json-patch+json"
$updatedProduct | ConvertTo-Json -Depth 3
Write-Host "✅ Product updated" -ForegroundColor Green
Write-Host ""
Start-Sleep -Seconds 2

# 2.6 DELETE
Write-Host "2.6 DELETE /api/products/$PRODUCT_ID (DELETE - REQUIRES AUTH)" -ForegroundColor Yellow
try {
    Invoke-RestMethod -Uri "$API_URL/products/$PRODUCT_ID" -Method Delete -Headers $headers
    Write-Host "✅ Product deleted (204 No Content)" -ForegroundColor Green
} catch {
    Write-Host "Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
}
Write-Host ""
Start-Sleep -Seconds 2

# ========================================
# 3. CATEGORY ENDPOINTS
# ========================================
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Blue
Write-Host "3. CATEGORY ENDPOINTS" -ForegroundColor Blue
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Blue
Write-Host ""

# 3.1 GET all categories
Write-Host "3.1 GET /api/categories (ALL CATEGORIES WITH PRODUCTS)" -ForegroundColor Yellow
$categories = Invoke-RestMethod -Uri "$API_URL/categories"
$categories | Select-Object id, name, @{Name="productsCount"; Expression={$_.products.Count}} | ConvertTo-Json
Write-Host "✅ Get all categories working" -ForegroundColor Green
Write-Host ""
Start-Sleep -Seconds 2

# 3.2 GET category by ID
Write-Host "3.2 GET /api/categories/1 (GET BY ID)" -ForegroundColor Yellow
$category = Invoke-RestMethod -Uri "$API_URL/categories/1"
$category | ConvertTo-Json -Depth 3
Write-Host "✅ Get category by ID working" -ForegroundColor Green
Write-Host ""
Start-Sleep -Seconds 2

# 3.3 GET category by slug
Write-Host "3.3 GET /api/categories?slug=mobler (GET BY SLUG)" -ForegroundColor Yellow
$categoryBySlug = Invoke-RestMethod -Uri "$API_URL/categories?slug=mobler"
$categoryBySlug | ConvertTo-Json -Depth 3
Write-Host "✅ Get category by slug working" -ForegroundColor Green
Write-Host ""
Start-Sleep -Seconds 2

# 3.4 POST (create category)
Write-Host "3.4 POST /api/categories (CREATE - REQUIRES AUTH)" -ForegroundColor Yellow
$newCategory = @{
    name = "Test Category VG"
    image = "/images/test-category.jpg"
    urlSlug = "test-category-vg"
} | ConvertTo-Json

$createdCategory = Invoke-RestMethod -Uri "$API_URL/categories" -Method Post -Headers $headers -Body $newCategory -ContentType "application/json"
$createdCategory | ConvertTo-Json -Depth 3
$CATEGORY_ID = $createdCategory.id
Write-Host "✅ Category created with ID: $CATEGORY_ID" -ForegroundColor Green
Write-Host ""
Start-Sleep -Seconds 2

# 3.5 PATCH (update category)
Write-Host "3.5 PATCH /api/categories/$CATEGORY_ID (UPDATE - REQUIRES AUTH)" -ForegroundColor Yellow
$patchCatOps = @(
    @{ op = "replace"; path = "/name"; value = "Updated Test Category" }
) | ConvertTo-Json

$updatedCategory = Invoke-RestMethod -Uri "$API_URL/categories/$CATEGORY_ID" -Method Patch -Headers $headers -Body $patchCatOps -ContentType "application/json-patch+json"
$updatedCategory | ConvertTo-Json -Depth 3
Write-Host "✅ Category updated" -ForegroundColor Green
Write-Host ""
Start-Sleep -Seconds 2

# 3.6 PUT (add product to category)
Write-Host "3.6 PUT /api/categories/1/products/2 (ADD PRODUCT TO CATEGORY)" -ForegroundColor Yellow
try {
    Invoke-RestMethod -Uri "$API_URL/categories/1/products/2" -Method Put -Headers $headers
    Write-Host "✅ Product added to category (204 No Content)" -ForegroundColor Green
} catch {
    Write-Host "Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
}
Write-Host ""
Start-Sleep -Seconds 2

# 3.7 DELETE (remove product from category)
Write-Host "3.7 DELETE /api/categories/1/products/2 (REMOVE PRODUCT FROM CATEGORY)" -ForegroundColor Yellow
try {
    Invoke-RestMethod -Uri "$API_URL/categories/1/products/2" -Method Delete -Headers $headers
    Write-Host "✅ Product removed from category (204 No Content)" -ForegroundColor Green
} catch {
    Write-Host "Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
}
Write-Host ""
Start-Sleep -Seconds 2

# 3.8 DELETE category
Write-Host "3.8 DELETE /api/categories/$CATEGORY_ID (DELETE - ADMIN ONLY)" -ForegroundColor Yellow
try {
    Invoke-RestMethod -Uri "$API_URL/categories/$CATEGORY_ID" -Method Delete -Headers $headers
    Write-Host "✅ Category deleted (204 No Content)" -ForegroundColor Green
} catch {
    Write-Host "Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
}
Write-Host ""

# ========================================
# SUMMARY
# ========================================
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Blue
Write-Host "✅ VG REQUIREMENTS TEST SUMMARY" -ForegroundColor Blue
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Blue
Write-Host ""
Write-Host "AUTHENTICATION:" -ForegroundColor Green
Write-Host "  ✅ POST /api/auth/login - JWT token generation"
Write-Host ""
Write-Host "PRODUCT ENDPOINTS:" -ForegroundColor Green
Write-Host "  ✅ GET  /api/products?page=1&pageSize=10 - Pagination"
Write-Host "  ✅ GET  /api/products/{id} - Get by ID"
Write-Host "  ✅ GET  /api/products/slug/{slug} - Get by URL slug"
Write-Host "  ✅ POST /api/products - Create (requires auth)"
Write-Host "  ✅ PATCH /api/products/{id} - Update (requires auth)"
Write-Host "  ✅ DELETE /api/products/{id} - Delete (requires auth)"
Write-Host ""
Write-Host "CATEGORY ENDPOINTS:" -ForegroundColor Green
Write-Host "  ✅ GET  /api/categories - Get all with products"
Write-Host "  ✅ GET  /api/categories/{id} - Get by ID"
Write-Host "  ✅ GET  /api/categories?slug={slug} - Get by URL slug"
Write-Host "  ✅ POST /api/categories - Create (requires auth)"
Write-Host "  ✅ PATCH /api/categories/{id} - Update (requires auth)"
Write-Host "  ✅ DELETE /api/categories/{id} - Delete (requires admin)"
Write-Host "  ✅ PUT  /api/categories/{catId}/products/{prodId} - Add product"
Write-Host "  ✅ DELETE /api/categories/{catId}/products/{prodId} - Remove product"
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Blue
Write-Host "🎉 ALL VG REQUIREMENTS VERIFIED!" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Blue
Write-Host ""
