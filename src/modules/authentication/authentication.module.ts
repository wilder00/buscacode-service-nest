import { Module } from '@nestjs/common'
import { AuthModule } from './auth/auth.module'
import { LoginModule } from './login/login.module'
import { RegisterModule } from './register/register.module'
@Module({
  imports: [RegisterModule, LoginModule, AuthModule],
  controllers: [],
  providers: []
})
export class AuthenticationModule {}
