import { CreateAccountTypeInput } from './create-account-type.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateAccountTypeInput extends PartialType(CreateAccountTypeInput) {
  @Field(() => Int)
  id: number;
}
