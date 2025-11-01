import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Currency } from './entities/currency.entity'

@Injectable()
export class CurrenciesService {
  constructor(
    @InjectRepository(Currency)
    private currencyRepository: Repository<Currency>
  ) {}

  findAll() {
    return this.currencyRepository.find()
  }

  findById(code: string) {
    return this.currencyRepository.findOneBy({ code })
  }
}
