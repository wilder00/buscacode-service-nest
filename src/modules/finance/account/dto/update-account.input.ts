import { Field, InputType, Int, PartialType } from '@nestjs/graphql'
import { AccountInput } from './account.input'

@InputType()
export class UpdateAccountInput extends PartialType(AccountInput) {
  @Field(() => Int)
  id: number
}
