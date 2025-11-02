import path from 'path';
import { Sequelize, Options } from 'sequelize';
import { logger } from '../helpers';
import { app } from 'electron';
import { User, PUC } from '../entities';

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

  const environment = process.env.NODE_ENV;
  const allowedEnv = ['development', 'local'];

  sequelize = new Sequelize({
    ...config,
    storage: resolveDBPath(),
    dialectOptions: {
      ...config.dialectOptions,
      foreign_keys: false,
    },
    logging: environment ? allowedEnv.includes(environment) : false,
  });

  sequelize.authenticate().then(() => {
    logger.log('info', 'DB Connection has been established successfully.');
  });

  // Initialize all models
  initModels();

  // Initialize associations
  initAssociations();
}

function initModels(): void {
  // Initialize all models
  User.initModel(sequelize);
  PUC.initModel(sequelize);
}

function initAssociations(): void {
  // Initialize all associations
  User.associate();
  PUC.associate();
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
