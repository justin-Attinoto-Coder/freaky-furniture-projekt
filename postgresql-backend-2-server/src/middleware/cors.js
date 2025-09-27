const cors = require('cors');

module.exports = cors({
  origin: '*', // Adjust to restrict origins if needed
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});
