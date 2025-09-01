import { serviceErrorCodeMap } from '@/src/helpers/errors.helper'
import { comparePassword } from '@/src/tools/bcrypt.tool'
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { JwtPayload } from '../auth/interfaces/jwt.interface'
import { Credential } from '../register/entities/credential.entity'
import { RegisterDomain } from '../register/register.domain'
import { LoginInput } from './dto/create-login.input'
import { Login } from './entities/login.entity'

@Injectable()
export class LoginService {
  private readonly logger = new Logger(LoginService.name)

  constructor(
    private readonly registerDomain: RegisterDomain,
    private jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async generateLogin(credential: Credential) {
    if (!credential.isActive || !credential.user.isActive) {
      throw new UnauthorizedException(
        serviceErrorCodeMap.AUTH.AUTH_USER_INACTIVE.message,
        serviceErrorCodeMap.AUTH.AUTH_USER_INACTIVE.code
      )
    }

    const payload: JwtPayload = {
      sub: credential.user.id,
      email: credential.email
    }

    const accessToken = await this.jwtService.signAsync(payload)
    const refreshAccessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN')
    })

    const user = credential.user
    user.credential = credential

    const login = new Login()
    login.userId = user.id
    login.accessToken = accessToken
    login.refreshToken = refreshAccessToken
    login.user = user

    return login
  }

  async login(loginInput: LoginInput) {
    const { email, password } = loginInput
    const credential = await this.registerDomain.getCredentialByEmail(email)

    if (credential === null) {
      throw new UnauthorizedException(
        serviceErrorCodeMap.AUTH.AUTH_INVALID_CREDENTIALS.message,
        serviceErrorCodeMap.AUTH.AUTH_INVALID_CREDENTIALS.code
      )
    }

    const isPasswordValid = await comparePassword(password, credential.password)

    if (!isPasswordValid) {
      throw new UnauthorizedException(
        serviceErrorCodeMap.AUTH.AUTH_INVALID_CREDENTIALS.message,
        serviceErrorCodeMap.AUTH.AUTH_INVALID_CREDENTIALS.code
      )
    }

    const login = await this.generateLogin(credential)
    return login
  }
}
