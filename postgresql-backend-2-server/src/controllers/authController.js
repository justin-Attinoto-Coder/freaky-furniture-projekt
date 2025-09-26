const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required.' });
  }
  const user = await User.findOne({ where: { username } });
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: 'Invalid username or password.' });
  }
  const token = jwt.sign({ id: user.id, username: user.username, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: 3600 });
  res.json({ access_token: token, token_type: 'Bearer', expires_in: 3600 });
};
