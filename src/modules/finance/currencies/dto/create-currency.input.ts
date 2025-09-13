import { Field, InputType, Int } from '@nestjs/graphql'

@InputType()
export class CreateCurrencyInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number
}
