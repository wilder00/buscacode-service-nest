import { Field, Int, ObjectType } from '@nestjs/graphql'
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm'

export enum ColorType {
  CLASS = 'CLASS',
  STYLE = 'STYLE'
}

@ObjectType()
@Entity('cash_flow_categories')
export class CashFlowCategory {
  @Field(() => Int, { description: 'ID' })
  @PrimaryGeneratedColumn()
  id: number

  @Field(() => String)
  @Column()
  name: string

  @Field(() => String)
  @Column()
  icon?: string

  @Field(() => String)
  @Column()
  color?: string

  @Field(() => Int, { defaultValue: 5, nullable: true })
  @Column({ name: 'sort', type: 'int', default: 5, nullable: true })
  sort?: number

  @Field(() => ColorType, { defaultValue: ColorType.STYLE })
  @Column({
    name: 'color_type',
    type: 'enum',
    default: ColorType.STYLE,
    enumName: 'ColorType',
    nullable: true
  })
  colorTypes?: ColorType

  @Field(() => Boolean, { defaultValue: true })
  @Column({ name: 'enabled', type: 'boolean', default: true })
  enabled: boolean

  @Field(() => Date)
  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP'
  })
  createdAt: Date

  @Field(() => Date)
  @Column({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP'
  })
  updatedAt: Date

  @ManyToOne(
    () => CashFlowCategory,
    (cashFlowCategory) => cashFlowCategory.categoryChildren,
    { onDelete: 'RESTRICT', nullable: true }
  )
  @Field(() => CashFlowCategory, { nullable: true })
  @JoinColumn({ name: 'category_father_id' })
  categoryFather?: CashFlowCategory

  @OneToMany(
    () => CashFlowCategory,
    (cashFlowCategory) => cashFlowCategory.categoryFather
  )
  @Field(() => [CashFlowCategory], { nullable: true })
  categoryChildren?: CashFlowCategory[] | null
}
