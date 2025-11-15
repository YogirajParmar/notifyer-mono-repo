import { DataTypes } from 'sequelize';
import { Migration } from '../umzug';

export const up: Migration = async ({ context: sequelize }) => {
  const transaction = await sequelize
    .getQueryInterface()
    .sequelize.transaction();

  try {
    await sequelize.getQueryInterface().addColumn('pucs', 'deleted', {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
    await sequelize.getQueryInterface().addColumn('pucs', 'deletedAt', {
      type: DataTypes.DATE,
      allowNull: true,
    });

    await transaction.commit();
  } catch (err: any) {
    transaction.rollback();
    throw new Error(err);
  }
};
