import path from 'path';
import { Sequelize, Options } from 'sequelize';
import { logger } from '../helpers';
import { app } from 'electron';

let sequelize: Sequelize;

function resolveDBPath(): string {
  if (!app) {
    return path.resolve(__dirname, '../../.dev-db/database.sqlite');
  } else {
    return path.join(app.getPath('userData'), 'database.sqlite');
  }
}

export function initDB(config: Options): void {
  if (sequelize) {
    logger.log('info', 'Database instance already initialized.');
    return;
  }

  sequelize = new Sequelize({
    ...config,
    dialectOptions: {
      ...config.dialectOptions,
      foreign_keys: false,
    },
    logging: false,
  });

  sequelize.authenticate().then(() => {
    logger.log('info', 'DB Connection has been established successfully.');
  });
}

export function getSequelize(): Sequelize {
  if (!sequelize) {
    const dbPath = resolveDBPath();

    initDB({
      dialect: 'sqlite',
      database: 'shivam',
      username: 'root',
      password: '',
      host: 'localhost',
      port: 3306,
      storage: dbPath,
    });
  }
  return sequelize;
}
