import { Injectable } from '@nestjs/common'
import { LoginService } from '../login/login.service'
import { RegisterInput } from './dto/register.input'

@Injectable()
export class RegisterService {
  constructor(private readonly loginService: LoginService) {}

  create(createRegisterInput: RegisterInput) {
    const { email, password, name, lastName, secondLastName, phone } =
      createRegisterInput

    return this.loginService.login(createRegisterInput)
  }
}
