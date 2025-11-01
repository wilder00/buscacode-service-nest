import { serviceErrorCodeMap } from '@/src/helpers/errors.helper'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from '../../authorization/user/entities/user.entity'
import { JwtPayload } from '../auth/interfaces/jwt.interface'
import { Login } from '../login/entities/login.entity'
import { LoginService } from '../login/login.service'
import { RefreshInput } from './dto/refresh.input'

@Injectable()
export class RefreshDomain {
  constructor(
    private readonly loginService: LoginService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async refresh(refreshInput: RefreshInput): Promise<Login> {
    const { refreshToken } = refreshInput
    let user: User | null = null
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(
        refreshToken,
        {
          secret: this.configService.get('JWT_REFRESH_SECRET')
        }
      )
      user = await this.userRepository.findOne({
        where: { id: payload.sub },
        relations: { credential: true }
      })
    } catch (e) {
      if (e instanceof TokenExpiredError) {
        throw new UnauthorizedException(
          serviceErrorCodeMap.AUTH.AUTH_REFRESH_TOKEN_EXPIRED.message,
          serviceErrorCodeMap.AUTH.AUTH_REFRESH_TOKEN_EXPIRED.code
        )
      } else if (e instanceof JsonWebTokenError) {
        throw new UnauthorizedException(
          serviceErrorCodeMap.AUTH.AUTH_REFRESH_TOKEN_REQUIRED.message,
          serviceErrorCodeMap.AUTH.AUTH_REFRESH_TOKEN_REQUIRED.code
        )
      } else {
        throw new UnauthorizedException(
          (e as Error).message,
          serviceErrorCodeMap.AUTH.AUTH_REFRESH_TOKEN_INVALID.code
        )
      }
    }

    if (user === null) {
      throw new UnauthorizedException(
        serviceErrorCodeMap.AUTH.AUTH_INVALID_CREDENTIALS.message,
        serviceErrorCodeMap.AUTH.AUTH_INVALID_CREDENTIALS.code
      )
    }

    if (!user.isActive || !user.credential.isActive) {
      throw new UnauthorizedException(
        serviceErrorCodeMap.AUTH.AUTH_USER_INACTIVE.message,
        serviceErrorCodeMap.AUTH.AUTH_USER_INACTIVE.code
      )
    }

    const credential = user.credential
    credential.user = user

    return this.loginService.generateLogin(credential)
  }
}
