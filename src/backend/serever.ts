import { json, urlencoded } from "body-parser";
import compression from "compression";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import methodOverride from "method-override";
import "reflect-metadata";
import Routes from "./routes";
import { initDB } from "./configs/db";
import path from "path";
import { app } from "electron";
import { User, PUC } from "./entities";
import { logger } from "./helpers";
import { ApiLoggerMiddleware } from "./middlewares/logger.middleware";
import ReminderNotification from "./cron/notification.cron";
import cors from "cors";
import { getSequelize } from "./configs/db";
dotenv.config();

export default class App {
  protected app: express.Application;
  private logger = logger;
  private reminderNotification = new ReminderNotification();

  public async init() {
    // Init DB
    initDB({
      dialect: "sqlite",
      database: "shivam",
      username: "root",
      password: "",
      host: "localhost",
      port: 3306,
      // storage: path.join(app.getPath("userData"), "database.sqlite"),
      storage: path.join(__dirname, "database.sqlite"),
    });

    // Ensure models are initialized
    User;
    PUC;

    // Sync database to create tables
    const sequelize = getSequelize();
    try {
      await sequelize.sync({ force: false });
      this.logger.log("info", "Database tables synchronized successfully.");
    } catch (error) {
      this.logger.log("error", `Database sync failed: ${error}`);
    }

    // Init Express
    this.app = express();

    // Security
    this.app.use(helmet());
    this.app.use(morgan("tiny"));
    this.app.use(compression());

    // CORS setting
    this.app.use(cors());

    // Enable DELETE and PUT
    this.app.use(methodOverride());

    // Body Parsing
    this.app.use(json({ limit: "50mb" }));
    this.app.use(urlencoded({ extended: true }));

    // Middlewares
    this.app.use(new ApiLoggerMiddleware().logApiCall);

    // Routing
    const routes = new Routes();
    this.app.use("/", routes.configure());

    // Start server
    this.app.listen(process.env.PORT || 3200, () => {
      this.logger.log(
        "info",
        `The server is running in port localhost: ${process.env.PORT || 3200}`
      );
    });

    // Start notification cron
    // this.reminderNotification.start();
  }

  public getExpresApp() {
    return this.app;
  }
}
