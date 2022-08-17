'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('bets', [
      {
        user_id: 1,
        game_id: 1,
        num_bets: 1,
        total_cost: 1,
        won: true,
        reward: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('bets', null, {});
  },
};
