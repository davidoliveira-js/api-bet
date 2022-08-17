'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('games', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING(30),
        unique: true,
        allowNull: false,
        notEmpty: true,
      },
      description: {
        type: Sequelize.STRING(200),
        allowNull: false,
        notEmpty: true,
      },
      slug: {
        type: Sequelize.STRING(30),
        allowNull: false,
        notEmpty: true,
      },
      price: {
        type: Sequelize.INTEGER,
        allowNull: false,
        notEmpty: true,
      },
      reward: {
        type: Sequelize.INTEGER,
        allowNull: false,
        notEmpty: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('games');
  },
};
