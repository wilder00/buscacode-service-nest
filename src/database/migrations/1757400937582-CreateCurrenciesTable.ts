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
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `
    await queryRunner.query(query)

    const insertQuery = `/* SQL */
      INSERT INTO currencies (code, numeric_code, name, symbol, decimals) VALUES
      ('USD', '840', 'Dólar', 'US$', 2),
      ('PEN', '604', 'Nuevo Sol', 'S/', 2),
      ('EUR', '978', 'Euro', '€', 2),
      ('GBP', '826', 'Libra Esterlina', '£', 2),
      ('JPY', '392', 'Yen', '¥', 0),
      ('KRW', '410', 'Won', '₩', 0);
    `
    await queryRunner.query(insertQuery)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const query = `
      DROP TABLE IF EXISTS currencies;
    `
    await queryRunner.query(query)
  }
}
