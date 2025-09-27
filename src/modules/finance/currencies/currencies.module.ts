import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CurrenciesResolver } from './currencies.resolver'
import { CurrenciesService } from './currencies.service'
import { Currency } from './entities/currency.entity'

@Module({
  providers: [CurrenciesResolver, CurrenciesService],
  imports: [TypeOrmModule.forFeature([Currency])]
})
export class CurrenciesModule {}
