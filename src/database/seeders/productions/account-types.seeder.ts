// src/database/seeders/production/categories.seeder.ts
import { AccountType } from '@/src/modules/finance/account/entities/account-type.entity'
import { Logger } from '@nestjs/common'
import { DataSource, DeepPartial } from 'typeorm'

const logger = new Logger('AccountTypesSeeder')

export const accountTypesSeeder = async (
  dataSource: DataSource
): Promise<void> => {
  logger.log('Starting account types seeder')
  const accountTypeRepo = dataSource.getRepository(AccountType)

  const accountTypes: DeepPartial<AccountType>[] = [
    {
      code: 'wallet',
      name: 'Wallet',
      color: '#F59E0B',
      description: 'Cuentas relacionadas a billeteras digitales.',
      isActive: true
    },
    {
      code: 'credit',
      name: 'Crédito',
      color: '#EC4899',
      description: 'Cuentas de tarjeta de crédito',
      isActive: true
    },
    {
      code: 'cash',
      name: 'Efectivo',
      color: '#10B981',
      description: 'Cuentas de efectivo',
      isActive: true
    },
    {
      code: 'bank',
      name: 'Bancaria',
      color: '#F59E0B',
      description: 'Cuentas bancarias como los de ahorros.',
      isActive: true
    },
    {
      code: 'investment',
      name: 'Inversión',
      color: '#3B82F6',
      description: 'Cuentas de inversión de cualquier tipo.',
      isActive: true
    }
  ]

  await accountTypeRepo.save(accountTypes, { transaction: true })
  logger.log('Account types seeder finished')
}
