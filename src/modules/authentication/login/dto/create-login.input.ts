import { Field, InputType } from '@nestjs/graphql'
import { IsEmail, IsNotEmpty } from 'class-validator'

@InputType()
export class LoginInput {
  @Field(() => String, { description: 'Email' })
  @IsEmail()
  email: string

  @Field(() => String, { description: 'Password' })
  @IsNotEmpty()
  password: string
}
