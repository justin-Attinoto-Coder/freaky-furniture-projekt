const express = require('express');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const rateLimit = require('express-rate-limit');
const router = express.Router();

const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: { message: 'Too many requests, please try again later.' }
});

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Not authorized, no token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired, please log in again' });
    }
    res.status(401).json({ message: 'Invalid token' });
  }
};

router.post('/chat', chatLimiter, authenticate, async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ message: 'Message is required' });

  if (process.env.OPENAI_API_KEY) {
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: 'You are a helpful furniture shopping assistant for Freaky Furniture.' },
            { role: 'user', content: message }
          ]
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );
      const choices = response.data && response.data.choices;
      if (!choices || choices.length === 0 || !choices[0].message) {
        return res.status(500).json({ message: 'Unexpected response from AI service' });
      }
      return res.json({ reply: choices[0].message.content });
    } catch (error) {
      console.error('OpenAI API error:', error.message);
      return res.status(500).json({ message: 'AI service error' });
    }
  }

  const mockReplies = [
    "Hello! I'm your Freaky Furniture assistant. How can I help you find the perfect piece?",
    "Great question! We have a wide selection of furniture to match your style and budget.",
    "I can help you find furniture that suits your home. What are you looking for?",
    "Feel free to browse our categories: Möbler, Förvaring, Detaljer, and Textil!"
  ];
  const reply = mockReplies[Math.floor(Math.random() * mockReplies.length)];
  res.json({ reply });
});

module.exports = router;
