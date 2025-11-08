import { User } from '@/src/modules/authorization/user/entities/user.entity'
import { AccountType } from '@/src/modules/finance/account/entities/account-type.entity'
import { Currency } from '@/src/modules/finance/currencies/entities/currency.entity'
import { Field, Float, ObjectType } from '@nestjs/graphql'
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'

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
  @Column('decimal', { precision: 19, scale: 2, default: 0 })
  balance: number

  @Field(() => String)
  @CreateDateColumn({
    name: 'created_at'
  })
  createdAt: Date

  @Field(() => String)
  @UpdateDateColumn({
    name: 'updated_at'
  })
  updatedAt: Date
}
