import { CreateCashFlowCategoryInput } from './create-cash-flow-category.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateCashFlowCategoryInput extends PartialType(CreateCashFlowCategoryInput) {
  @Field(() => Int)
  id: number;
}
