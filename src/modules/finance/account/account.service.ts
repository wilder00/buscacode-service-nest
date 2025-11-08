import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DeepPartial, FindOptionsRelations, Repository } from 'typeorm'
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

  findAllByOwnerId(ownerId: string, relations?: FindOptionsRelations<Account>) {
    return this.accountRepository.find({
      relations,
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
  findOwnOneById(
    ownerId: string,
    id: string,
    relations?: FindOptionsRelations<Account>
  ) {
    return this.accountRepository.findOne({
      relations,
      where: {
        id,
        user: {
          id: ownerId
        }
      }
    })
  }
}
