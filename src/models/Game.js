const { Model, DataTypes } = require('sequelize');

class Game extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          allowNull: false,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING(30),
          allowNull: false,
        },
        description: {
          type: DataTypes.STRING(200),
          allowNull: false,
        },
        slug: {
          type: DataTypes.STRING(30),
          allowNull: false,
          defaultValue: 0,
        },
        price: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        reward: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: 'games',
        timestamps: true,
      }
    );
  }
  static associate(models) {
    this.hasMany(models.Bet, {
      foreignKey: 'game_id',
      as: 'games',
    });
  }
}

module.exports = Game;
