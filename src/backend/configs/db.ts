import path from "path";
import { Sequelize, Options } from "sequelize";
import { logger } from "../helpers";

let sequelize: Sequelize;

export function initDB(config: Options): void {
  if (sequelize) {
    logger.log("info","Database instance already initialized.");
    return;
  }

  sequelize = new Sequelize({
    ...config,
    dialectOptions: {
      ...config.dialectOptions,
      foreign_keys: false,
    },
  });

  sequelize.authenticate().then(() => {
    logger.log("info", "DB Connection has been established successfully.")
  });
}

export function getSequelize(): Sequelize {
  // const dbPath = path.join(app.getPath("userData"), "database.sqlite");
  const dbPath = path.join(__dirname, "database.sqlite");
  if (!sequelize) {
    initDB({
      dialect: "sqlite",
      database: "shivam",
      username: "root",
      password: "",
      host: "localhost",
      port: 3306,
      storage: dbPath,
    });
    // throw new Error('Database not initialized. Call initDB() first.');
  }
  return sequelize;
}
