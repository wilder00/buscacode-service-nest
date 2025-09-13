import { Module } from '@nestjs/common'
import { CurrenciesResolver } from './currencies.resolver'
import { CurrenciesService } from './currencies.service'

@Module({
  providers: [CurrenciesResolver, CurrenciesService],
  imports: []
})
export class CurrenciesModule {}
