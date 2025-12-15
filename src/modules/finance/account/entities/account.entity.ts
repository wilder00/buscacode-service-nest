import { User } from '@/src/modules/authorization/user/entities/user.entity'
import { AccountType } from '@/src/modules/finance/account/entities/account-type.entity'
import { Currency } from '@/src/modules/finance/currencies/entities/currency.entity'
import { Field, Float, GraphQLISODateTime, ObjectType } from '@nestjs/graphql'
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm'
import { Transaction } from '../../transaction/entities/transaction.entity'

@ObjectType()
@Entity({ name: 'accounts' })
export class Account {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Field()
  @Column({ type: 'varchar', length: 255 })
  name: string

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 255, nullable: true })
  description?: string

  @Field()
  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean

  @Field(() => User)
  @ManyToOne(() => User, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'user_id' })
  user: User

  @Field(() => AccountType)
  @ManyToOne(() => AccountType, {
    onDelete: 'RESTRICT'
  })
  @JoinColumn({ name: 'account_type_code', referencedColumnName: 'code' })
  accountType: AccountType

  @Field(() => Currency)
  @ManyToOne(() => Currency, {
    onDelete: 'RESTRICT'
  })
  @JoinColumn({ name: 'currency_code', referencedColumnName: 'code' })
  currency: Currency

  @Field(() => Float)
  @Column('decimal', { precision: 19, scale: 4, default: 0 })
  balance: number

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

  @Field(() => [Transaction], { nullable: true })
  transactions: Transaction[]
}
