import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DeepPartial, Repository } from 'typeorm'
import { Account } from './entities/account.entity'

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private accountRepository: Repository<Account>
  ) {}

  async create(accountLike: DeepPartial<Account>) {
    const partialAccount = this.accountRepository.create(accountLike)
    const newAccount = await this.accountRepository.save(partialAccount)
    return newAccount
  }

  findAllByOwnerId(ownerId: string) {
    return this.accountRepository.find({
      where: {
        user: {
          id: ownerId
        }
      }
    })
  }

  findOne(id: string) {
    return this.accountRepository.findOneBy({ id })
  }
  findOwnOneById(ownerId: string, id: string) {
    return this.accountRepository.findOneBy({ id, user: { id: ownerId } })
  }
}
