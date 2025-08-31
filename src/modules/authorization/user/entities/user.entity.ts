import { Credential } from '@/src/modules/authentication/register/entities/credential.entity'
import { Field, ObjectType } from '@nestjs/graphql'
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'

@Entity()
@ObjectType()
export class User {
  @Field(() => String, { description: 'Id is an uuid' })
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Field(() => String)
  @Column()
  name: string

  @Field(() => String)
  @Column({ name: 'last_name' })
  lastName: string

  @Field(() => String, { nullable: true })
  @Column({ name: 'second_last_name', nullable: true })
  secondLastName?: string

  @Field(() => String)
  @Column()
  phone: string

  @Field(() => Boolean)
  @Column({ name: 'is_active', default: true })
  isActive: boolean

  @Field(() => Date)
  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date

  @Field(() => Date)
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date

  @OneToOne(() => Credential, (credential) => credential.user)
  credential: Credential
}
