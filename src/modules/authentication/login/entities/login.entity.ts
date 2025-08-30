import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class Login {
  @Field(() => String, { description: 'User id' })
  userId: string

  @Field(() => String, { description: 'Token' })
  accessToken: string

  @Field(() => String, { description: 'Refresh token' })
  refreshToken: string
}
