import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateTransactionDetailsTable1757414843456
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const query = `/* SQL */
      CREATE TABLE IF NOT EXISTS transaction_details (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        transaction_id CHAR(36) NOT NULL,
        cash_flow_category_id BIGINT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE RESTRICT,
        FOREIGN KEY (cash_flow_category_id) REFERENCES cash_flow_categories(id) ON DELETE RESTRICT
      );
    `
    await queryRunner.query(query)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const query = `/* SQL */
      DROP TABLE IF EXISTS transaction_details;
    `
    await queryRunner.query(query)
  }
}
