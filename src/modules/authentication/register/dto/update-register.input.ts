import { Field, InputType, Int, PartialType } from '@nestjs/graphql'
import { RegisterInput } from './register.input'

@InputType()
export class UpdateRegisterInput extends PartialType(RegisterInput) {
  @Field(() => Int)
  id: number
}
