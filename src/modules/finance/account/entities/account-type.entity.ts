import { Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql'
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

  @Field(() => String)
  @Column({ name: 'color', default: '#10B981' })
  color: string

  @Field(() => Boolean)
  @Column({ name: 'is_active', default: true })
  isActive: boolean

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
