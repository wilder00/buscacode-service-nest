import { Auth } from '@/src/modules/authentication/auth/decorators/auth.decorator'
import { GetUser } from '@/src/modules/authentication/auth/decorators/get-user.decorator'
import { User } from '@/src/modules/authorization/user/entities/user.entity'
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver
} from '@nestjs/graphql'
import { Transaction } from '../transaction/entities/transaction.entity'
import { AccountService } from './account.service'
import { AccountInput } from './dto/account.input'
import { Account } from './entities/account.entity'

@Resolver(() => Account)
@Auth()
export class AccountResolver {
  constructor(private readonly accountService: AccountService) {}

  @Mutation(() => Account)
  createAccount(
    @GetUser() owner: User,
    @Args('accountInput') accountInput: AccountInput
  ) {
    return this.accountService.create(owner, accountInput)
  }

  @Query(() => [Account], { name: 'accounts' })
  findAll(@GetUser() owner: User) {
    return this.accountService.getAllMyAccounts(owner.id)
  }

  @Query(() => Account, { name: 'account' })
  findOne(@GetUser() owner: User, @Args('id') id: string) {
    return this.accountService.getMyAccountById(owner.id, id)
  }

  @ResolveField(() => [Transaction], { name: 'transactions' })
  getAccountTransactions(@GetUser() owner: User, @Parent() account: Account) {
    return this.accountService.getMyRecentTransactions(owner.id, account.id)
  }
}
