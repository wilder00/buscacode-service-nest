import { Module } from '@nestjs/common'
import { CashFlowCategoriesResolver } from './cash-flow-categories.resolver'
import { CashFlowCategoriesService } from './cash-flow-categories.service'

@Module({
  providers: [CashFlowCategoriesResolver, CashFlowCategoriesService]
})
export class CashFlowCategoriesModule {}
