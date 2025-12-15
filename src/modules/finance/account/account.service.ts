import type { Currency } from '@faker-js/faker'
import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { catchError, firstValueFrom, forkJoin, map, throwError } from 'rxjs'
import { Repository } from 'typeorm'
import { User } from '../../authorization/user/entities/user.entity'
import { CurrenciesService } from '../currencies/currencies.service'
import { TransactionService } from '../transaction/transaction.service'
import { AccountTypeService } from './account-type.service'
import { AccountDomain } from './account.domain'
import { AccountInput } from './dto/account.input'
import type { AccountType } from './entities/account-type.entity'
import { Account } from './entities/account.entity'

@Injectable()
export class AccountService {
  constructor(
    private accountDomain: AccountDomain,
    private accountTypeService: AccountTypeService,
    private currencyService: CurrenciesService,
    private transactionService: TransactionService,
    @InjectRepository(Account)
    private accountRepository: Repository<Account>
  ) {}

  async getAllMyAccounts(userId: string) {
    const accounts = await this.accountRepository.find({
      where: {
        user: {
          id: userId
        }
      },
      relations: {
        accountType: true,
        currency: true
      }
    })
    return accounts
  }

  async getMyAccountById(userId: string, accountId: string) {
    const account = await this.accountRepository.findOne({
      where: {
        id: accountId,
        user: {
          id: userId
        }
      },
      relations: {
        accountType: true,
        currency: true
      }
    })
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

    const partialAccount = this.accountRepository.create({
      name: accountInput.name,
      description: accountInput.description,
      accountType,
      currency,
      balance: accountInput.balance,
      user: owner
    })
    const newAccount = await this.accountRepository.save(partialAccount)

    return newAccount
  }

  async getMyRecentTransactions(userId: string, accountId: string) {
    const limit = this.accountDomain.getLimitOfTransactionToDisplay()
    const restrictionToFindBetween =
      this.accountDomain.getRangeOfDateTransactionToDisplay()
    const { data: transactions } =
      await this.transactionService.getAccountTransactionsByUserId(
        userId,
        accountId,
        {
          limit,
          page: 1
        },
        restrictionToFindBetween
      )

    return transactions
  }
}
