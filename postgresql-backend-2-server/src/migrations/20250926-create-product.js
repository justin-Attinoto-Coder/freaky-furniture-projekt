module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Products', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      namn: { type: Sequelize.STRING, allowNull: false },
      description: { type: Sequelize.TEXT, allowNull: false },
      price: { type: Sequelize.INTEGER, allowNull: false },
      image: { type: Sequelize.STRING, allowNull: false },
      slug: { type: Sequelize.STRING, allowNull: false, unique: true },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('Products');
  },
};
