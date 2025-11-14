import { PaginatedResponseGenerator } from '@/src/common/entities/paginated-response'
import { ObjectType } from '@nestjs/graphql'
import { Transaction } from '../entities/transaction.entity'

@ObjectType()
export class PaginatedTransactionList extends PaginatedResponseGenerator(
  Transaction
) {}
