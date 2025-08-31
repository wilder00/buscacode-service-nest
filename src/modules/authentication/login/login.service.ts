import { Injectable } from '@nestjs/common'
import { User } from '../../authorization/user/entities/user.entity'
import { LoginInput } from './dto/create-login.input'
import { Login } from './entities/login.entity'

@Injectable()
export class LoginService {
  login(loginInput: LoginInput) {
    const { email, password } = loginInput

    const login: Login = {
      userId: loginInput.email,
      accessToken: loginInput.password,
      refreshToken: loginInput.password,
      user: new User()
    }

    return login
  }
}
