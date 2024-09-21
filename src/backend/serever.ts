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
dotenv.config();

export default class App {
  protected app: express.Application;

  public init() {
    // Init DB
    initDB({
      dialect: "sqlite",
      database: "shivam",
      username: "root",
      password: "",
      host: "localhost",
      port: 3306,
      storage: path.join(__dirname, "../../database.sqlite"),
    });

    // Init Express
    this.app = express();

    // Security
    this.app.use(helmet());
    this.app.use(morgan("tiny"));
    this.app.use(compression());

    // Enable DELETE and PUT
    this.app.use(methodOverride());

    // Body Parsing
    this.app.use(json({ limit: "50mb" }));
    this.app.use(urlencoded({ extended: true }));

    // Routing
    const routes = new Routes();
    this.app.use("/", routes.configure());

    // Start server
    this.app.listen(process.env.PORT || 3200, () => {
      console.info(`The server is running in port localhost: ${process.env.PORT}`);
    });
  }

  public getExpresApp() {
    return this.app;
  }
}
