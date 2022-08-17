const { Model, DataTypes } = require('sequelize');

class Plan extends Model {
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
          type: DataTypes.STRING,
          allowNull: false,
        },
        description: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        slug: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        price: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        credits: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        expirationDays: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: true,
        tableName: 'plans',
      }
    );
  }
  static associate(models) {
    this.hasMany(models.User, {
      foreignKey: 'plan_id',
      as: 'users',
    });

    this.hasMany(models.Payment, {
      foreignKey: 'plan_id',
      as: 'payments',
    });
  }
}

module.exports = Plan;
