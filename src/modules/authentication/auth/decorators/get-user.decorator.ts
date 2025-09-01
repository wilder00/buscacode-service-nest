import { serviceErrorCodeMap } from '@/src/helpers/errors.helper'
import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException
} from '@nestjs/common'
import { AuthRequest } from '../interfaces/auth-request.interface'

export const GetUser = createParamDecorator((_, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest<AuthRequest>()
  const user = req.user

  if (user === null) {
    throw new InternalServerErrorException(
      serviceErrorCodeMap.AUTH.AUTH_REQUEST_USER_NOT_FOUND.message,
      serviceErrorCodeMap.AUTH.AUTH_REQUEST_USER_NOT_FOUND.code
    )
  }

  return req.user
})
