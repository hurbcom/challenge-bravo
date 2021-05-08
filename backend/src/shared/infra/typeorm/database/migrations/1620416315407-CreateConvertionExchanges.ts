import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateConvertionExchanges1620416315407
    implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "exchanges",
                columns: [
                    { name: "id", type: "uuid", isPrimary: true },
                    {
                        name: "from",
                        type: "varchar",
                    },
                    {
                        name: "to",
                        type: "varchar",
                    },
                    {
                        name: "amount",
                        type: "numeric",
                    },
                    {
                        name: "rate",
                        type: "numeric",
                    },
                    {
                        name: "base",
                        type: "varchar",
                    },
                    {
                        name: "value",
                        type: "numeric",
                    },
                    {
                        name: "created_date",
                        type: "timestamp",
                        default: "now()",
                    },
                    {
                        name: "expires_date",
                        type: "timestamp",
                        default: "now()",
                    },
                ],
                // foreignKeys: [
                //     {
                //         name: "FKExchangeFrom",
                //         referencedTableName: "currencies",
                //         referencedColumnNames: ["id"],
                //         columnNames: ["from_id"],
                //         onDelete: "SET NULL",
                //         onUpdate: "SET NULL",
                //     },
                //     {
                //         name: "FKExchangeTo",
                //         referencedTableName: "currencies",
                //         referencedColumnNames: ["id"],
                //         columnNames: ["to_id"],
                //         onDelete: "SET NULL",
                //         onUpdate: "SET NULL",
                //     },
                // ],
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("exchanges");
    }
}
