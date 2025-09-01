import { serviceErrorCodeMap } from '@/src/helpers/errors.helper'
import {
  CanActivate,
  ExecutionContext,
  forwardRef,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { GqlExecutionContext } from '@nestjs/graphql'
import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt'
import { Request } from 'express'
import { User } from '../../authorization/user/entities/user.entity'
import { UserDomain } from '../../authorization/user/user.domain'
import { AuthRequest } from './interfaces/auth-request.interface'
import { JwtPayload } from './interfaces/jwt.interface'

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name)
  constructor(
    private jwtService: JwtService,
    private readonly configService: ConfigService,
    @Inject(forwardRef(() => UserDomain))
    private readonly userDomain: UserDomain
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    let request: AuthRequest
    if (context.getType<'graphql'>() === 'graphql') {
      const gqlCtx = GqlExecutionContext.create(context)
      const ctx = gqlCtx.getContext<{ req: AuthRequest }>()
      request = ctx.req
    } else {
      request = context.switchToHttp().getRequest()
    }

    const token = this.extractTokenFromHeader(request)
    if (!token) {
      throw new UnauthorizedException(
        serviceErrorCodeMap.AUTH.AUTH_TOKEN_REQUIRED.message,
        serviceErrorCodeMap.AUTH.AUTH_TOKEN_REQUIRED.code
      )
    }

    let user: User | null = null
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: this.configService.get('JWT_SECRET')
      })
      user = await this.userDomain.getOneById(payload.sub)
    } catch (e) {
      if (e instanceof TokenExpiredError) {
        throw new UnauthorizedException(
          serviceErrorCodeMap.AUTH.AUTH_TOKEN_EXPIRED.message,
          serviceErrorCodeMap.AUTH.AUTH_TOKEN_EXPIRED.code
        )
      } else if (e instanceof JsonWebTokenError) {
        throw new UnauthorizedException(
          serviceErrorCodeMap.AUTH.AUTH_TOKEN_REQUIRED.message,
          serviceErrorCodeMap.AUTH.AUTH_TOKEN_REQUIRED.code
        )
      } else {
        throw new UnauthorizedException(
          (e as Error).message,
          serviceErrorCodeMap.AUTH.AUTH_TOKEN_INVALID.code
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
    request.user = user

    return true
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? []
    return type === 'Bearer' ? token : undefined
  }
}
