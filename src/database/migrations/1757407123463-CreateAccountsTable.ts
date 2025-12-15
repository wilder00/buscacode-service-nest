import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateAccountsTable1757407123463 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const query = `/* SQL */
      CREATE TABLE IF NOT EXISTS accounts (
        id CHAR(36) NOT NULL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description VARCHAR(255),
        is_active BOOLEAN DEFAULT TRUE,
        user_id CHAR(36) NOT NULL,
        account_type_code VARCHAR(50) NOT NULL,
        currency_code VARCHAR(3) NOT NULL,
        balance DECIMAL(19, 4) NOT NULL DEFAULT 0.0000,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
        FOREIGN KEY (account_type_code) REFERENCES account_types(code) ON DELETE RESTRICT,
        FOREIGN KEY (currency_code) REFERENCES currencies(code) ON DELETE RESTRICT
      );
    `
    await queryRunner.query(query)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const query = `
      DROP TABLE IF EXISTS accounts;
    `
    await queryRunner.query(query)
  }
}
