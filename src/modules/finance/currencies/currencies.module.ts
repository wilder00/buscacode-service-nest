import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from '../../authentication/auth/auth.module'
import { CurrenciesDomain } from './currencies.domain'
import { CurrenciesResolver } from './currencies.resolver'
import { CurrenciesService } from './currencies.service'
import { Currency } from './entities/currency.entity'

@Module({
  providers: [CurrenciesResolver, CurrenciesService, CurrenciesDomain],
  imports: [TypeOrmModule.forFeature([Currency]), AuthModule],
  exports: [CurrenciesService]
})
export class CurrenciesModule {}
