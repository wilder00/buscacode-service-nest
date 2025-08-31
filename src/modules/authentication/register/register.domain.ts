import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UserDomain } from '../../authorization/user/user.domain'
import { RegisterInput } from './dto/register.input'
import { Credential } from './entities/credential.entity'

@Injectable()
export class RegisterDomain {
  constructor(
    @InjectRepository(Credential)
    private readonly credentialRepository: Repository<Credential>,
    private readonly userDomain: UserDomain
  ) {}

  async getIsAllowedRegister(createRegisterInput: RegisterInput) {
    const { email, password, name, lastName, secondLastName, phone } =
      createRegisterInput
    const repeatedCredentialRequest = this.credentialRepository.findOne({
      where: { email }
    })
    const repeatedUserRequest = this.userDomain.getOneByPhone(phone)

    const [repeatedCredential, repeatedUser] = await Promise.all([
      repeatedCredentialRequest,
      repeatedUserRequest
    ])
    const hasRegister = repeatedCredentialRequest
    return !hasRegister
  }
}
