'use strict';

const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('users', [
      {
        email: 'admin@gmail.com',
        username: 'admin',
        password: await bcrypt.hash('admin', 10),
        email_verified: false,
        role: 'ADMIN',
        have_plan: false,
        plan_id: 3,
        credits: 999,
        plan_expiration_date: null,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  },
};
