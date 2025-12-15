import { PaginatorInput } from '@/src/common/dto/paginator.input'
import { Paginator } from '@/src/common/entities/paginator.entity'
import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DataSource, FindOperator, Repository } from 'typeorm'
import { User } from '../../authorization/user/entities/user.entity'
import { TransactionInput } from './dto/transaction.input'
import { PaginatedTransactionList } from './dto/transaction.output'
import { Transaction } from './entities/transaction.entity'

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    private dataSource: DataSource
  ) {}
  // async create(transactionLike: DeepPartial<Transaction>) {
  //   const queryRunner = this.dataSource.createQueryRunner()
  //   await queryRunner.connect()
  //   await queryRunner.startTransaction()
  //   let newTransaction: Transaction | null = null
  //   try {
  //     const transaction = this.transactionRepository.create(transactionLike)
  //     await queryRunner.manager.save(transaction)
  //     await queryRunner.commitTransaction()
  //     newTransaction = transaction
  //   } catch (err) {
  //     await queryRunner.rollbackTransaction()
  //     throw err
  //   } finally {
  //     await queryRunner.release()
  //   }
  //   return newTransaction
  // }

  // async getTransactionsByUserIdAndAccountId(
  //   userId: string,
  //   accountId: string,
  //   relations?: FindOptionsRelations<Transaction>
  // ) {
  //   return this.transactionRepository.find({
  //     relations,
  //     where: {
  //       account: {
  //         id: accountId
  //       },
  //       user: {
  //         id: userId
  //       }
  //     }
  //   })
  // }

  async createTransaction(owner: User, transactionInput: TransactionInput) {
    const {
      name,
      description,
      accountId,
      currencyCode,
      currencyCodeBase,
      type,
      amount,
      amountBase,
      exchangeRate,
      relatedAccountId,
      executedAt
    } = transactionInput

    const result = await this.dataSource.query<any[][]>(
      `CALL proc_insert_transaction(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        name,
        description || null,
        owner.id,
        accountId,
        currencyCode,
        currencyCodeBase,
        type,
        amount,
        amountBase,
        exchangeRate,
        relatedAccountId || null,
        executedAt
      ]
    )
    const transaction =
      (result?.[0]?.[0] as unknown as Transaction) || undefined

    if (!transaction) {
      throw new InternalServerErrorException('Transaction not created')
    }

    const newTransaction = await this.getTransactionByUserIdAndId(
      owner.id,
      transaction.id
    )

    return newTransaction
  }

  getTransactionByUserIdAndId(ownerId: string, transactionId: string) {
    return this.transactionRepository.findOne({
      where: {
        id: transactionId,
        user: {
          id: ownerId
        }
      },
      relations: {
        currency: true,
        currencyBase: true
      },
      order: {
        updatedAt: 'DESC'
      }
    })
  }

  async getAccountTransactionsByUserId(
    userId: string,
    accountId: string,
    paginatorInput: PaginatorInput | null = null,
    executedDate?: FindOperator<Date>
  ): Promise<PaginatedTransactionList> {
    const count = await this.transactionRepository.count({
      where: {
        account: {
          id: accountId
        },
        user: {
          id: userId
        }
      }
    })

    let paginator: Paginator | null = null
    if (paginatorInput) {
      paginator = new Paginator(paginatorInput, count)
    }

    const data = await this.transactionRepository.find({
      where: {
        account: {
          id: accountId
        },
        user: {
          id: userId
        },
        executedAt: executedDate
      },
      relations: {
        currency: true,
        currencyBase: true
      },
      order: {
        executedAt: 'DESC',
        updatedAt: 'DESC'
      },
      skip: paginator?.skip,
      take: paginator?.limit
    })

    return {
      data,
      paginator
    }
  }
}
