import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from '../../authentication/auth/auth.module'
import { Transaction } from './entities/transaction.entity'
import { TransactionDomain } from './transaction.domain'
import { TransactionResolver } from './transaction.resolver'
import { TransactionService } from './transaction.service'

@Module({
  imports: [TypeOrmModule.forFeature([Transaction]), AuthModule],
  providers: [TransactionResolver, TransactionService, TransactionDomain],
  exports: [TransactionService]
})
export class TransactionModule {}
