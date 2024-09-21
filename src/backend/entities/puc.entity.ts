import { DataTypes } from "sequelize";
import { getSequelize } from "../configs";
import { User } from "../entities"

export const PUC = getSequelize().define("pucs", {
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
  tableName: "pucs",
  timestamps: true,
});

PUC.belongsTo(User, { foreignKey: "userId"});
User.hasMany(PUC, { foreignKey: "userId"});