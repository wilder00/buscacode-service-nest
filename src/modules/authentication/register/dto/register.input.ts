import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class RegisterInput {
  @Field(() => String, { description: 'Email' })
  email: string

  @Field(() => String, { description: 'Password' })
  password: string

  @Field(() => String, { description: 'Name' })
  name: string

  @Field(() => String, { description: 'Last name' })
  lastName: string

  @Field(() => String, { description: 'Second last name' })
  secondLastName: string

  @Field(() => String, { description: 'Phone' })
  phone: string
}
