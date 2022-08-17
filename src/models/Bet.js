const { Model, DataTypes, Sequelize } = require('sequelize');

class Bet extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          allowNull: false,
          primaryKey: true,
        },
        user_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        game_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        num_bets: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        total_cost: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        won: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
        },
        reward: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: 'bets',
        timestamps: true,
      }
    );
  }
  static associate(models) {
    this.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
    });
    this.belongsTo(models.Game, {
      foreignKey: 'game_id',
      as: 'game',
    });
  }
}

module.exports = Bet;
