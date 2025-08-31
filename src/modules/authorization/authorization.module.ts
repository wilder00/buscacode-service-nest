import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './user/entities/user.entity'
import { UserModule } from './user/user.module'

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([User])],
  providers: [],
  exports: []
})
export class AuthorizationModule {}
