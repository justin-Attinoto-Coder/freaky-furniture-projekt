const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db/init');
const router = express.Router();
const jwtDecode = require('jwt-decode');

const generateToken = (id, role) => {
  console.log('JWT_SECRET:', process.env.JWT_SECRET);
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

const admin = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized as admin' });
    }
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired, please log in again' });
    }
    res.status(401).json({ message: 'Invalid token' });
  }
};

router.post('/register', async (req, res) => {
  const { username, password, role } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const stmt = db.prepare('INSERT INTO users (username, password, role) VALUES (?, ?, ?)');
    stmt.run(username, hashedPassword, role || 'user');
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT') {
      res.status(400).json({ message: 'Username already exists' });
    } else {
      res.status(500).json({ message: 'Server error' });
    }
  }
});

router.post('/login', async (req, res) => {
  console.log('Request Body:', req.body);

  const { username, password } = req.body;

  if (!username || !password) {
    console.log('Missing username or password');
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
    const user = stmt.get(username);

    if (!user) {
      console.log('User not found:', username);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('User found:', user);

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log('Invalid password for user:', username);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user.id, user.role);
    console.log('Login successful for user:', username);
    res.json({
      id: user.id,
      username: user.username,
      role: user.role,
      token,
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/', admin, (req, res) => {
  const users = db.prepare('SELECT id, username, role FROM users').all();
  res.json(users);
});

router.get('/me', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Not authorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const stmt = db.prepare('SELECT id, username, role FROM users WHERE id = ?');
    const user = stmt.get(decoded.id);
    res.json(user);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired, please log in again' });
    }
    res.status(401).json({ message: 'Invalid token' });
  }
});

module.exports = router;