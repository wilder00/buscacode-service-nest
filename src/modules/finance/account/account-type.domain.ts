import { Injectable } from '@nestjs/common'
import { AccountTypeService } from './account-type.service'

@Injectable()
export class AccountTypeDomain {
  constructor(private accountTypeService: AccountTypeService) {}

  async getAll() {
    const accounts = await this.accountTypeService.findAll()
    return accounts
  }

  async getOne(code: string) {
    const account = await this.accountTypeService.findOne(code)
    return account
  }
}
