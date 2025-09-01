import { serviceErrorCodeMap } from '@/src/helpers/errors.helper'
import { hashPassword } from '@/src/tools/bcrypt.tool'
import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DataSource, Repository } from 'typeorm'
import { UserInput } from '../../authorization/user/dto/user.input'
import { UserDomain } from '../../authorization/user/user.domain'
import { RegisterInput } from './dto/register.input'
import { Credential } from './entities/credential.entity'

@Injectable()
export class RegisterDomain {
  private logger = new Logger(RegisterDomain.name)
  constructor(
    @InjectRepository(Credential)
    private readonly credentialRepository: Repository<Credential>,
    @Inject(forwardRef(() => UserDomain))
    private readonly userDomain: UserDomain,
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
    const { name, lastName, secondLastName, email, phone, password } =
      createRegisterInput
    const repeatedCredentialRequest = await this.credentialRepository.findOne({
      where: { email }
    })

    if (repeatedCredentialRequest !== null) {
      throw new BadRequestException(
        serviceErrorCodeMap.USER.USER_EMAIL_EXIST.message,
        serviceErrorCodeMap.USER.USER_EMAIL_EXIST.code
      )
    }

    const userInput = new UserInput()
    userInput.name = name
    userInput.lastName = lastName
    userInput.secondLastName = secondLastName
    userInput.phone = phone
    userInput.isActive = true

    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    let error: Error | null = null
    let newCredential: Credential | null = null
    try {
      const user = await this.userDomain.addNewUser(userInput)
      const hashedPassword = await hashPassword(password)
      const credential = new Credential()
      credential.email = email
      credential.password = hashedPassword
      credential.user = user

      newCredential = await queryRunner.manager.save(credential)

      await queryRunner.commitTransaction()
    } catch (e) {
      await queryRunner.rollbackTransaction()
      error = new InternalServerErrorException(e)
    } finally {
      await queryRunner.release()
    }

    if (error !== null) throw error

    return newCredential
  }
}
