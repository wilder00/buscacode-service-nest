import { Account } from '@/src/modules/finance/account/entities/account.entity'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

@Injectable()
export class AccountDomain {
  constructor(
    @InjectRepository(Account)
    private accountRepository: Repository<Account>
  ) {}

  async getAllMyAccounts(userId: string) {
    const accounts = await this.accountRepository.find({
      where: {
        user: {
          id: userId
        }
      }
    })
    return accounts
  }
}
