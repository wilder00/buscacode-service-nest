import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateUsersTable1756594173236 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const query = `/* SQL */
      CREATE TABLE IF NOT EXISTS users (
        id CHAR(36) NOT NULL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        second_name VARCHAR(255),
        last_name VARCHAR(255) NOT NULL,
        second_last_name VARCHAR(255),
        phone VARCHAR(20),
        is_active TINYINT(1) NOT NULL DEFAULT 1,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `
    await queryRunner.query(query)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const dropQuery = `/* SQL */ DROP TABLE IF EXISTS users;`
    await queryRunner.query(dropQuery)
  }
}
