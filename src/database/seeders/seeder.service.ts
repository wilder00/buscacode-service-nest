// src/database/seeder.service.ts
import { Injectable } from '@nestjs/common'
import { DataSource } from 'typeorm'

export type SeederFn = (dataSource: DataSource) => Promise<void>
@Injectable()
export class SeederService {
  constructor(private dataSource: DataSource) {}

  async run(seeders: ((dataSource: DataSource) => Promise<void>)[]) {
    for (const seeder of seeders) {
      await seeder(this.dataSource)
    }
  }
}
