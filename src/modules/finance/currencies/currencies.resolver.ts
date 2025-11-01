import { Args, Query, Resolver } from '@nestjs/graphql'
import { Auth } from '../../authentication/auth/decorators/auth.decorator'
import { CurrenciesDomain } from './currencies.domain'
import { Currency } from './entities/currency.entity'

@Resolver(() => Currency)
@Auth()
export class CurrenciesResolver {
  constructor(private readonly currenciesDomain: CurrenciesDomain) {}

  @Query(() => [Currency], { name: 'currencies' })
  findAll() {
    return this.currenciesDomain.getAll()
  }

  @Query(() => Currency, { name: 'currency' })
  findOne(@Args('symbol', { type: () => String }) symbol: string) {
    return this.currenciesDomain.getOne(symbol)
  }
}
