import { Field, ObjectType } from '@nestjs/graphql'
import { Column, Entity, PrimaryColumn } from 'typeorm'

@ObjectType()
@Entity('account_types')
export class AccountType {
  @Field(() => String, { description: 'A simple and brief code' })
  @PrimaryColumn()
  code: string

  @Field(() => String)
  @Column()
  name: string

  @Field(() => String)
  @Column()
  description: string

  @Field(() => Boolean)
  @Column({ name: 'is_active', default: true })
  isActive: boolean

  @Field(() => Date)
  @Column({ name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date

  @Field(() => Date)
  @Column({
    name: 'updated_at',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP'
  })
  updatedAt: Date
}
