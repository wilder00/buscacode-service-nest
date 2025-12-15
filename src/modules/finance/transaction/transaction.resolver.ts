import { PaginatorInput } from '@/src/common/dto/paginator.input'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { Auth } from '../../authentication/auth/decorators/auth.decorator'
import { GetUser } from '../../authentication/auth/decorators/get-user.decorator'
import { User } from '../../authorization/user/entities/user.entity'
import { TransactionInput } from './dto/transaction.input'
import { PaginatedTransactionList } from './dto/transaction.output'
import { Transaction } from './entities/transaction.entity'
import { TransactionService } from './transaction.service'

@Resolver()
@Auth()
export class TransactionResolver {
  constructor(private readonly transactionService: TransactionService) {}

  @Query(() => PaginatedTransactionList, { name: 'accountTransactions' })
  accountTransactions(
    @GetUser() owner: User,
    @Args('accountId') accountId: string,
    @Args('paginator', { type: () => PaginatorInput, nullable: true })
    paginator?: PaginatorInput | null
  ) {
    return this.transactionService.getAccountTransactionsByUserId(
      owner.id,
      accountId,
      paginator
    )
  }

  @Query(() => Transaction, { name: 'transactionDetail' })
  transaction(
    @GetUser() owner: User,
    @Args('transactionId') transactionId: string
  ) {
    return this.transactionService.getTransactionByUserIdAndId(
      owner.id,
      transactionId
    )
  }

  @Mutation(() => Transaction)
  createTransaction(
    @GetUser() owner: User,
    @Args('transactionInput') transactionInput: TransactionInput
  ) {
    console.log(JSON.stringify(transactionInput, null, 2))
    return this.transactionService.createTransaction(owner, transactionInput)
  }
}
