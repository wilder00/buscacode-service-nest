import { UserModule } from '@/src/modules/authorization/user/user.module'
import { forwardRef, Module } from '@nestjs/common'
import { AuthGuard } from './auth.guard'

@Module({
  providers: [AuthGuard],
  exports: [AuthGuard],
  imports: [forwardRef(() => UserModule)]
})
export class AuthModule {}
