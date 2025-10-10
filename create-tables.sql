-- Create Tables for Freaky Furniture Database
-- Run this in Supabase SQL Editor

-- 1. Users table
CREATE TABLE IF NOT EXISTS "Users" (
    "Id" SERIAL PRIMARY KEY,
    "Username" VARCHAR(50) NOT NULL UNIQUE,
    "Password" VARCHAR(255) NOT NULL,
    "Role" VARCHAR(20) NOT NULL DEFAULT 'user',
    "CreatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 2. Categories table  
CREATE TABLE IF NOT EXISTS "Categories" (
    "Id" SERIAL PRIMARY KEY,
    "Name" VARCHAR(100) NOT NULL,
    "UrlSlug" VARCHAR(100) NOT NULL UNIQUE,
    "Image" VARCHAR(255)
);

-- 3. Products table
CREATE TABLE IF NOT EXISTS "Products" (
    "Id" SERIAL PRIMARY KEY,
    "Name" VARCHAR(200) NOT NULL,
    "Description" TEXT,
    "Price" DECIMAL(18,2) NOT NULL,
    "ImageUrl" VARCHAR(500),
    "CategoryId" INTEGER REFERENCES "Categories"("Id"),
    "StockQuantity" INTEGER NOT NULL DEFAULT 0,
    "Material" VARCHAR(100),
    "Color" VARCHAR(50),
    "CountryOfOrigin" VARCHAR(100),
    "PublishingDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "CreatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 4. Customers table
CREATE TABLE IF NOT EXISTS "Customers" (
    "Id" SERIAL PRIMARY KEY,
    "FirstName" VARCHAR(100) NOT NULL,
    "LastName" VARCHAR(100) NOT NULL,
    "Email" VARCHAR(255) NOT NULL UNIQUE,
    "Password" VARCHAR(255) NOT NULL,
    "Username" VARCHAR(50) UNIQUE,
    "CreatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 5. Cart table
CREATE TABLE IF NOT EXISTS "Cart" (
    "Id" SERIAL PRIMARY KEY,
    "ProductId" INTEGER NOT NULL REFERENCES "Products"("Id"),
    "Quantity" INTEGER NOT NULL DEFAULT 1,
    "UserId" INTEGER REFERENCES "Customers"("Id"),
    "CreatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 6. Reviews table
CREATE TABLE IF NOT EXISTS "Reviews" (
    "Id" SERIAL PRIMARY KEY,
    "ProductId" INTEGER NOT NULL REFERENCES "Products"("Id"),
    "CustomerId" INTEGER REFERENCES "Customers"("Id"),
    "Rating" INTEGER NOT NULL CHECK ("Rating" >= 1 AND "Rating" <= 5),
    "Comment" TEXT,
    "ReviewDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 7. Recommended table
CREATE TABLE IF NOT EXISTS "Recommended" (
    "Id" SERIAL PRIMARY KEY,
    "ProductId" INTEGER NOT NULL REFERENCES "Products"("Id"),
    "IsRecommended" BOOLEAN NOT NULL DEFAULT TRUE,
    "CreatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 8. Shipping Details table
CREATE TABLE IF NOT EXISTS "ShippingDetails" (
    "Id" SERIAL PRIMARY KEY,
    "CustomerId" INTEGER NOT NULL REFERENCES "Customers"("Id"),
    "Address" VARCHAR(255) NOT NULL,
    "City" VARCHAR(100) NOT NULL,
    "PostalCode" VARCHAR(20) NOT NULL,
    "Country" VARCHAR(100) NOT NULL,
    "CreatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 9. Payment Details table  
CREATE TABLE IF NOT EXISTS "PaymentDetails" (
    "Id" SERIAL PRIMARY KEY,
    "CustomerId" INTEGER NOT NULL REFERENCES "Customers"("Id"),
    "CardNumber" VARCHAR(20) NOT NULL,
    "ExpiryDate" VARCHAR(7) NOT NULL,
    "CVV" VARCHAR(4) NOT NULL,
    "CreatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS "IX_Products_CategoryId" ON "Products"("CategoryId");
CREATE INDEX IF NOT EXISTS "IX_Cart_ProductId" ON "Cart"("ProductId");
CREATE INDEX IF NOT EXISTS "IX_Cart_UserId" ON "Cart"("UserId");
CREATE INDEX IF NOT EXISTS "IX_Reviews_ProductId" ON "Reviews"("ProductId");
CREATE INDEX IF NOT EXISTS "IX_Reviews_CustomerId" ON "Reviews"("CustomerId");

COMMIT;