import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RegisterModule } from '../register/register.module'
import { Login } from './entities/login.entity'
import { LoginResolver } from './login.resolver'
import { LoginService } from './login.service'

@Module({
  imports: [TypeOrmModule.forFeature([Login]), RegisterModule],
  providers: [LoginResolver, LoginService],
  exports: [LoginService]
})
export class LoginModule {}
