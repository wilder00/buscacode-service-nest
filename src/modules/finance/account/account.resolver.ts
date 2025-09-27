import { Auth } from '@/src/modules/authentication/auth/decorators/auth.decorator'
import { GetUser } from '@/src/modules/authentication/auth/decorators/get-user.decorator'
import { User } from '@/src/modules/authorization/user/entities/user.entity'
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql'
import { AccountService } from './account.service'
import { CreateAccountInput } from './dto/create-account.input'
import { UpdateAccountInput } from './dto/update-account.input'
import { Account } from './entities/account.entity'

@Resolver(() => Account)
@Auth()
export class AccountResolver {
  constructor(private readonly accountService: AccountService) {}

  @Mutation(() => Account)
  createAccount(
    @Args('createAccountInput') createAccountInput: CreateAccountInput
  ) {
    return this.accountService.create(createAccountInput)
  }

  @Query(() => [Account], { name: 'accounts' })
  findAll(@GetUser() owner: User) {
    console.log(owner)
    return this.accountService.findAll(owner)
  }

  @Query(() => Account, { name: 'account' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.accountService.findOne(id)
  }

  @Mutation(() => Account)
  updateAccount(
    @Args('updateAccountInput') updateAccountInput: UpdateAccountInput
  ) {
    return this.accountService.update(updateAccountInput.id, updateAccountInput)
  }

  @Mutation(() => Account)
  removeAccount(@Args('id', { type: () => Int }) id: number) {
    return this.accountService.remove(id)
  }
}
