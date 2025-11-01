import { AuthModule } from '@/src/modules/authentication/auth/auth.module'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CurrenciesModule } from '../currencies/currencies.module'
import { AccountTypeDomain } from './account-type.domain'
import { AccountTypeResolver } from './account-type.resolver'
import { AccountTypeService } from './account-type.service'
import { AccountDomain } from './account.domain'
import { AccountResolver } from './account.resolver'
import { AccountService } from './account.service'
import { AccountType } from './entities/account-type.entity'
import { Account } from './entities/account.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([Account, AccountType]),
    AuthModule,
    CurrenciesModule
  ],
  providers: [
    AccountResolver,
    AccountService,
    AccountDomain,
    AccountTypeResolver,
    AccountTypeDomain,
    AccountTypeService
  ],
  exports: [AccountDomain, AccountService, AccountTypeService]
})
export class AccountModule {}
