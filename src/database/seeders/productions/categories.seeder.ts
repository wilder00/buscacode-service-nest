// src/database/seeders/production/categories.seeder.ts
import { DataSource } from 'typeorm'

export const categoriesSeeder = async (
  dataSource: DataSource
): Promise<void> => {
  console.log('Categories seeder')
  return await Promise.resolve()
  // const repo = dataSource.getRepository(CashFlowCategory)
  // const categories = [
  //   { name: 'Food' },
  //   { name: 'Transport' },
  //   { name: 'Health' }
  // ]
  // for (const cat of categories) {
  //   const exists = await repo.findOne({ where: { name: cat.name } })
  //   if (!exists) await repo.save(repo.create(cat))
  // }
}
