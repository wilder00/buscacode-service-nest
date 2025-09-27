import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AccountDomain } from './account.domain'
import { AccountResolver } from './account.resolver'
import { AccountService } from './account.service'
import { Account } from './entities/account.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Account])],
  providers: [AccountResolver, AccountService, AccountDomain],
  exports: [AccountDomain]
})
export class AccountModule {}
