import { Field, InputType, Int, PartialType } from '@nestjs/graphql'
import { CreateAccountTypeInput } from './create-account-type.input'

@InputType()
export class UpdateAccountTypeInput extends PartialType(
  CreateAccountTypeInput
) {
  @Field(() => Int)
  id: number
}
