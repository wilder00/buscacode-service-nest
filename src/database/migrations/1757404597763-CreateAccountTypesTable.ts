import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateAccountTypesTable1757404597763
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const query = `/* SQL */
      CREATE TABLE IF NOT EXISTS account_types (
        code VARCHAR(50) NOT NULL PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        description VARCHAR(255),
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `
    await queryRunner.query(query)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const query = `/* SQL */
      DROP TABLE IF EXISTS account_types;
    `
    await queryRunner.query(query)
  }
}
