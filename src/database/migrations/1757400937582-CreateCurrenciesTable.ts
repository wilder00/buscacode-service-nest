import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateCurrenciesTable1757400937582 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const query = `/* SQL */
      CREATE TABLE IF NOT EXISTS currencies (
        code CHAR(3) NOT NULL PRIMARY KEY COMMENT 'ISO 4217 alpha code (ej. USD, PEN)',
        numeric_code CHAR(3) NOT NULL COMMENT 'ISO 4217 numeric (ej. "840", "604")',
        name VARCHAR(100) NOT NULL UNIQUE,
        symbol VARCHAR(10) NOT NULL UNIQUE,
        decimals TINYINT(2) NOT NULL DEFAULT 2,
        is_active TINYINT(1) NOT NULL DEFAULT 1,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `
    await queryRunner.query(query)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const query = `
      DROP TABLE IF EXISTS currencies;
    `
    await queryRunner.query(query)
  }
}
