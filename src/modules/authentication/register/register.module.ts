import { Module } from '@nestjs/common'
import { LoginModule } from '../login/login.module'
import { RegisterResolver } from './register.resolver'
import { RegisterService } from './register.service'

@Module({
  providers: [RegisterResolver, RegisterService],
  imports: [LoginModule]
})
export class RegisterModule {}
