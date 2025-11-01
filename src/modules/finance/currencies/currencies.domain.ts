import { Injectable } from '@nestjs/common'
import { CurrenciesService } from './currencies.service'

@Injectable()
export class CurrenciesDomain {
  constructor(private currenciesService: CurrenciesService) {}

  getAll() {
    return this.currenciesService.findAll()
  }

  getOne(codeSymbol: string) {
    return this.currenciesService.findById(codeSymbol)
  }
}
