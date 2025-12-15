import { Injectable } from '@nestjs/common'
import { Between } from 'typeorm'

@Injectable()
export class AccountDomain {
  constructor() {}

  getLimitOfTransactionToDisplay() {
    const LIMIT_TRANSACTIONS = 15
    return LIMIT_TRANSACTIONS
  }
  getRangeOfDateTransactionToDisplay(date: Date = new Date()) {
    const year = date.getFullYear()
    const month = date.getMonth()

    const start = new Date(year, month, 1, 0, 0, 0, 0)
    const end = new Date(year, month + 1, 0, 23, 59, 59, 999)

    return Between(start, end)
  }
}
