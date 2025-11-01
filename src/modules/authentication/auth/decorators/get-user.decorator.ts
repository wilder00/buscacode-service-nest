import { serviceErrorCodeMap } from '@/src/helpers/errors.helper'
import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException
} from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { AuthRequest } from '../interfaces/auth-request.interface'

export const GetUser = createParamDecorator((_, ctx: ExecutionContext) => {
  let req: AuthRequest
  if (ctx.getType<'graphql'>() === 'graphql') {
    const gqlCtx = GqlExecutionContext.create(ctx)
    const context = gqlCtx.getContext<{ req: AuthRequest }>()
    req = context.req
  } else {
    req = ctx.switchToHttp().getRequest<AuthRequest>()
  }
  const user = req.user

  if (user === null) {
    throw new InternalServerErrorException(
      serviceErrorCodeMap.AUTH.AUTH_REQUEST_USER_NOT_FOUND.message,
      serviceErrorCodeMap.AUTH.AUTH_REQUEST_USER_NOT_FOUND.code
    )
  }

  return req.user
})
