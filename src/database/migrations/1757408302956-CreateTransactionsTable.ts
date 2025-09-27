import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateTransactionsTable1757408302956
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const query = `/* SQL */
      CREATE TABLE IF NOT EXISTS transactions (
        id CHAR(36) NOT NULL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description VARCHAR(255),
        is_reversed BOOLEAN DEFAULT FALSE COMMENT 'It allow us to omit and modify it when its TRUE, but it should be modified if it is FALSE',
        user_id CHAR(36) NOT NULL,
        account_id CHAR(36) NOT NULL,
        currency_code VARCHAR(3) NOT NULL,
        amount DECIMAL(19, 2) NOT NULL,
        type ENUM('INCOME', 'EXPENSE', 'BALANCE', 'TRANSFER', 'CURRENCY_EXCHANGE', 'CREDIT_PAYMENT') NOT NULL,
        currency_code_base VARCHAR(3) NOT NULL COMMENT 'The currency code of the account',
        amount_base DECIMAL(19, 2) NOT NULL COMMENT 'The amount_base is in the account currency value',
        exchange_rate DECIMAL(19, 3) NOT NULL COMMENT 'Is the factor to convert the amount to amount_base',
        related_account_id CHAR(36) COMMENT 'The id of the account related to the transaction like transfer, currency exchange or credit payment',
        reference_uuid CHAR(36) COMMENT 'The uuid of the reference to the transaction between our accounts. Both transaction should have the same reference_uuid',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
        FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE RESTRICT,
        FOREIGN KEY (currency_code) REFERENCES currencies(code) ON DELETE RESTRICT,
        FOREIGN KEY (currency_code_base) REFERENCES currencies(code) ON DELETE RESTRICT,
        INDEX idx_transactions_account_id (account_id),
        INDEX idx_transactions_reference_uuid (reference_uuid),
        INDEX idx_transactions_user_id (user_id)
      );
    `
    await queryRunner.query(query)

    const query2 = `/* SQL */
      CREATE INDEX idx_user_account ON transactions (user_id, account_id);
    `
    await queryRunner.query(query2)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const query = `/* SQL */
      DROP TABLE IF EXISTS transactions;
    `
    await queryRunner.query(query)
  }
}
