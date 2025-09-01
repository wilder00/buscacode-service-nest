import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException
} from '@nestjs/common'
import { UserDomain } from '../../authorization/user/user.domain'
import { Login } from '../login/entities/login.entity'
import { LoginService } from '../login/login.service'
import { RegisterInput } from './dto/register.input'
import { RegisterDomain } from './register.domain'

@Injectable()
export class RegisterService {
  constructor(
    @Inject(forwardRef(() => LoginService))
    private readonly loginService: LoginService,
    private registerDomain: RegisterDomain,
    private readonly userDomain: UserDomain
  ) {}

  async create(createRegisterInput: RegisterInput): Promise<Login> {
    const credential =
      await this.registerDomain.registerCredential(createRegisterInput)

    if (credential === null) {
      throw new InternalServerErrorException()
    }

    const login = await this.loginService.generateLogin(credential)

    return login
  }
}
