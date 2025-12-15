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
        IN p_amount DECIMAL(19,4),
        IN p_amount_base DECIMAL(19,4),
        IN p_exchange_rate DECIMAL(19,8),
        IN p_related_account_id CHAR(36),
        IN p_executed_at TIMESTAMP
      )
      BEGIN
        DECLARE v_id CHAR(36);
        DECLARE v_pair_id CHAR(36);

        DECLARE EXIT HANDLER FOR SQLEXCEPTION
        BEGIN
          ROLLBACK;
          RESIGNAL;
        END;

        START TRANSACTION;

        -- 1. VALIDACIONES DE NULL
        IF p_name IS NULL 
        OR p_user_id IS NULL
        OR p_account_id IS NULL
        OR p_currency_code IS NULL
        OR p_currency_code_base IS NULL
        OR p_type IS NULL
        OR p_amount IS NULL
        OR p_amount_base IS NULL
        OR p_exchange_rate IS NULL
        THEN
          SIGNAL SQLSTATE '45000'
          SET MESSAGE_TEXT = 'Required parameter cannot be NULL';
        END IF;

        -- 2. BLOQUEAMOS LA CUENTA PRINCIPAL
        SELECT balance 
        FROM accounts 
        WHERE id = p_account_id 
        FOR UPDATE;

        -- 3. SI ES TRANSFER / FX / CREDIT: validamos related account
        IF p_type IN ('TRANSFER','CURRENCY_EXCHANGE','CREDIT_PAYMENT') THEN
          
          IF p_related_account_id IS NULL THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'related_account_id is required for this transaction type';
          END IF;

          -- bloquear cuenta relacionada
          SELECT balance 
          FROM accounts 
          WHERE id = p_related_account_id 
          FOR UPDATE;

          SET v_pair_id = UUID();
        ELSE
          SET v_pair_id = NULL;
        END IF;

        -- 4. ID PRINCIPAL
        SET v_id = UUID();

        -- 5. INSERT PRINCIPAL
        INSERT INTO transactions (
          id, name, description, user_id, account_id,
          currency_code, currency_code_base,
          type, amount, amount_base, exchange_rate,
          related_account_id, reference_uuid, executed_at
        )
        VALUES (
          v_id, p_name, p_description, p_user_id, p_account_id,
          p_currency_code, p_currency_code_base,
          p_type, p_amount, p_amount_base, p_exchange_rate,
          p_related_account_id, v_pair_id,
          COALESCE(p_executed_at, CURRENT_TIMESTAMP)
        );

        -- 6. ACTUALIZAR CUENTA PRINCIPAL
        UPDATE accounts
        SET balance = balance + p_amount_base
        WHERE id = p_account_id;

        -- 7. SI ES TRANSFERENCIA → INSERTAR PAREADO
        IF p_type IN ('TRANSFER','CURRENCY_EXCHANGE','CREDIT_PAYMENT') THEN
          
          INSERT INTO transactions (
            id, name, description, user_id, account_id,
            currency_code, currency_code_base,
            type, amount, amount_base, exchange_rate,
            related_account_id, reference_uuid, executed_at
          )
          VALUES (
            UUID(), p_name, p_description, p_user_id, p_related_account_id,
            p_currency_code, p_currency_code_base,
            p_type, 
            -p_amount, 
            -p_amount_base, 
            p_exchange_rate,
            p_account_id, v_pair_id,
            COALESCE(p_executed_at, CURRENT_TIMESTAMP)
          );

          UPDATE accounts
          SET balance = balance - p_amount_base
          WHERE id = p_related_account_id;

        END IF;

        COMMIT;

        SELECT * FROM transactions WHERE id = v_id;
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
      `/* SQL */  DROP PROCEDURE IF EXISTS proc_apply_transaction;`
    )
    await queryRunner.query(
      `/* SQL */  DROP PROCEDURE IF EXISTS proc_delete_transaction;`
    )
  }
}
