import { SequelizeStorage, Umzug } from 'umzug';
import { getSequelize } from '../configs';
import { Sequelize } from 'sequelize';
import { app } from 'electron';
import { Logger } from '../helpers/logger.helper';

export class Migrator extends Umzug<Sequelize> {
  private logger = Logger.getInstance();

  constructor(private sequelize: Sequelize = getSequelize()) {
    super({
      migrations: {
        glob: [
          app && app.isPackaged ? 'migrations/*.js' : 'migrations/*.ts',
          { cwd: __dirname },
        ],
      },
      context: sequelize,
      storage: new SequelizeStorage({
        sequelize,
      }),
      logger: console,
    });
  }

  public async runMigrations() {
    this.logger.log(
      'info',
      `Applying migrations from ${app && app.isPackaged ? 'migrations/*.js' : 'migrations/*.ts'}`
    );
    const migrations = await this.up();

    this.logger.log('info', `Applied ${migrations.length} migrations.`);

    for (const migration of migrations) {
      this.logger.log('info', `Applied migration: ${migration.name}`);
      this.logger.log(
        'info',
        `Migration Path: ${JSON.stringify(migration.path)}`
      );
    }
  }
}

const migrator = new Migrator();
export type Migration = typeof migrator._types.migration;
