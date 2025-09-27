import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AccountTypeResolver } from './account-type.resolver'
import { AccountTypeService } from './account-type.service'
import { AccountType } from './entities/account-type.entity'

@Module({
  imports: [TypeOrmModule.forFeature([AccountType])],
  providers: [AccountTypeResolver, AccountTypeService]
})
export class AccountTypeModule {}
