import { Module } from '@nestjs/common';
import { AccountTypeService } from './account-type.service';
import { AccountTypeResolver } from './account-type.resolver';

@Module({
  providers: [AccountTypeResolver, AccountTypeService],
})
export class AccountTypeModule {}
