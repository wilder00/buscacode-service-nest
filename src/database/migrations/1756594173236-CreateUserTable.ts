import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateUserTable1756594173236 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const query = `
      CREATE TABLE IF NOT EXISTS users (
        id CHAR(36) NOT NULL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        second_last_name VARCHAR(255),
        phone VARCHAR(20),
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL
      );
    `
    await queryRunner.query(query)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const isEmptyQuery = `SELECT COUNT(*) as count FROM users;`
    const isEmpty = (await queryRunner.query(isEmptyQuery)) as [
      { count: number }
    ]

    if (isEmpty[0].count === 0) {
      const dropQuery = `DROP TABLE IF EXISTS users;`
      await queryRunner.query(dropQuery)
    } else {
      throw new Error('Should not delete users table because it has data')
    }
  }
}
