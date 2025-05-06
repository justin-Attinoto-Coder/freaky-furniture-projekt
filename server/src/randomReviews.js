const fs = require('fs');
const Chance = require('chance');
const chance = new Chance();
const axios = require('axios');
const Database = require('better-sqlite3');

const db = new Database('./src/db/furniture.db', { verbose: console.log });

const fetchValidProductIds = () => {
  try {
    const rows = db.prepare('SELECT id FROM furniture').all();
    return rows.map((row) => row.id);
  } catch (error) {
    console.error('Error fetching product IDs:', error);
    return [];
  }
};

const productIds = fetchValidProductIds();

const generateReviewsForProduct = (productId, numReviews = 5) => {
  const reviews = [];
  let totalRating = 0;

  for (let i = 0; i < numReviews; i++) {
    const rating = chance.integer({ min: 1, max: 5 });
    totalRating += rating;

    reviews.push({
      productId,
      rating,
      reviewText: chance.sentence({ words: 10 }),
      reviewerName: chance.name(),
      createdAt: new Date().toISOString(),
    });
  }

  const averageRating = totalRating / numReviews;

  return { reviews, averageRating };
};

const generateReviewsForAllProducts = (productIds) => {
  const allReviews = [];
  const productRatings = {};

  productIds.forEach((productId) => {
    const { reviews, averageRating } = generateReviewsForProduct(productId);
    allReviews.push(...reviews);
    productRatings[productId] = averageRating;
  });

  return { allReviews, productRatings };
};

const insertReviewsIntoDatabase = (reviews) => {
  try {
    const insert = db.prepare(
      'INSERT INTO reviews (productId, rating, reviewText, reviewerName, createdAt) VALUES (?, ?, ?, ?, ?)'
    );

    reviews.forEach((review) => {
      insert.run(
        review.productId,
        review.rating,
        review.reviewText,
        review.reviewerName,
        review.createdAt
      );
    });

    console.log('Random reviews inserted into the database');
  } catch (error) {
    console.error('Error inserting reviews into the database:', error);
  }
};

const main = () => {
  const { allReviews, productRatings } = generateReviewsForAllProducts(productIds);

  fs.writeFileSync('randomReviews.json', JSON.stringify(allReviews, null, 2));

  fs.writeFileSync('productRatings.json', JSON.stringify(productRatings, null, 2));

  console.log('Random reviews and average ratings generated:');
  console.log('Reviews saved to randomReviews.json');
  console.log('Average ratings saved to productRatings.json');

  insertReviewsIntoDatabase(allReviews);
};

main();