import { MigrationInterface, QueryRunner } from "typeorm";

export class SecondMigration1685317875699 implements MigrationInterface {
    name = 'SecondMigration1685317875699'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "name" TO "firstName"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "firstName" TO "name"`);
    }

}
