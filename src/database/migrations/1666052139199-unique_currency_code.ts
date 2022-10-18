import { MigrationInterface, QueryRunner } from "typeorm";

export class uniqueCurrencyCode1666052139199 implements MigrationInterface {
    name = 'uniqueCurrencyCode1666052139199'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "currency" ADD CONSTRAINT "UQ_723472e41cae44beb0763f4039c" UNIQUE ("code")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "currency" DROP CONSTRAINT "UQ_723472e41cae44beb0763f4039c"`);
    }

}
