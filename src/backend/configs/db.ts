import path from 'path';
import { Sequelize, Options } from 'sequelize';
import { app } from 'electron';

// Declare a variable to hold the Sequelize instance
let sequelize: Sequelize;

export function initDB(config: Options): void {
  if (sequelize) {
    console.log("Database instance already initialized.");
    return;
  }

  sequelize = new Sequelize(config);

  sequelize.authenticate()
    .then(() => {
      console.info("DB Connection has been established successfully.");
      return sequelize.sync({ force: false });
    })
    .then(() => {
      console.info('Database & tables created!');
    })
    .catch((error: any) => {
      console.error(`Unable to connect to the database: ${error}`);
    });
}

export function getSequelize(): Sequelize {
  const dbPath = path.join(app.getPath('userData'), 'database.sqlite');
  if (!sequelize) {
    initDB({
      dialect: "sqlite",
      database: "shivam",
      username: "root",
      password: "",
      host: "localhost",
      port: 3306,
      storage: dbPath,
    })
    // throw new Error('Database not initialized. Call initDB() first.');
  }
  return sequelize;
}
