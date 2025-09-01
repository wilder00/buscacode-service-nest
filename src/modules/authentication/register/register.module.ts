import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserModule } from '../../authorization/user/user.module'
import { LoginModule } from '../login/login.module'
import { Credential } from './entities/credential.entity'
import { RegisterDomain } from './register.domain'
import { RegisterResolver } from './register.resolver'
import { RegisterService } from './register.service'

@Module({
  imports: [
    forwardRef(() => LoginModule),
    TypeOrmModule.forFeature([Credential]),
    UserModule
  ],
  providers: [RegisterResolver, RegisterService, RegisterDomain],
  exports: [RegisterDomain]
})
export class RegisterModule {}
