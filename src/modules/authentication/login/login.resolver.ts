import { cookeys } from '@/src/helpers/constants'
import { serviceErrorCodeMap } from '@/src/helpers/errors.helper'
import { Logger, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql'
import { JwtService } from '@nestjs/jwt'
import type { Request, Response } from 'express'
import { JwtPayload } from '../auth/interfaces/jwt.interface'
import { LoginInput } from './dto/create-login.input'
import { Login } from './entities/login.entity'
import { LoginService } from './login.service'

@Resolver(() => Login)
export class LoginResolver {
  logger = new Logger(LoginResolver.name)

  constructor(
    private readonly loginService: LoginService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  @Query(() => String)
  check() {
    return 'good'
  }

  @Mutation(() => Login)
  async login(
    @Args('LoginInput') loginInput: LoginInput,
    @Context() context: { req: Request; res: Response }
  ) {
    const credential = await this.loginService.validateCredential(
      loginInput.email,
      loginInput.password
    )

    const accessToken = this.loginService.generateAccessToken(
      credential.user.id,
      credential.email
    )

    const refreshToken = this.loginService.generateRefreshToken(
      credential.user.id,
      credential.email
    )
    this.loginService.setRefreshTokenCookie(context.res, refreshToken)
    this.loginService.setAccessTokenCookie(context.res, accessToken)

    const user = credential.user
    user.credential = credential

    const login = new Login()
    login.accessToken = accessToken
    login.refreshToken = ''
    login.user = user
    login.userId = credential.user.id

    return login
  }

  @Mutation(() => Login)
  async refreshToken(@Context() context: { req: Request; res: Response }) {
    // Get refresh token from httpOnly cookie
    const refreshToken = context.req.signedCookies?.[
      cookeys.REFRESH_TOKEN
    ] as string

    if (!refreshToken) {
      throw new UnauthorizedException(
        serviceErrorCodeMap.AUTH.AUTH_REFRESH_TOKEN_INVALID.message,
        serviceErrorCodeMap.AUTH.AUTH_REFRESH_TOKEN_INVALID.code
      )
    }

    try {
      // Verify refresh token
      const payload = this.jwtService.verify<JwtPayload>(refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET')
      })

      if (payload.type !== 'refresh') {
        throw new UnauthorizedException(
          serviceErrorCodeMap.AUTH.AUTH_TOKEN_INVALID_TYPE.message,
          serviceErrorCodeMap.AUTH.AUTH_TOKEN_INVALID_TYPE.code
        )
      }

      // Generate new access token
      const newAccessToken = this.loginService.generateAccessToken(
        payload.sub,
        payload.email
      )

      // Optional: Rotate refresh token (more secure)
      const newRefreshToken = this.loginService.generateRefreshToken(
        payload.sub,
        payload.email
      )

      const credential = await this.loginService.validateCredentialByEmailAndId(
        payload.email,
        payload.sub
      )

      this.loginService.setRefreshTokenCookie(context.res, newRefreshToken)
      this.loginService.setAccessTokenCookie(context.res, newAccessToken)

      const user = credential.user
      user.credential = credential

      const login = new Login()
      login.accessToken = newAccessToken
      login.refreshToken = ''
      login.user = user
      login.userId = credential.user.id

      return login
    } catch (error) {
      this.logger.error(error)

      throw new UnauthorizedException(
        serviceErrorCodeMap.AUTH.AUTH_REFRESH_TOKEN_INVALID.message,
        serviceErrorCodeMap.AUTH.AUTH_REFRESH_TOKEN_INVALID.code
      )
    }
  }
}
