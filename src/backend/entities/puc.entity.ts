import { Model, DataTypes, Sequelize } from "sequelize";
import { getSequelize } from "../configs";
import { User } from "../entities"

class PUC extends Model {
  public id!: number;
  public vehicleNumber!: string;
  public vehicleType!: string;
  public issueDate!: Date;
  public expirationDate!: Date;
  public documentType!: string;
  public userId!: number;
}

PUC.init({
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
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  sequelize: getSequelize(),
  tableName: "pucs",
  timestamps: true,
});

PUC.belongsTo(User, { foreignKey: "userId"});
User.hasMany(PUC, { foreignKey: "userId"});

export { PUC };