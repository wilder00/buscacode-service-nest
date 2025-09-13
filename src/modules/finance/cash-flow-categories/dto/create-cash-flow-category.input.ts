import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateCashFlowCategoryInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
