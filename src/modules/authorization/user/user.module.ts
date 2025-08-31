import { Module } from '@nestjs/common'
import { UserDomain } from './user.domain'
import { UserResolver } from './user.resolver'
import { UserService } from './user.service'

@Module({
  providers: [UserResolver, UserService, UserDomain],
  exports: [UserDomain]
})
export class UserModule {}
