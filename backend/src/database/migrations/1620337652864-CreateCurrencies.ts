import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateCurrencies1620337652864 implements MigrationInterface {
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
                        name: "symbol",
                        type: "varchar",
                    },
                    {
                        name: "rate",
                        type: "decimal",
                        precision: 2,
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "now()",
                    },
                    {
                        name: "last_checked",
                        type: "varchar",
                        default: "now()",
                    },
                ],
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("currencies");
    }
}
