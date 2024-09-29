import cron from "node-cron";
import { sendNotification } from "../helpers/notification.helper";
import { Op } from "sequelize";
import { PUC } from "../entities";
import { Constants } from "../configs";
import { logger } from "../helpers/logger.helper";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";

dayjs.extend(isBetween);

class ReminderNotification {
  private logger = logger;

  constructor() {}

  public start() {
    try {
      this.logger.log("info", "Notification cron job processing!");
      const cronSchedule = Constants.CRON_SCHEDULE;

      cron.schedule(cronSchedule, async () => {
        const today = dayjs().startOf('day');
        const checkPoint = dayjs().add(15, 'day').endOf('day');

        const expiringDocs = await PUC.findAll({
          where: {
            expirationDate: { [Op.lte]: checkPoint.toDate(), [Op.gte]: today.toDate() },
          },
        });

        expiringDocs.forEach((doc) => {
          const expiration = dayjs(doc.expirationDate).startOf('day');
          const diffDays = expiration.diff(today, 'day');

          const body = `${doc.documentType} for vehicle ${doc.vehicleNumber} will expire in ${diffDays} days!`;
          this.logger.log("info", body);
          sendNotification(`Alert! 🚨`, body);
        });
      });
    } catch (error) {
      this.logger.log("error", `Error processing expiring documents: ${error}`);
    }
  }
}

export default ReminderNotification;
