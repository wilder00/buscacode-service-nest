import { Type } from '@nestjs/common'
import { Field, ObjectType } from '@nestjs/graphql'
import { Paginator } from './paginator.entity'

export function PaginatedResponseGenerator<T>(classRef: Type<T>) {
  @ObjectType({ isAbstract: true })
  abstract class PaginatedResponse {
    @Field(() => [classRef])
    data: T[]

    @Field(() => Paginator, {
      nullable: true
    })
    paginator: Paginator | null
  }

  return PaginatedResponse
}
