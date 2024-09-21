import cron from "node-cron";
import { User} from "../entities";
import { PUC } from '../entities';
import { sendNotification } from "../helpers";
import moment from "moment";
import { Op } from "sequelize";

class NotificationCron {
  public start() {
    try {
      cron.schedule(`${process.env.CRON_SCHEDULE || "* 4 * * *"}`, async () => {
        console.log(`Executing notification cron ${Date.now()}!`);
        const targetDate = moment().add(5, "days").toDate();

        const expiringPucs = await PUC.findAll({
          where: {
            expirationDate: {[Op.lte]: targetDate},
          },
          include: [
            {
              model: User,
              as: "user",
              attributes: ["email"],
            },
          ],
        });

        expiringPucs.forEach(async (puc: any) => {
          const user = puc.dataValues.user;
          const message = `Your PUC for vehicle ${puc.dataValues.vehicleNumber} is expiring on ${moment(puc.dataValues.expirationDate).format("YYYY-MM-DD")}. Please renew it.`;

          await sendNotification(user.email, message);
        });
      });
    } catch (error) {
      console.error(`Error from updateIntegrationConfiguration cron : ${error}`);
    }
  }
}

export default NotificationCron;