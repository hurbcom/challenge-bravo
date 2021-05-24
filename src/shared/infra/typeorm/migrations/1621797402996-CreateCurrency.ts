import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateCurrency1621797402996 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "currencies",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
          },
          {
            name: "currency_code",
            type: "varchar",
            isUnique: true,
          },
          {
            name: "currency_name",
            type: "varchar",
            isUnique: true,
          },
          {
            name: "price_usd",
            type: "numeric",
          },
          {
            name: "isFictional",
            type: "Boolean",
          },
          {
            name: "expire_at",
            type: "timestamp",
            isNullable: true,
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("currencies");
  }
}
