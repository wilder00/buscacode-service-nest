import type { Currency } from '@faker-js/faker'
import { BadRequestException, Injectable } from '@nestjs/common'
import { catchError, firstValueFrom, forkJoin, map, throwError } from 'rxjs'
import { User } from '../../authorization/user/entities/user.entity'
import { CurrenciesService } from '../currencies/currencies.service'
import { AccountTypeService } from './account-type.service'
import { AccountService } from './account.service'
import { AccountInput } from './dto/account.input'
import type { AccountType } from './entities/account-type.entity'

@Injectable()
export class AccountDomain {
  constructor(
    private accountService: AccountService,
    private accountTypeService: AccountTypeService,
    private currencyService: CurrenciesService
  ) {}

  async getAllMyAccounts(userId: string) {
    const accounts = await this.accountService.findAllByOwnerId(userId, {
      accountType: true,
      currency: true
    })
    return accounts
  }

  async getMyAccountById(userId: string, accountId: string) {
    const account = await this.accountService.findOwnOneById(
      userId,
      accountId,
      {
        accountType: true,
        currency: true
      }
    )
    if (!account) throw new BadRequestException('Account not found')
    return account
  }

  async create(owner: User, accountInput: AccountInput) {
    const accountType$ = this.accountTypeService.findOne(
      accountInput.accountTypeCode
    )
    const currency$ = this.currencyService.findById(accountInput.currencyCode)

    const [accountType, currency] = await firstValueFrom(
      forkJoin([accountType$, currency$]).pipe(
        map(([type, curr]) => {
          if (!type) throw new BadRequestException('Account type not found')
          if (!curr) throw new BadRequestException('Currency not found')
          return [type, curr] as [AccountType, Currency]
        }),
        catchError((err: BadRequestException) => throwError(() => err))
      )
    )

    const newAccount = await this.accountService.create({
      name: accountInput.name,
      description: accountInput.description,
      accountType,
      currency,
      balance: accountInput.balance,
      user: owner
    })

    return newAccount
  }
}
