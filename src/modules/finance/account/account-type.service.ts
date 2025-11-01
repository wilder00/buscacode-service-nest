import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { AccountType } from './entities/account-type.entity'

@Injectable()
export class AccountTypeService {
  constructor(
    @InjectRepository(AccountType)
    private accountTypeRepository: Repository<AccountType>
  ) {}

  async findAll() {
    return this.accountTypeRepository.find()
  }

  async findOne(idCode: string) {
    return this.accountTypeRepository.findOneBy({ code: idCode })
  }
}
