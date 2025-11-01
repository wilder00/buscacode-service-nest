import { User } from '@/src/modules/authorization/user/entities/user.entity'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthGuard } from './auth.guard'

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [AuthGuard],
  exports: [AuthGuard, TypeOrmModule]
})
export class AuthModule {}
