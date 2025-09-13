import { serviceErrorCodeMap } from '@/src/helpers/errors.helper'
import { hashPassword } from '@/src/tools/bcrypt.tool'
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DataSource, Repository } from 'typeorm'
import { User } from '../../authorization/user/entities/user.entity'
import { RegisterInput } from './dto/register.input'
import { Credential } from './entities/credential.entity'

@Injectable()
export class RegisterDomain {
  private logger = new Logger(RegisterDomain.name)
  constructor(
    @InjectRepository(Credential)
    private readonly credentialRepository: Repository<Credential>,
    private dataSource: DataSource
  ) {}

  async getCredentialByEmail(email: string) {
    const credential = await this.credentialRepository.findOne({
      where: { email },
      relations: { user: true }
    })
    return credential
  }

  async registerCredential(createRegisterInput: RegisterInput) {
    const {
      name,
      secondName,
      lastName,
      secondLastName,
      email,
      phone,
      password
    } = createRegisterInput
    const repeatedCredentialRequest = await this.credentialRepository.findOne({
      where: { email }
    })

    if (repeatedCredentialRequest !== null) {
      throw new BadRequestException(
        serviceErrorCodeMap.USER.USER_EMAIL_EXIST.message,
        serviceErrorCodeMap.USER.USER_EMAIL_EXIST.code
      )
    }

    // const userInput = new UserInput()
    // userInput.name = name
    // userInput.secondName = secondName
    // userInput.lastName = lastName
    // userInput.secondLastName = secondLastName
    // userInput.phone = phone
    // userInput.isActive = true

    const newUser = new User()
    newUser.name = name
    newUser.secondName = secondName
    newUser.lastName = lastName
    newUser.secondLastName = secondLastName
    newUser.phone = phone
    newUser.isActive = true

    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    let newCredential: Credential | null = null
    try {
      //const user = await this.userDomain.addNewUser(userInput)
      const user = await queryRunner.manager.save(newUser)
      const hashedPassword = await hashPassword(password)
      const credential = new Credential()
      credential.email = email
      credential.password = hashedPassword
      credential.user = user

      newCredential = await queryRunner.manager.save(credential)

      await queryRunner.commitTransaction()
      return newCredential
    } catch (e) {
      await queryRunner.rollbackTransaction()
      this.logger.error(e)
      throw new InternalServerErrorException(e)
    } finally {
      await queryRunner.release()
    }
  }
}
