import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateAfterTransactionsInsertUpdateAndDeleteTrigger1757415184812
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`/* SQL */
      CREATE TRIGGER after_transaction_insert
      AFTER INSERT ON transactions
      FOR EACH ROW
      BEGIN
        IF NEW.is_reversed = FALSE THEN
          UPDATE accounts
            SET balance = balance + NEW.amount_base
            WHERE id = NEW.account_id;
        END IF;
      END;
    `)

    await queryRunner.query(`/* SQL */
      CREATE TRIGGER after_transaction_update
      AFTER UPDATE ON transactions
      FOR EACH ROW
      BEGIN
        IF OLD.is_reversed = FALSE AND NEW.is_reversed = TRUE THEN
          UPDATE accounts
            SET balance = balance - OLD.amount_base
            WHERE id = OLD.account_id;
        ELSEIF OLD.is_reversed = TRUE AND NEW.is_reversed = FALSE THEN
          UPDATE accounts
            SET balance = balance + NEW.amount_base
            WHERE id = NEW.account_id;
        END IF;
      END;
    `)

    await queryRunner.query(`/* SQL */
      CREATE TRIGGER after_transaction_delete
      AFTER DELETE ON transactions
      FOR EACH ROW
      BEGIN
        IF OLD.type = 'TRANSFER' OR OLD.type = 'CREDIT_PAYMENT' OR OLD.type = 'CURRENCY_EXCHANGE' THEN
          UPDATE accounts
            SET balance = balance - OLD.amount_base
            WHERE id = OLD.related_account_id;
        ELSE
          UPDATE accounts
            SET balance = balance - OLD.amount_base
            WHERE id = OLD.account_id;
        END IF;
      END;
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `/* SQL */  DROP TRIGGER IF EXISTS after_transaction_insert;`
    )
    await queryRunner.query(
      `/* SQL */  DROP TRIGGER IF EXISTS after_transaction_update;`
    )
    await queryRunner.query(
      `/* SQL */  DROP TRIGGER IF EXISTS after_transaction_delete;`
    )
  }
}
