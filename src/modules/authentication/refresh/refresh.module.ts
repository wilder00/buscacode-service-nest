import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from '../auth/auth.module'
import { LoginModule } from '../login/login.module'
import { RegisterModule } from '../register/register.module'
import { Refresh } from './entities/refresh.entity'
import { RefreshDomain } from './refresh.domain'
import { RefreshResolver } from './refresh.resolver'
import { RefreshService } from './refresh.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([Refresh]),
    AuthModule,
    RegisterModule,
    LoginModule
  ],
  providers: [RefreshResolver, RefreshService, RefreshDomain],
  exports: [RefreshService]
})
export class RefreshModule {}
