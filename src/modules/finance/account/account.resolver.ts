import { Auth } from '@/src/modules/authentication/auth/decorators/auth.decorator'
import { GetUser } from '@/src/modules/authentication/auth/decorators/get-user.decorator'
import { User } from '@/src/modules/authorization/user/entities/user.entity'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { AccountDomain } from './account.domain'
import { AccountInput } from './dto/account.input'
import { Account } from './entities/account.entity'

@Resolver(() => Account)
@Auth()
export class AccountResolver {
  constructor(private readonly accountDomain: AccountDomain) {}

  @Mutation(() => Account)
  createAccount(
    @GetUser() owner: User,
    @Args('accountInput') accountInput: AccountInput
  ) {
    return this.accountDomain.create(owner, accountInput)
  }

  @Query(() => [Account], { name: 'accounts' })
  findAll(@GetUser() owner: User) {
    return this.accountDomain.getAllMyAccounts(owner.id)
  }
  @Query(() => Account, { name: 'account' })
  findOne(@GetUser() owner: User, @Args('id') id: string) {
    return this.accountDomain.getMyAccountById(owner.id, id)
  }
}
