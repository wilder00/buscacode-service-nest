import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateCashFlowCategoriesTable1757413113046
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const query = `/* SQL */
      CREATE TABLE IF NOT EXISTS cash_flow_categories (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255),
        icon VARCHAR(255),
        color VARCHAR(100),
        sort INT DEFAULT 5,
        color_type ENUM('CLASS', 'STYLE') DEFAULT 'STYLE',
        category_father_id BIGINT DEFAULT NULL,
        enabled BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (category_father_id) REFERENCES cash_flow_categories(id) ON DELETE RESTRICT
      );
    `
    await queryRunner.query(query)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const query = `/* SQL */
      DROP TABLE IF EXISTS cash_flow_categories;
    `
    await queryRunner.query(query)
  }
}
