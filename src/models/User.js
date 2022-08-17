const { Model, DataTypes } = require('sequelize');

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          allowNull: false,
          primaryKey: true,
        },
        email: {
          type: DataTypes.STRING(80),
          allowNull: false,
        },
        username: {
          type: DataTypes.STRING(20),
          allowNull: false,
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        email_verified: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        role: {
          type: DataTypes.STRING,
          allowNull: false,
          defaultValue: 'USER',
        },
        have_plan: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        plan_id: {
          type: DataTypes.INTEGER,
          allowNull: true,
          defaultValue: null,
        },
        credits: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        plan_expiration_date: {
          type: DataTypes.DATE,
          allowNull: true,
          defaultValue: null,
        },
      },
      {
        sequelize,
        tableName: 'users',
        timestamps: true,
      }
    );
  }
  static associate(models) {
    this.belongsTo(models.Plan, {
      foreignKey: 'plan_id',
      as: 'plan',
    });
    this.hasMany(models.Bet, {
      foreignKey: 'user_id',
      as: 'bets',
    });

    this.hasMany(models.Payment, {
      foreignKey: 'user_id',
      as: 'payments',
    });
  }
}

module.exports = User;
