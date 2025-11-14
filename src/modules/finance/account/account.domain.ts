import { Injectable } from '@nestjs/common'

@Injectable()
export class AccountDomain {
  constructor() {}

  getLimitOfTransactionToDisplay() {
    const LIMIT_TRANSACTIONS = 15
    return LIMIT_TRANSACTIONS
  }
}
