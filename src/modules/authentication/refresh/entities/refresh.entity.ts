import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class Refresh {
  @Field(() => String, { description: 'Access token' })
  accessToken: string

  @Field(() => String, { description: 'Refresh token' })
  refreshToken: string

  @Field(() => String, { description: 'User ID' })
  userId: string
}
