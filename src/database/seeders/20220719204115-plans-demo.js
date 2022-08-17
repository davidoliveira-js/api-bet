'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('plans', [
      {
        name: 'Bronze',
        description:
          'O plano Bronze proporciona 30 moedas ao usuário, com prazo de expiração de 7 dias',
        slug: 'PLAN_BRONZE',
        price: 1,
        credits: 30,
        expiration_days: 7,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Prata',
        description:
          'O plano Prata proporciona 100 moedas ao usuário, com prazo de expiração de 30 dias',
        slug: 'PLAN_PRATA',
        price: 2,
        credits: 100,
        expiration_days: 30,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Ouro',
        description:
          'O plano Ouro proporciona 300 moedas ao usuário, com prazo de expiração de 90 dias',
        slug: 'PLAN_OURO',
        price: 3,
        credits: 300,
        expiration_days: 90,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('plans', null, {});
  },
};
