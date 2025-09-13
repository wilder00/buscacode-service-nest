// src/database/seeders/development/users.seeder.ts
import { Credential } from '@/src/modules/authentication/register/entities/credential.entity'
import { User } from '@/src/modules/authorization/user/entities/user.entity'
import { hashPassword } from '@/src/tools/bcrypt.tool'
import { faker } from '@faker-js/faker'
import { DataSource, DeepPartial } from 'typeorm'

export const usersSeeder = async (dataSource: DataSource) => {
  const userRepo = dataSource.getRepository(User)
  const credentialRepo = dataSource.getRepository(Credential)
  const fakePass = await hashPassword('fakePass')

  for (let i = 0; i < 1000; i++) {
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

      const newCredential = new Credential()
      newCredential.email = faker.internet.email()
      newCredential.password = fakePass
      newCredential.user = user

      await credentialRepo.save(newCredential)
    } catch (error) {
      console.log('No se pudo crear usuario', (error as Error).message)
    }
  }
}
