import { Field, InputType } from '@nestjs/graphql'
import { IsNotEmpty, IsOptional, MinLength } from 'class-validator'

@InputType()
export class UserInput {
  @Field(() => String)
  @IsNotEmpty()
  @MinLength(2)
  name: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  secondName?: string

  @Field(() => String)
  @IsNotEmpty()
  @MinLength(2)
  lastName: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  secondLastName?: string

  @Field(() => String)
  @IsNotEmpty()
  @MinLength(9)
  phone: string

  @Field(() => Boolean, { defaultValue: true })
  @IsOptional()
  isActive: boolean
}
