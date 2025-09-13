import { Injectable } from '@nestjs/common';
import { CreateCashFlowCategoryInput } from './dto/create-cash-flow-category.input';
import { UpdateCashFlowCategoryInput } from './dto/update-cash-flow-category.input';

@Injectable()
export class CashFlowCategoriesService {
  create(createCashFlowCategoryInput: CreateCashFlowCategoryInput) {
    return 'This action adds a new cashFlowCategory';
  }

  findAll() {
    return `This action returns all cashFlowCategories`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cashFlowCategory`;
  }

  update(id: number, updateCashFlowCategoryInput: UpdateCashFlowCategoryInput) {
    return `This action updates a #${id} cashFlowCategory`;
  }

  remove(id: number) {
    return `This action removes a #${id} cashFlowCategory`;
  }
}
