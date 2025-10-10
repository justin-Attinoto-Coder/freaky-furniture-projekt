-- Seed Data for Freaky Furniture Database
-- Run this AFTER creating the tables

-- 1. Insert Admin and Test Users
INSERT INTO "Users" ("Username", "Password", "Role", "CreatedAt") VALUES
('admin', '$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'admin', NOW()),
('testuser', '$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'user', NOW())
ON CONFLICT ("Username") DO NOTHING;

-- 2. Insert Categories
INSERT INTO "Categories" ("Name", "UrlSlug", "Image") VALUES
('Möbler', 'mobler', '/images/products/mobler/freaky-furniture-ai-cs-1.jpg'),
('Förvaring', 'forvaring', '/images/products/forvaring/freaky-furniture-ai-cs-3.jpg'),
('Textil', 'textil', '/images/products/textil/freaky-furniture-ai-cs-5.jpg'),
('Detaljer', 'detaljer', '/images/products/detaljer/freaky-furniture-ai-cs-7.jpg')
ON CONFLICT ("UrlSlug") DO NOTHING;

-- 3. Insert Sample Products
INSERT INTO "Products" ("Name", "Description", "Price", "ImageUrl", "CategoryId", "StockQuantity", "Material", "Color", "CountryOfOrigin", "PublishingDate") VALUES
-- Möbler (Furniture)
('Modern Oak Dining Table', 'Beautiful solid oak dining table perfect for family gatherings', 599.99, '/images/products/mobler/freaky-furniture-ai-cs-1.jpg', 1, 15, 'Solid Oak Wood', 'Natural Wood', 'Sweden', NOW()),
('Ergonomic Office Chair', 'Comfortable office chair with lumbar support and adjustable height', 299.99, '/images/products/mobler/freaky-furniture-ai-cs-2.jpg', 1, 25, 'Premium Leather', 'Black', 'Germany', NOW()),
('Scandinavian Sofa', 'Minimalist three-seater sofa with clean lines and comfortable cushions', 899.99, '/images/products/mobler/freaky-furniture-ai-cs-8.jpg', 1, 8, 'Cotton Blend', 'Gray', 'Denmark', NOW()),

-- Förvaring (Storage)
('Wooden Storage Chest', 'Spacious storage chest made from sustainable pine wood', 199.99, '/images/products/forvaring/freaky-furniture-ai-cs-3.jpg', 2, 20, 'Pine', 'Natural Wood', 'Finland', NOW()),
('Metal Bookshelf', 'Industrial-style bookshelf with 5 adjustable shelves', 149.99, '/images/products/forvaring/freaky-furniture-ai-cs-4.jpg', 2, 12, 'Metal Frame', 'Black', 'Germany', NOW()),
('Glass Display Cabinet', 'Elegant glass cabinet perfect for displaying collectibles', 399.99, '/images/products/forvaring/freaky-furniture-ai-cs-9.jpg', 2, 6, 'Tempered Glass', 'Clear', 'Italy', NOW()),

-- Textil (Textiles)
('Organic Cotton Throw', 'Soft organic cotton throw blanket in neutral colors', 79.99, '/images/products/textil/freaky-furniture-ai-cs-5.jpg', 3, 30, 'Cotton Blend', 'Beige', 'Sweden', NOW()),
('Linen Curtains Set', 'Premium linen curtains that filter light beautifully', 129.99, '/images/products/textil/freaky-furniture-ai-cs-6.jpg', 3, 18, 'Linen', 'White', 'Norway', NOW()),
('Wool Area Rug', 'Handwoven wool rug with geometric patterns', 249.99, '/images/products/textil/freaky-furniture-ai-cs-10.jpg', 3, 14, 'Wool', 'Blue', 'Sweden', NOW()),

-- Detaljer (Details/Accessories)
('Ceramic Vase Set', 'Set of three handcrafted ceramic vases in different sizes', 89.99, '/images/products/detaljer/freaky-furniture-ai-cs-7.jpg', 4, 22, 'Ceramic', 'White', 'Denmark', NOW()),
('Wooden Picture Frame', 'Classic wooden picture frame for your favorite memories', 29.99, '/images/products/detaljer/freaky-furniture-ai-cs-11.jpg', 4, 40, 'Walnut', 'Brown', 'Sweden', NOW()),
('Designer Table Lamp', 'Modern table lamp with adjustable brightness and USB charging', 159.99, '/images/products/detaljer/freaky-furniture-ai-cs-12.jpg', 4, 16, 'Metal Frame', 'Gold', 'Italy', NOW());

-- 4. Insert Sample Customers
INSERT INTO "Customers" ("FirstName", "LastName", "Email", "Password", "Username", "CreatedAt") VALUES
('John', 'Doe', 'john.doe@example.com', '$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'johndoe', NOW()),
('Jane', 'Smith', 'jane.smith@example.com', '$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'janesmith', NOW()),
('Erik', 'Andersson', 'erik.andersson@example.com', '$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'erikand', NOW())
ON CONFLICT ("Email") DO NOTHING;

-- 5. Insert Sample Reviews
INSERT INTO "Reviews" ("ProductId", "CustomerId", "Rating", "Comment", "ReviewDate") VALUES
(1, 1, 5, 'Amazing quality! The oak table is exactly what I was looking for.', NOW()),
(1, 2, 4, 'Beautiful table, but delivery took a bit longer than expected.', NOW()),
(2, 3, 5, 'Super comfortable office chair. My back pain is gone!', NOW()),
(3, 1, 5, 'Perfect sofa for my living room. Great Scandinavian design.', NOW()),
(4, 2, 4, 'Nice storage solution, good value for money.', NOW()),
(5, 3, 4, 'Sturdy bookshelf, easy to assemble.', NOW()),
(7, 1, 5, 'Incredibly soft and cozy throw blanket.', NOW()),
(10, 2, 5, 'Beautiful vases, exactly as pictured.', NOW());

-- 6. Insert Recommended Products  
INSERT INTO "Recommended" ("ProductId", "IsRecommended", "CreatedAt") VALUES
(1, true, NOW()),  -- Modern Oak Dining Table
(3, true, NOW()),  -- Scandinavian Sofa  
(7, true, NOW()),  -- Organic Cotton Throw
(10, true, NOW()), -- Ceramic Vase Set
(12, true, NOW()); -- Designer Table Lamp

COMMIT;

-- Verify data was inserted
SELECT 'Users' as table_name, COUNT(*) as count FROM "Users"
UNION ALL
SELECT 'Categories', COUNT(*) FROM "Categories"  
UNION ALL
SELECT 'Products', COUNT(*) FROM "Products"
UNION ALL
SELECT 'Customers', COUNT(*) FROM "Customers"
UNION ALL
SELECT 'Reviews', COUNT(*) FROM "Reviews"
UNION ALL  
SELECT 'Recommended', COUNT(*) FROM "Recommended";