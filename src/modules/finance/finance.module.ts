import { Module } from '@nestjs/common'
import { AccountTypeModule } from './account-type/account-type.module'
import { AccountModule } from './account/account.module'
import { CashFlowCategoriesModule } from './cash-flow-categories/cash-flow-categories.module'
import { CurrenciesModule } from './currencies/currencies.module'
@Module({
  imports: [
    CurrenciesModule,
    AccountTypeModule,
    CashFlowCategoriesModule,
    AccountModule
  ],
  controllers: [],
  providers: []
})
export class FinanceModule {}
