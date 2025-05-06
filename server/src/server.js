require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const db = require('./db/init');
const furnitureRoutes = require('./routes/furniture');
const cartRoutes = require('./routes/cart');
const reviewsRoutes = require('./routes/reviews');
const recommendedRoutes = require('./routes/recommended');
const shippingDetailsRoutes = require('./routes/shipping-details');
const customersDetailsRoutes = require('./routes/customers');
const paymentDetailsRoutes = require('./routes/payment-details');
const userRoutes = require('./routes/userRoutes');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, '../public')));
app.use(bodyParser.json());

app.use('/api/furniture', furnitureRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/recommended', recommendedRoutes);
app.use('/api/shipping-details', shippingDetailsRoutes);
app.use('/api/customers', customersDetailsRoutes);
app.use('/api/payment-details', paymentDetailsRoutes);
app.use('/api/users', userRoutes);
console.log('Payment details route registered');

app.get('/api/products/:id', (req, res) => {
  try {
    const product = db.prepare('SELECT * FROM furniture WHERE id = ?').get(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    console.error('Error fetching product:', error.message);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

app.get('/api/reviews/:productId', (req, res) => {
  try {
    const reviews = db.prepare('SELECT * FROM reviews WHERE productId = ?').all(req.params.productId);
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error.message);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

app.get('/api/categories', (req, res) => {
  const categories = [
    { id: 'mobler', name: 'Möbler' },
    { id: 'forvaring', name: 'Förvaring' },
    { id: 'detaljer', name: 'Detaljer' },
    { id: 'textil', name: 'Textil' },
  ];
  res.json(categories);
});

app.use((req, res, next) => {
  console.log(`404: ${req.method} ${req.url}`);
  res.status(404).json({ error: 'Not Found' });
});

app.use((err, req, res, next) => {
  console.error(`Server error: ${err.stack}`);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});