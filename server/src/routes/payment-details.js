const express = require('express');
const router = express.Router();
const db = require('../db/init');
const crypto = require('crypto');

const encrypt = (text) => {
  try {
    const algorithm = 'aes-256-cbc';
    const key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');
    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return `${iv.toString('hex')}:${encrypted}`;
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data.');
  }
};

router.post('/', (req, res) => {
  console.log('Received a POST request to /api/payment-details');
  console.log('Request body:', req.body);
  try {
    const { cardHolderName, cardNumber, expiryDate, cvv } = req.body;

    if (!cardHolderName || !cardNumber || !expiryDate || !cvv) {
      console.error('Validation failed: Missing required fields');
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const encryptedCardNumber = encrypt(cardNumber);
    const encryptedCVV = encrypt(cvv);

    const stmt = db.prepare(`
      INSERT INTO payment_details (card_holder_name, card_number, expiry_date, cvv)
      VALUES (?, ?, ?, ?)
    `);
    const result = stmt.run(cardHolderName, encryptedCardNumber, expiryDate, encryptedCVV);
    console.log('Payment details saved successfully:', {
      id: result.lastInsertRowid,
      cardHolderName,
      expiryDate
    });

    res.status(201).json({ message: 'Payment details saved successfully.', id: result.lastInsertRowid });
  } catch (error) {
    console.error('Error saving payment details:', error);
    res.status(500).json({ error: 'Failed to save payment details.' });
  }
});

module.exports = router;