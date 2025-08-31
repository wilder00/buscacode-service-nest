import { User } from '@/src/modules/authorization/user/entities/user.entity'
import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class Login {
  @Field(() => String, { description: 'User id' })
  userId: string

  @Field(() => String, { description: 'Token' })
  accessToken: string

  @Field(() => String, { description: 'Refresh token' })
  refreshToken: string

  @Field(() => User)
  user: User
}
