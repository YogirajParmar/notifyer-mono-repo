import { User } from './user.entity';
import { PUC } from './puc.entity';

User.hasMany(PUC, { foreignKey: "userId" });
PUC.belongsTo(User, { foreignKey: "userId" });

export { User, PUC };