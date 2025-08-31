import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateCredentialTable1756596496554 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const query = `
      CREATE TABLE IF NOT EXISTS credentials (
        id INT NOT NULL AUTO_INCREMENT,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        user_id CHAR(36) NOT NULL,
        is_active TINYINT(1) NOT NULL DEFAULT 1,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT
      );
    `
    await queryRunner.query(query)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const isEmptyQuery = `SELECT COUNT(*) as count FROM credentials;`
    const isEmpty = (await queryRunner.query(isEmptyQuery)) as [
      { count: string }
    ]

    if (isEmpty[0].count === '0') {
      const dropQuery = `DROP TABLE IF EXISTS credentials;`
      await queryRunner.query(dropQuery)
    } else {
      throw new Error('Should not delete credentials table because it has data')
    }
  }
}
