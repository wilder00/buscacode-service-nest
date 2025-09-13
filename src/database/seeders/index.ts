// src/database/seed.ts
import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import * as developSeeders from './develop'
import * as productionSeeders from './productions'
import { SeederModule } from './seeder.module'
import { SeederFn, SeederService } from './seeder.service'

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(SeederModule)
  const seeder = app.get(SeederService)
  const logger = new Logger('Seeder')
  const env = process.env.NODE_ENV || 'production'

  const seederName = process.argv[2]
  if (!seederName) {
    throw new Error('Seeder name is required')
  }

  const seederNameList = seederName.split(',')

  let moduleName: string[] = []
  const productionSeeds = seederNameList
    .map((seederName): [string, SeederFn] => {
      const seederModuleName = `${seederName}Seeder`
      return [
        seederModuleName,
        (productionSeeders as Record<string, SeederFn>)[seederModuleName]
      ]
    })
    .filter(([name, seeder]) => {
      const hasSeeder = seeder !== undefined
      if (!hasSeeder) {
        return false
      }
      moduleName.push(name)
      return hasSeeder
    })
    .map(([, seeder]) => seeder)

  logger.verbose('Production seeders | starting: ' + moduleName.join(', '))
  await seeder.run(productionSeeds)

  if (env === 'development') {
    moduleName = []
    const developSeeds = seederNameList
      .map((seederName): [string, SeederFn] => {
        const seederModuleName = `${seederName}Seeder`
        return [
          seederModuleName,
          (developSeeders as Record<string, SeederFn>)[seederModuleName]
        ]
      })
      .filter(([name, seeder]) => {
        const hasSeeder = seeder !== undefined
        if (!hasSeeder) {
          return false
        }
        moduleName.push(name)
        return hasSeeder
      })
      .map(([, seeder]) => seeder)
    logger.verbose('Develop seeders | starting: ' + moduleName.join(', '))
    await seeder.run(developSeeds)
  }

  await app.close()
}

void bootstrap()
