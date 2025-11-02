import {
  Model,
  DataTypes,
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
} from 'sequelize';

export default class PUC extends Model<
  InferAttributes<PUC>,
  InferCreationAttributes<PUC>
> {
  // #region Columns
  declare id?: number;
  declare vehicleNumber: string;
  declare vehicleType: string;
  declare issueDate: Date;
  declare expirationDate: Date;
  declare documentType?: string;
  declare userId: number;
  declare deleted?: boolean;
  declare deletedAt?: Date;
  declare readonly createdAt?: Date;
  declare readonly updatedAt?: Date;
  // #endregion

  // #region Associations
  declare user?: NonAttribute<unknown>;
  // #endregion

  static initModel(sequelize: Sequelize) {
    PUC.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        vehicleNumber: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        vehicleType: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        issueDate: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        expirationDate: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        documentType: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        userId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        deleted: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        deletedAt: {
          type: DataTypes.DATE,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'pucs',
        timestamps: true,
      }
    );

    return PUC;
  }

  static associate() {
    // Define associations here
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const User = require('./user.entity').default;
    PUC.belongsTo(User, { foreignKey: 'userId', as: 'user' });
  }
}
