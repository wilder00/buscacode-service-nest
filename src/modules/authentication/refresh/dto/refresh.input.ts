import { Field, InputType } from '@nestjs/graphql'
import { IsJWT, IsNotEmpty } from 'class-validator'

@InputType()
export class RefreshInput {
  @Field(() => String, { description: 'Refresh token' })
  @IsJWT()
  @IsNotEmpty()
  refreshToken: string
}
