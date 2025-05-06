const Database = require('better-sqlite3');
const Chance = require('chance');
const axios = require('axios');
const chance = new Chance();

const db = new Database('./src/db/furniture.db', { verbose: console.log });

function generateSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

function generateSKU() {
  const letters = chance.string({ length: 3, pool: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' });
  const numbers = chance.string({ length: 3, pool: '0123456789' });
  return letters + numbers;
}

function clearTables() {
  db.prepare('DELETE FROM reviews').run();
  db.prepare('DELETE FROM cart').run();
  db.prepare('DELETE FROM furniture').run();
  db.prepare('DELETE FROM customers').run();
  db.prepare('VACUUM').run();
  console.log('Tables cleared.');
}

function createRandomProducts(count) {
  const categories = ['mobler', 'forvaring', 'detaljer', 'textil'];
  const materials = ['Wood', 'Metal', 'Plastic', 'Glass', 'Fabric'];
  const images = ['../public/images/hero-one.jfif', '../public/images/hero-two.jfif'];

  for (let i = 0; i < count; i++) {
    const name = chance.sentence({ words: 3 }).slice(0, -1);
    const brand = chance.company();
    const price = chance.floating({ min: 10, max: 1000, fixed: 2 });
    const description = chance.sentence();
    const publishing_date = chance.date({ year: 2022 }).toISOString().split('T')[0];
    const urlSlug = generateSlug(name);
    const category = categories[Math.floor(Math.random() * categories.length)];
    const image = images[i % images.length];
    const sku = generateSKU();
    const size = `${chance.integer({ min: 50, max: 200 })}x${chance.integer({ min: 50, max: 200 })}x${chance.integer({ min: 50, max: 200 })} cm`;
    const dimensions = `${chance.integer({ min: 50, max: 200 })}x${chance.integer({ min: 50, max: 200 })}x${chance.integer({ min: 50, max: 200 })} cm`;
    const weight = `${chance.floating({ min: 1, max: 50, fixed: 2 })} kg`;
    const material = materials[Math.floor(Math.random() * materials.length)];
    const specifications = `Material: ${material}, Color: ${chance.color({ format: 'name' })}, Assembly required: ${chance.bool() ? 'Yes' : 'No'}, Warranty: ${chance.integer({ min: 1, max: 5 })} years, Made in: ${chance.country({ full: true })}`;

    const stmt = db.prepare('INSERT INTO furniture (name, brand, price, description, publishing_date, urlSlug, category, image, sku, size, dimensions, weight, material, specifications) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
    const info = stmt.run(name, brand, price, description, publishing_date, urlSlug, category, image, sku, size, dimensions, weight, material, specifications);

    createRandomReviews(info.lastInsertRowid, 4);
  }
  console.log(`${count} random products inserted into the database.`);
}

async function createRandomReviews(productId, count) {
  for (let i = 0; i < count; i++) {
    const rating = chance.integer({ min: 1, max: 5 });
    const reviewText = chance.sentence();
    const reviewerName = chance.name();
    const reviewData = {
      productId,
      rating,
      reviewText,
      reviewerName,
    };

    try {
      const response = await axios.post('http://localhost:8000/api/reviews', reviewData);
      console.log('Review added:', response.data);
    } catch (error) {
      console.error('Error adding review:', error);
    }
  }
  console.log(`${count} random reviews inserted for product ID ${productId}.`);
}

function createRandomCustomers(count) {
  for (let i = 0; i < count; i++) {
    const firstName = chance.first();
    const lastName = chance.last();
    const email = chance.email();
    const street = chance.address();
    const postalCode = chance.zip();
    const city = chance.city();
    const stmt = db.prepare('INSERT INTO customers (firstName, lastName, email, street, postalCode, city) VALUES (?, ?, ?, ?, ?, ?)');
    stmt.run(firstName, lastName, email, street, postalCode, city);
  }
  console.log(`${count} random customers inserted into the database.`);
}

/* clearTables(); */
createRandomProducts(1000);
createRandomCustomers(100);