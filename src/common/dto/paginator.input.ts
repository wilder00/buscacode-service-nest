import { Field, InputType, Int, ObjectType } from '@nestjs/graphql'

@InputType()
@ObjectType()
export class PaginatorInput {
  @Field(() => Int)
  page: number
  @Field(() => Int)
  limit: number
}
