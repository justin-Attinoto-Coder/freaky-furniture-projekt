const express = require('express');
const router = express.Router();
const db = require('../db/init');

router.post('/', (req, res) => {
  const { fullName, phoneNumber, province, city, streetAddress, postalCode, shippingMethod, carrier, deliveryTime } = req.body;
  console.log('Received shipping details:', req.body);

  const query = `
    INSERT INTO shipping_details (fullName, phoneNumber, province, city, streetAddress, postalCode, shippingMethod, carrier, deliveryTime)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  try {
    const result = db.prepare(query).run(fullName, phoneNumber, province, city, streetAddress, postalCode, shippingMethod, carrier, deliveryTime);
    console.log('Shipping details saved with ID:', result.lastInsertRowid);
    res.json({ id: result.lastInsertRowid });
  } catch (err) {
    console.error('Error saving shipping details:', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;