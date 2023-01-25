import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateCurrency1674423830519 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "currency",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                    },
                    {
                        name: "code",
                        type: "varchar",
                    },
                    {
                        name: "codein",
                        type: "varchar",
                    },
                    {
                        name: "name",
                        type: "varchar",
                    },
                    {
                        name: "high",
                        type: "varchar",
                    },
                    {
                        name: "low",
                        type: "varchar",
                    },
                    {
                        name: "type",
                        type: "varchar",
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "now()",
                    },
                    {
                        name: "updated_at",
                        type: "timestamp",
                        default: "now()",
                    },
                ],
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("currency");
    }
}
