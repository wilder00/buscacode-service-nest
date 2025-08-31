import { User } from '@/src/modules/authorization/user/entities/user.entity'
import { Field, Int, ObjectType } from '@nestjs/graphql'
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn
} from 'typeorm'

@ObjectType()
@Entity()
export class Credential {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number

  @Field(() => String)
  @Column()
  email: string

  @Column()
  password: string

  @Field(() => User)
  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User
}
