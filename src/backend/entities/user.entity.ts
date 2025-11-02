import {
  Model,
  DataTypes,
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
} from 'sequelize';

export default class User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User>
> {
  // #region Columns
  declare id?: number;
  declare firstName: string;
  declare lastName: string;
  declare password: string;
  declare email: string;
  declare readonly createdAt?: Date;
  declare readonly updatedAt?: Date;
  // #endregion

  // #region Associations
  declare pucs?: NonAttribute<unknown>;
  // #endregion

  static initModel(sequelize: Sequelize) {
    User.init(
      {
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        firstName: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        lastName: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: 'users',
        timestamps: true,
      }
    );

    return User;
  }

  static associate() {
    // Define associations here
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const PUC = require('./puc.entity').default;
    User.hasMany(PUC, { foreignKey: 'userId', as: 'pucs' });
  }
}
