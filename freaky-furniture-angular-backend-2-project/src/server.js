require('dotenv').config();
const { sequelize } = require('./config/database');
const app = require('./app');

const PORT = process.env.PORT || 3000;
sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
