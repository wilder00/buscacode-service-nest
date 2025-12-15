import { User } from '@/src/modules/authorization/user/entities/user.entity'
import {
  Field,
  Float,
  GraphQLISODateTime,
  ObjectType,
  registerEnumType
} from '@nestjs/graphql'
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId
} from 'typeorm'
import { Account } from '../../account/entities/account.entity'
import { Currency } from '../../currencies/entities/currency.entity'

export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
  BALANCE = 'BALANCE',
  TRANSFER = 'TRANSFER',
  CURRENCY_EXCHANGE = 'CURRENCY_EXCHANGE',
  CREDIT_PAYMENT = 'CREDIT_PAYMENT'
}

registerEnumType(TransactionType, {
  name: 'TransactionType'
})

@ObjectType()
@Entity('transactions')
export class Transaction {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id: string

  // Basic info
  @Field()
  @Column({ type: 'varchar', length: 100 })
  name: string

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 255, nullable: true })
  description?: string

  // Reverse flag
  @Field()
  @Column({
    name: 'is_reversed',
    type: 'boolean',
    default: false,
    comment:
      'It allow us to omit and modify it when its TRUE, but it should be modified if it is FALSE'
  })
  isReversed: boolean

  // Relations
  @Field(() => User)
  @ManyToOne(() => User, {
    onDelete: 'RESTRICT'
  })
  @JoinColumn({ name: 'user_id' })
  user: User

  @RelationId((t: Transaction) => t.user)
  userId: string

  @Field(() => Account)
  @ManyToOne(() => Account, {
    onDelete: 'RESTRICT'
  })
  @JoinColumn({ name: 'account_id' })
  account: Account

  @RelationId((t: Transaction) => t.account)
  accountId: string

  // Related account for transfer/exchange
  @Field(() => Account, { nullable: true })
  @ManyToOne(() => Account, {
    nullable: true,
    onDelete: 'SET NULL'
  })
  @JoinColumn({ name: 'related_account_id' })
  relatedAccount?: Account

  // Currency relations
  @Field(() => Currency)
  @ManyToOne(() => Currency, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'currency_code', referencedColumnName: 'code' })
  currency: Currency

  @Field(() => Currency)
  @ManyToOne(() => Currency, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'currency_code_base', referencedColumnName: 'code' })
  currencyBase: Currency

  // Financial fields
  @Field(() => Float)
  @Column({ type: 'decimal', precision: 19, scale: 4 })
  amount: number

  @Field(() => TransactionType)
  @Column({
    type: 'enum',
    enum: TransactionType
  })
  type: TransactionType

  @Field(() => Float)
  @Column({
    name: 'amount_base',
    type: 'decimal',
    precision: 19,
    scale: 4,
    comment: 'The amount_base is in the account currency value'
  })
  amountBase: number

  @Field(() => Float)
  @Column({
    name: 'exchange_rate',
    type: 'decimal',
    precision: 19,
    scale: 8,
    comment: 'Is the factor to convert the amount to amount_base'
  })
  exchangeRate: number

  // Reference to another transaction
  @Field({ nullable: true })
  @Column({
    name: 'reference_uuid',
    type: 'char',
    length: 36,
    nullable: true,
    comment:
      'The uuid of the reference to the transaction between our accounts. Both transaction should have the same reference_uuid'
  })
  referenceUuid?: string

  @Field(() => GraphQLISODateTime)
  @Column({
    name: 'executed_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP'
  })
  executedAt: Date

  // Timestamps
  @Field(() => GraphQLISODateTime)
  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP'
  })
  createdAt: Date

  @Field(() => GraphQLISODateTime)
  @Column({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP'
  })
  updatedAt: Date
}
