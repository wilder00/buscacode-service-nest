import { Field, InputType } from '@nestjs/graphql'
import { IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator'

@InputType()
export class RegisterInput {
  @Field(() => String, { description: 'Email' })
  @IsEmail()
  readonly email: string

  @Field(() => String, { description: 'Password' })
  @IsNotEmpty()
  readonly password: string

  @Field(() => String, { description: 'Name' })
  @IsNotEmpty()
  readonly name: string

  @Field(() => String, { description: 'Last name' })
  @IsNotEmpty()
  readonly lastName: string

  @Field(() => String, { description: 'Second last name', nullable: true })
  @MinLength(2)
  @IsOptional()
  readonly secondLastName?: string

  @Field(() => String, { description: 'Phone' })
  @IsNotEmpty()
  readonly phone: string
}
