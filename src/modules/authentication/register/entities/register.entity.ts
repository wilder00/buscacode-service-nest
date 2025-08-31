import { Field, Int, ObjectType } from '@nestjs/graphql'
import { Entity, PrimaryGeneratedColumn } from 'typeorm'

@ObjectType()
@Entity()
export class Register {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number
}
