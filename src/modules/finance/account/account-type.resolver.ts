import { Args, Query, Resolver } from '@nestjs/graphql'
import { AccountTypeDomain } from './account-type.domain'
import { AccountType } from './entities/account-type.entity'

@Resolver(() => AccountType)
export class AccountTypeResolver {
  constructor(private readonly accountTypeDomain: AccountTypeDomain) {}

  @Query(() => [AccountType], { name: 'accountTypes' })
  findAll() {
    return this.accountTypeDomain.getAll()
  }

  @Query(() => AccountType, { name: 'accountType' })
  findOne(@Args('code', { type: () => String }) code: string) {
    return this.accountTypeDomain.getOne(code)
  }
}
