import { Field, Int, ObjectType } from '@nestjs/graphql'
import { PaginatorInput } from '../dto/paginator.input'

const MIN_PAGE = 1 as const

@ObjectType()
export class Paginator extends PaginatorInput {
  @Field(() => Int)
  total: number
  @Field(() => Int)
  totalPages: number
  @Field(() => Boolean)
  hasNextPage: boolean
  @Field(() => Boolean)
  hasPreviousPage: boolean
  @Field(() => Int)
  skip: number

  constructor(partial: Partial<Paginator>, total: number = 0) {
    super()
    Object.assign(this, partial)
    this.total = total
    this.totalPages = Math.max(Math.ceil(this.total / this.limit), MIN_PAGE)
    this.hasNextPage = this.page < this.totalPages
    this.hasPreviousPage = this.page > MIN_PAGE
    this.skip = (this.page - 1) * this.limit
  }
}
