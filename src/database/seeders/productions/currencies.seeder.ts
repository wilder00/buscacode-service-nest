// src/database/seeders/production/categories.seeder.ts
import { Currency } from '@/src/modules/finance/currencies/entities/currency.entity'
import { Logger } from '@nestjs/common'
import { DataSource, DeepPartial } from 'typeorm'

const logger = new Logger('CurrenciesSeeder')

export const currenciesSeeder = async (
  dataSource: DataSource
): Promise<void> => {
  logger.log('Starting currencies seeder')
  const currencyRepo = dataSource.getRepository(Currency)

  const currencies: DeepPartial<Currency>[] = [
    {
      code: 'USD',
      numericCode: '840',
      name: 'Dólar',
      symbol: 'US$',
      decimals: 2,
      isActive: true
    },
    {
      code: 'PEN',
      numericCode: '604',
      name: 'Nuevo Sol',
      symbol: 'S/',
      decimals: 2,
      isActive: true
    },
    {
      code: 'EUR',
      numericCode: '978',
      name: 'Euro',
      symbol: '€',
      decimals: 2,
      isActive: true
    },
    {
      code: 'GBP',
      numericCode: '826',
      name: 'Libra Esterlina',
      symbol: '£',
      decimals: 2,
      isActive: true
    },
    {
      code: 'JPY',
      numericCode: '392',
      name: 'Yen',
      symbol: '¥',
      decimals: 0,
      isActive: true
    },
    {
      code: 'KRW',
      numericCode: '410',
      name: 'Won',
      symbol: '₩',
      decimals: 0,
      isActive: true
    }
  ]

  await currencyRepo.save(currencies, { transaction: true })
  logger.log('Currencies seeder finished')
}
