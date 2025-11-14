import { Args, Query, Resolver } from '@nestjs/graphql'
import { AccountTypeService } from './account-type.service'
import { AccountType } from './entities/account-type.entity'

@Resolver(() => AccountType)
export class AccountTypeResolver {
  constructor(private readonly accountTypeService: AccountTypeService) {}

  @Query(() => [AccountType], { name: 'accountTypes' })
  findAll() {
    return this.accountTypeService.findAll()
  }

  @Query(() => AccountType, { name: 'accountType' })
  findOne(@Args('code', { type: () => String }) code: string) {
    return this.accountTypeService.findOne(code)
  }
}
