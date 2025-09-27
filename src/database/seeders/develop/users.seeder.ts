// src/database/seeders/development/users.seeder.ts
import { Credential } from '@/src/modules/authentication/register/entities/credential.entity'
import { User } from '@/src/modules/authorization/user/entities/user.entity'
import { hashPassword } from '@/src/tools/bcrypt.tool'
import { faker } from '@faker-js/faker'
import { Logger } from '@nestjs/common'
import { DataSource, DeepPartial } from 'typeorm'

const logger = new Logger('UsersSeeder')

export const usersSeeder = async (dataSource: DataSource) => {
  logger.log('Starting users seeder')
  const userRepo = dataSource.getRepository(User)
  const credentialRepo = dataSource.getRepository(Credential)

  for (let i = 0; i < 100; i++) {
    try {
      const newUser: DeepPartial<User> = {
        name: faker.person.firstName(),
        lastName: faker.person.lastName(),
        isActive: faker.datatype.boolean(),
        phone: faker.number.int({ min: 900000000, max: 999999999 }).toString(),
        secondName: faker.person.firstName(),
        secondLastName: faker.person.lastName()
      }

      const user = await userRepo.save(userRepo.create(newUser))

      const fakePass = await hashPassword('fakePass')
      const newCredential = new Credential()
      newCredential.email = faker.internet.email().toLowerCase()
      newCredential.password = fakePass
      newCredential.user = user

      await credentialRepo.save(newCredential)
    } catch (error) {
      console.log('No se pudo crear usuario', (error as Error).message)
    }
  }
  logger.log('Users seeder finished')
}
