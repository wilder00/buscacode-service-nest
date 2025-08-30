import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class LoginInput {
  @Field(() => String, { description: 'Email' })
  email: string

  @Field(() => String, { description: 'Password' })
  password: string
}
