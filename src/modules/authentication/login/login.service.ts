import { Injectable } from '@nestjs/common'
import { LoginInput } from './dto/create-login.input'
import { Login } from './entities/login.entity'

@Injectable()
export class LoginService {
  login(loginInput: LoginInput) {
    const login: Login = {
      userId: loginInput.email,
      accessToken: loginInput.password,
      refreshToken: loginInput.password
    }

    return login
  }
}
