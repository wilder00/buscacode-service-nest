import { Field, Float, InputType } from '@nestjs/graphql'
import { IsNotEmpty, IsOptional, Length, Min, MinLength } from 'class-validator'

@InputType()
export class AccountInput {
  @Field()
  @IsNotEmpty()
  @MinLength(2)
  name: string

  @Field({ nullable: true })
  @IsOptional()
  description?: string

  @Field(() => String)
  @IsNotEmpty()
  accountTypeCode: string

  @Field(() => String)
  @IsNotEmpty()
  @Length(3)
  currencyCode: string

  @Field(() => Float)
  @IsNotEmpty()
  @Min(0)
  balance: number
}
