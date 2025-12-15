import { cookeys } from '@/src/helpers/constants'
import { serviceErrorCodeMap } from '@/src/helpers/errors.helper'
import { comparePassword } from '@/src/tools/bcrypt.tool'
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import type { Response } from 'express'
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

  async validateCredential(email: string, password: string) {
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

    return credential
  }

  async validateCredentialByEmailAndId(email: string, id: string) {
    const credential = await this.registerDomain.getCredentialByEmail(email)

    if (credential === null) {
      throw new UnauthorizedException(
        serviceErrorCodeMap.AUTH.AUTH_REFRESH_TOKEN_INVALID.message,
        serviceErrorCodeMap.AUTH.AUTH_REFRESH_TOKEN_INVALID.code
      )
    }

    const isIdValid = credential?.user?.id === id

    if (!isIdValid) {
      throw new UnauthorizedException(
        serviceErrorCodeMap.AUTH.AUTH_INVALID_CREDENTIALS.message,
        serviceErrorCodeMap.AUTH.AUTH_INVALID_CREDENTIALS.code
      )
    }

    return credential
  }

  generateAccessToken(userId: string, email: string) {
    const payload: JwtPayload = {
      sub: userId,
      email: email,
      type: 'access'
    }

    return this.jwtService.sign(payload)
  }

  generateRefreshToken(userId: string, email: string) {
    const payload: JwtPayload = {
      sub: userId,
      email: email,
      type: 'refresh'
    }
    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN')
    })
  }

  setCookie(res: Response, name: string, value: string, maxAge?: number) {
    const isProduction = this.configService.get('NODE_ENV') === 'production'

    res.cookie(name, value, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      domain: isProduction
        ? this.configService.get('COOKIE_DOMAIN')
        : undefined,
      signed: true,
      maxAge: maxAge ?? 24 * 60 * 60 * 1000 // 7 days
    })
  }

  setRefreshTokenCookie(res: Response, refreshToken: string) {
    const time = 7 * 24 * 60 * 60 * 1000
    this.setCookie(res, cookeys.REFRESH_TOKEN, refreshToken, time)
  }

  setAccessTokenCookie(res: Response, accessToken: string) {
    const time = 1 * 24 * 60 * 60 * 1000
    this.setCookie(res, cookeys.ACCESS_TOKEN, accessToken, time)
  }

  clearRefreshTokenCookie(res: Response) {
    res.clearCookie(cookeys.REFRESH_TOKEN)
  }

  generateLogin(credential: Credential) {
    if (!credential.isActive || !credential.user.isActive) {
      throw new UnauthorizedException(
        serviceErrorCodeMap.AUTH.AUTH_USER_INACTIVE.message,
        serviceErrorCodeMap.AUTH.AUTH_USER_INACTIVE.code
      )
    }

    const accessToken = this.generateAccessToken(
      credential.user.id,
      credential.email
    )
    const refreshAccessToken = this.generateRefreshToken(
      credential.user.id,
      credential.email
    )

    const user = credential.user
    user.credential = credential

    const login = new Login()
    login.userId = user.id
    login.accessToken = accessToken
    // TODO: set the refresh token in the cookie
    login.refreshToken = refreshAccessToken
    login.user = user

    return login
  }

  async login(loginInput: LoginInput) {
    const credential = await this.validateCredential(
      loginInput.email,
      loginInput.password
    )
    const login = this.generateLogin(credential)
    return login
  }
}
