import { forwardRef, Module } from '@nestjs/common'

import { AuthModule } from '../authentication/auth/auth.module'
import { AccountModule } from './account/account.module'
import { CashFlowCategoriesModule } from './cash-flow-categories/cash-flow-categories.module'
import { CurrenciesModule } from './currencies/currencies.module'
@Module({
  imports: [
    forwardRef(() => CurrenciesModule),
    CashFlowCategoriesModule,
    AccountModule,
    AuthModule
  ],
  controllers: [],
  providers: []
})
export class FinanceModule {}
