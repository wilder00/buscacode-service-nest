import { User } from '@/src/modules/authorization/user/entities/user.entity'
import { Injectable } from '@nestjs/common'
import { AccountDomain } from './account.domain'
import { CreateAccountInput } from './dto/create-account.input'
import { UpdateAccountInput } from './dto/update-account.input'

@Injectable()
export class AccountService {
  constructor(private readonly accountDomain: AccountDomain) {}
  create(createAccountInput: CreateAccountInput) {
    return 'This action adds a new account'
  }

  findAll(owner: User) {
    return this.accountDomain.getAllMyAccounts(owner.id)
  }

  findOne(id: number) {
    return `This action returns a #${id} account`
  }

  update(id: number, updateAccountInput: UpdateAccountInput) {
    return `This action updates a #${id} account`
  }

  remove(id: number) {
    return `This action removes a #${id} account`
  }
}
