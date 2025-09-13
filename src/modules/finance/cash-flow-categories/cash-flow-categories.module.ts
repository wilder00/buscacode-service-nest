import { Module } from '@nestjs/common';
import { CashFlowCategoriesService } from './cash-flow-categories.service';
import { CashFlowCategoriesResolver } from './cash-flow-categories.resolver';

@Module({
  providers: [CashFlowCategoriesResolver, CashFlowCategoriesService],
})
export class CashFlowCategoriesModule {}
