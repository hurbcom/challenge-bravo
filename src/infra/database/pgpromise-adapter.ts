import env from '@/env';
import { DatabaseConnection } from '@/infra/database';

import pgp from 'pg-promise';

export class PgPromiseAdapter implements DatabaseConnection {
  connection: any;

  constructor() {
    this.connection = pgp()(env.DATABASE_URL);
  }

  query(statement: string, params: any): Promise<any> {
    return this.connection.query(statement, params);
  }

  close(): Promise<void> {
    return this.connection.$pool.end();
  }
}

export default PgPromiseAdapter;
