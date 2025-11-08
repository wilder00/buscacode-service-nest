import { Field, Int, ObjectType } from '@nestjs/graphql'
import { Column, Entity, PrimaryColumn } from 'typeorm'

@ObjectType()
@Entity('currencies')
export class Currency {
  @Field(() => String, { description: 'ISO 4217 alpha code (ej. USD, PEN)s' })
  @PrimaryColumn()
  code: string

  @Field(() => String, { description: 'ISO 4217 numeric (ej. "840", "604")' })
  @Column({ name: 'numeric_code' })
  numericCode: string

  @Field(() => String)
  @Column()
  name: string

  @Field(() => String)
  @Column()
  symbol: string

  @Field(() => Int, {
    description:
      'Number of decimals to show for example 2 for PEN and 0 for JPY'
  })
  @Column()
  decimals: number

  @Field(() => Boolean)
  @Column({ name: 'is_active', default: true })
  isActive: boolean

  @Field(() => String)
  @Column({ name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date

  @Field(() => String)
  @Column({
    name: 'updated_at',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP'
  })
  updatedAt: Date
}
