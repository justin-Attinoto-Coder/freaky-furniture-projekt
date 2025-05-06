const Database = require('better-sqlite3');
const db = new Database('./src/db/furniture.db', { verbose: console.log }); // Relative to src/db/

// Create furniture table if it doesn't exist
db.prepare(`
  CREATE TABLE IF NOT EXISTS furniture (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    brand TEXT,
    price REAL,
    description TEXT,
    sku TEXT UNIQUE,
    publishing_date TEXT,
    urlSlug TEXT UNIQUE,
    category TEXT,
    image TEXT,
    size TEXT,
    dimensions TEXT,
    weight TEXT,
    material TEXT,
    specifications TEXT
  )
`).run();

// Create cart table if it doesn't exist
db.prepare(`
  CREATE TABLE IF NOT EXISTS cart (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    productId INTEGER,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    quantity INTEGER NOT NULL,
    imageURL TEXT NOT NULL,
    brand TEXT NOT NULL,
    FOREIGN KEY (productId) REFERENCES furniture(id)
  )
`).run();

// Create reviews table if it doesn't exist
db.prepare(`
  CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    productId INTEGER NOT NULL,
    rating INTEGER NOT NULL,
    reviewText TEXT,
    reviewerName TEXT NOT NULL,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (productId) REFERENCES furniture(id)
  )
`).run();

// Create customers table if it doesn't exist
db.prepare(`
  CREATE TABLE IF NOT EXISTS customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fullName TEXT NOT NULL,
    phoneNumber TEXT NOT NULL,
    province TEXT NOT NULL,
    city TEXT NOT NULL,
    streetAddress TEXT NOT NULL,
    postalCode TEXT NOT NULL
  )
`).run();

// Create shipping_details table if it doesn't exist
db.prepare(`
  CREATE TABLE IF NOT EXISTS shipping_details (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fullName TEXT NOT NULL,
    phoneNumber TEXT NOT NULL,
    province TEXT NOT NULL,
    city TEXT NOT NULL,
    streetAddress TEXT NOT NULL,
    postalCode TEXT NOT NULL,
    shippingMethod TEXT NOT NULL,
    carrier TEXT NOT NULL,
    deliveryTime TEXT NOT NULL
  )
`).run();

// Create recommended table if it doesn't exist
db.prepare(`
  CREATE TABLE IF NOT EXISTS recommended (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    FOREIGN KEY (product_id) REFERENCES furniture(id)
  )
`).run();

// Create payment_details table if it doesn't exist
db.prepare(`
  CREATE TABLE IF NOT EXISTS payment_details (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    card_holder_name TEXT NOT NULL,
    card_number TEXT NOT NULL,
    expiry_date TEXT NOT NULL,
    cvv TEXT NOT NULL
  )
`).run();

// Create users table if it doesn't exist
db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('user', 'admin'))
  )
`).run();

// Automatically fill the recommended table if it's empty
const recommendedCount = db.prepare('SELECT COUNT(*) AS count FROM recommended').get().count;
if (recommendedCount === 0) {
  const furnitureItems = db.prepare('SELECT id FROM furniture').all();
  const insertRecommended = db.prepare('INSERT INTO recommended (product_id) VALUES (?)');
  furnitureItems.forEach(item => {
    insertRecommended.run(item.id);
  });
}

// Automatically populate the users table if it's empty
const userCount = db.prepare('SELECT COUNT(*) AS count FROM users').get().count;
if (userCount === 0) {
  const insertUser = db.prepare('INSERT INTO users (username, password, role) VALUES (?, ?, ?)');
  const bcrypt = require('bcryptjs');

  const hashedAdminPassword = bcrypt.hashSync('admin123', 10);
  const hashedUserPassword = bcrypt.hashSync('user123', 10);

  insertUser.run('admin', hashedAdminPassword, 'admin');
  for (let i = 1; i <= 9; i++) {
    insertUser.run(`user${i}`, hashedUserPassword, 'user');
  }

  console.log('Users table populated with 10 users (including an admin).');
}

module.exports = db;