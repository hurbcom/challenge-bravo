import { MigrationInterface, QueryRunner } from "typeorm";

export class featNewTableCurrecy1656704005330 implements MigrationInterface {
    name = 'featNewTableCurrecy1656704005330'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "currency" ("id" uuid NOT NULL, "symbol" character varying NOT NULL, "name" character varying NOT NULL, "price" double precision NOT NULL, "last_updated" TIMESTAMP NOT NULL, "date_added" TIMESTAMP NOT NULL, CONSTRAINT "UQ_25fd91050301f15e352646105d3" UNIQUE ("symbol"), CONSTRAINT "PK_3cda65c731a6264f0e444cc9b91" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "currency"`);
    }

}
