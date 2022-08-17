'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('games', [
      {
        name: 'Roleta 1',
        description: 'Roleta do tipo 1',
        slug: 'GAME_ROLETA_1',
        price: 1,
        reward: 2,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Roleta 2',
        description: 'Roleta do tipo 2',
        slug: 'GAME_ROLETA_2',
        price: 2,
        reward: 6,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Roleta 3',
        description: 'Roleta do tipo 3',
        slug: 'GAME_ROLETA_3',
        price: 3,
        reward: 18,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('games', null, {});
  },
};
