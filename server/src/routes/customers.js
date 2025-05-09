const express = require('express');
const router = express.Router();
const db = require('../db/init');

router.post('/', (req, res) => {
  console.log('Received a POST request to http://localhost:8000/api/customers');
  console.log('Request body:', req.body);

  const { fullName, phoneNumber, province, city, streetAddress, postalCode } = req.body;

  if (!fullName || !phoneNumber || !province || !city || !streetAddress || !postalCode) {
    console.error('Validation failed: Missing required fields');
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const query = `
    INSERT INTO customers (fullName, phoneNumber, province, city, streetAddress, postalCode)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  try {
    const result = db.prepare(query).run(fullName, phoneNumber, province, city, streetAddress, postalCode);
    console.log('Customer added successfully:', {
      id: result.lastInsertRowid,
      fullName,
      phoneNumber,
      province,
      city,
      streetAddress,
      postalCode,
    });

    res.status(201).json({
      message: 'Customer details saved successfully!',
      customer: {
        id: result.lastInsertRowid,
        fullName,
        phoneNumber,
        province,
        city,
        streetAddress,
        postalCode,
      },
    });
  } catch (error) {
    console.error('Error saving customer details:', error);
    res.status(500).json({ error: 'Failed to save customer details.' });
  }
});

router.get('/', (req, res) => {
  try {
    const customers = db.prepare('SELECT * FROM customers').all();
    res.status(200).json(customers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: 'Failed to fetch customers.' });
  }
});

module.exports = router;