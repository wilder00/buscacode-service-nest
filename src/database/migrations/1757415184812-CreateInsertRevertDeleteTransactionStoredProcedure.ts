import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateInsertRevertDeleteTransactionStoredProcedure1757415184812
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`/* SQL */
      CREATE PROCEDURE proc_insert_transaction(
        IN p_name VARCHAR(100),
        IN p_description VARCHAR(255),
        IN p_user_id CHAR(36),
        IN p_account_id CHAR(36),
        IN p_currency_code VARCHAR(3),
        IN p_currency_code_base VARCHAR(3),
        IN p_type VARCHAR(50),
        IN p_amount DECIMAL(19, 2),
        IN p_amount_base DECIMAL(19, 2),
        IN p_exchange_rate DECIMAL(19, 3),
        IN p_related_account_id CHAR(36)
      )
      BEGIN
        DECLARE transaction_id CHAR(36);
        DECLARE pair_reference_uuid CHAR(36);
        DECLARE exit HANDLER FOR SQLEXCEPTION
        BEGIN
          ROLLBACK;
          RESIGNAL;
        END;

        START TRANSACTION;

          IF p_account_id IS NULL OR 
          p_amount IS NULL OR 
          p_amount_base IS NULL OR 
          p_exchange_rate IS NULL OR 
          p_type IS NULL OR 
          p_currency_code IS NULL OR 
          p_currency_code_base IS NULL THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'The account id, amount, amount_base, exchange_rate, type, currency_code, currency_code_base cannot be NULL';
          END IF;

          SET transaction_id = UUID();

          IF p_type = 'TRANSFER' OR p_type = 'CREDIT_PAYMENT' OR p_type = 'CURRENCY_EXCHANGE' THEN
            IF p_related_account_id IS NULL THEN
              SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'The related account id cannot be NULL';
            END IF;
            
            IF p_amount_base >= 0 THEN
              SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'The amount base cannot be greater than or equal to 0';
            END IF;

            SET pair_reference_uuid = UUID();

            -- Insert Transaction for Account origin
            INSERT INTO transactions (
              id,
              name,
              description,
              user_id,
              account_id,
              currency_code,
              currency_code_base,
              type,
              amount,
              amount_base,
              exchange_rate,
              related_account_id,
              reference_uuid
            )
            VALUES (
              transaction_id,
              p_name,
              p_description,
              p_user_id,
              p_account_id, -- Account origin
              p_currency_code,
              p_currency_code_base,
              p_type,
              p_amount,
              p_amount_base,
              p_exchange_rate,
              p_related_account_id, -- Account related
              pair_reference_uuid
            );

            -- Insert Transaction for Account related
            INSERT INTO transactions (
              id,
              name,
              description,
              user_id,
              account_id,
              currency_code,
              currency_code_base,
              type,
              amount,
              amount_base,
              exchange_rate,
              related_account_id,
              reference_uuid
            )
            VALUES (
              UUID(),
              p_name,
              p_description,
              p_user_id,
              p_related_account_id, -- Account related
              p_currency_code,
              p_currency_code_base,
              p_type,
              p_amount * -1,
              p_amount_base * -1,
              p_exchange_rate,
              p_account_id, -- Account origin
              pair_reference_uuid
            );
            UPDATE accounts
              SET balance = balance - p_amount_base
              WHERE id = p_related_account_id;

          ELSE
            INSERT INTO transactions (
              id,
              name,
              description,
              user_id,
              account_id,
              currency_code,
              currency_code_base,
              type,
              amount,
              amount_base,
              exchange_rate
            )
            VALUES (
              transaction_id,
              p_name,
              p_description,
              p_user_id,
              p_account_id,
              p_currency_code,
              p_currency_code_base,
              p_type,
              p_amount,
              p_amount_base,
              p_exchange_rate
            );
          END IF;
          UPDATE accounts
            SET balance = balance + p_amount_base
            WHERE id = p_account_id;

        COMMIT;
          
        SELECT * FROM transactions
        WHERE id = transaction_id;
      END;
    `)

    await queryRunner.query(`/* SQL */
      CREATE PROCEDURE proc_reverse_transaction(
        IN p_id CHAR(36)
      )
      BEGIN
        DECLARE p_type VARCHAR(50);
        DECLARE p_is_reversed BOOLEAN;
        DECLARE p_account_id CHAR(36);
        DECLARE p_related_account_id CHAR(36);
        DECLARE p_amount_base DECIMAL(19, 2);
        DECLARE p_reference_uuid CHAR(36);
        
        DECLARE CONTINUE HANDLER FOR NOT FOUND
          SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Transaction not found';
        DECLARE exit HANDLER FOR SQLEXCEPTION
        BEGIN
          ROLLBACK;
          RESIGNAL;
        END;

        START TRANSACTION;

          IF p_id IS NULL THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'The id cannot be NULL';
          END IF;

          
          SELECT 
            type,
            is_reversed,
            account_id,
            related_account_id,
            amount_base,
            reference_uuid
          INTO 
            p_type,
            p_is_reversed,
            p_account_id,
            p_related_account_id,
            p_amount_base,
            p_reference_uuid
          FROM transactions WHERE id = p_id;

          IF p_is_reversed THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'The transaction is already reversed';
          END IF;

          IF p_type = 'TRANSFER' OR p_type = 'CREDIT_PAYMENT' OR p_type = 'CURRENCY_EXCHANGE' THEN

            UPDATE accounts
              SET balance = balance + p_amount_base -- return the action of the transaction to the related account
              WHERE id = p_related_account_id;
            
            UPDATE transactions
              SET is_reversed = TRUE
              WHERE reference_uuid = p_reference_uuid AND id != p_id;

          END IF;

          UPDATE accounts
              SET balance = balance - p_amount_base -- remove the action of the transaction
              WHERE id = p_account_id;
          
          UPDATE transactions
            SET is_reversed = TRUE
            WHERE id = p_id;

        COMMIT;

        SELECT * FROM transactions
        WHERE id = p_id;
      END;
    `)

    await queryRunner.query(`/* SQL */
      CREATE PROCEDURE proc_apply_transaction(
        IN p_id CHAR(36)
      )
      BEGIN
        DECLARE p_type VARCHAR(50);
        DECLARE p_is_reversed BOOLEAN;
        DECLARE p_account_id CHAR(36);
        DECLARE p_related_account_id CHAR(36);
        DECLARE p_amount_base DECIMAL(19, 2);
        DECLARE p_reference_uuid CHAR(36);
        
        DECLARE CONTINUE HANDLER FOR NOT FOUND
          SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Transaction not found';
        DECLARE exit HANDLER FOR SQLEXCEPTION
        BEGIN
          ROLLBACK;
          RESIGNAL;
        END;

        START TRANSACTION;

          IF p_id IS NULL THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'The id cannot be NULL';
          END IF;

          
          SELECT 
            type,
            is_reversed,
            account_id,
            related_account_id,
            amount_base,
            reference_uuid
          INTO 
            p_type,
            p_is_reversed,
            p_account_id,
            p_related_account_id,
            p_amount_base,
            p_reference_uuid
          FROM transactions WHERE id = p_id;

          IF NOT p_is_reversed THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'The transaction is not reversed';
          END IF;

          IF p_type = 'TRANSFER' OR p_type = 'CREDIT_PAYMENT' OR p_type = 'CURRENCY_EXCHANGE' THEN

            UPDATE accounts
              SET balance = balance - p_amount_base -- remove the action of the transaction to the related account
              WHERE id = p_related_account_id;
            
            UPDATE transactions
              SET is_reversed = FALSE
              WHERE reference_uuid = p_reference_uuid AND id != p_id;

          END IF;

          UPDATE accounts
              SET balance = balance + p_amount_base -- remove the action of the transaction
              WHERE id = p_account_id;
          
          UPDATE transactions
            SET is_reversed = FALSE
            WHERE id = p_id;

        COMMIT;

        SELECT * FROM transactions
        WHERE id = p_id;
      END;
    `)

    await queryRunner.query(`/* SQL */
      CREATE PROCEDURE proc_delete_transaction(
        IN p_id CHAR(36)
      )
      BEGIN
        DECLARE p_type VARCHAR(50);
        DECLARE p_is_reversed BOOLEAN;
        DECLARE p_reference_uuid CHAR(36);

        DECLARE exit HANDLER FOR SQLEXCEPTION
        BEGIN
          ROLLBACK;
          RESIGNAL;
        END;

        START TRANSACTION;

          IF p_id IS NULL THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'The id cannot be NULL';
          END IF;

          
          SELECT 
            type,
            is_reversed,
            reference_uuid
          INTO 
            p_type,
            p_is_reversed,
            p_reference_uuid
          FROM transactions WHERE id = p_id;

          IF NOT p_is_reversed THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'The transaction should be reversed before deleting it';
          END IF;

          IF p_type = 'TRANSFER' OR p_type = 'CREDIT_PAYMENT' OR p_type = 'CURRENCY_EXCHANGE' THEN
            DELETE FROM transactions WHERE reference_uuid = p_reference_uuid AND id != p_id;
          END IF;

          DELETE FROM transactions WHERE id = p_id;
        COMMIT;
        SELECT TRUE as deleted;
      END;
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `/* SQL */  DROP PROCEDURE IF EXISTS proc_insert_transaction;`
    )
    await queryRunner.query(
      `/* SQL */  DROP PROCEDURE IF EXISTS proc_reverse_transaction;`
    )
    await queryRunner.query(
      `/* SQL */  DROP PROCEDURE IF EXISTS proc_delete_transaction;`
    )
  }
}
