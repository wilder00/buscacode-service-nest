import { Field, Float, GraphQLISODateTime, InputType } from '@nestjs/graphql'
import {
  IsNotEmpty,
  IsOptional,
  IsUUID,
  Length,
  Min,
  MinLength
} from 'class-validator'
import { TransactionType } from '../entities/transaction.entity'

@InputType()
export class TransactionInput {
  @Field()
  @IsNotEmpty()
  @MinLength(2)
  name: string

  @Field({ nullable: true })
  @IsOptional()
  description?: string

  @Field()
  @IsNotEmpty()
  @IsUUID()
  accountId: string

  @Field(() => String)
  @IsNotEmpty()
  @Length(3)
  currencyCode: string

  @Field(() => Float)
  @IsNotEmpty()
  amount: number

  @Field(() => TransactionType)
  @IsNotEmpty()
  type: TransactionType

  @Field(() => String)
  @IsNotEmpty()
  @Length(3)
  currencyCodeBase: string

  @Field(() => Float)
  @IsNotEmpty()
  amountBase: number

  @Field(() => Float)
  @IsNotEmpty()
  @Min(0)
  exchangeRate: number

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsUUID()
  relatedAccountId?: string

  @Field(() => GraphQLISODateTime, { nullable: true })
  @IsOptional()
  executedAt?: Date | null
}
