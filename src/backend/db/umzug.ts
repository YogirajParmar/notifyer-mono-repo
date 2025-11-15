import { SequelizeStorage, Umzug } from 'umzug';
import { getSequelize } from '../configs';
import { Sequelize } from 'sequelize';

export class Migrator extends Umzug<Sequelize> {
  constructor(private sequelize: Sequelize = getSequelize()) {
    super({
      migrations: {
        glob: ['migrations/*.ts', { cwd: __dirname }],
      },
      context: sequelize,
      storage: new SequelizeStorage({
        sequelize,
      }),
      logger: console,
    });
  }

  public async runMigrations() {
    await this.up();
  }
}

const migrator = new Migrator();
export type Migration = typeof migrator._types.migration;
