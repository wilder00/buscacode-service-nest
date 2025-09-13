import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql'
import { CashFlowCategoriesService } from './cash-flow-categories.service'
import { CreateCashFlowCategoryInput } from './dto/create-cash-flow-category.input'
import { UpdateCashFlowCategoryInput } from './dto/update-cash-flow-category.input'
import { CashFlowCategory } from './entities/cash-flow-category.entity'

@Resolver(() => CashFlowCategory)
export class CashFlowCategoriesResolver {
  constructor(
    private readonly cashFlowCategoriesService: CashFlowCategoriesService
  ) {}

  @Mutation(() => CashFlowCategory)
  createCashFlowCategory(
    @Args('createCashFlowCategoryInput')
    createCashFlowCategoryInput: CreateCashFlowCategoryInput
  ) {
    return this.cashFlowCategoriesService.create(createCashFlowCategoryInput)
  }

  @Query(() => [CashFlowCategory], { name: 'cashFlowCategories' })
  findAll() {
    return this.cashFlowCategoriesService.findAll()
  }

  @Query(() => CashFlowCategory, { name: 'cashFlowCategory' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.cashFlowCategoriesService.findOne(id)
  }

  @Mutation(() => CashFlowCategory)
  updateCashFlowCategory(
    @Args('updateCashFlowCategoryInput')
    updateCashFlowCategoryInput: UpdateCashFlowCategoryInput
  ) {
    return this.cashFlowCategoriesService.update(
      updateCashFlowCategoryInput.id,
      updateCashFlowCategoryInput
    )
  }

  @Mutation(() => CashFlowCategory)
  removeCashFlowCategory(@Args('id', { type: () => Int }) id: number) {
    return this.cashFlowCategoriesService.remove(id)
  }
}
