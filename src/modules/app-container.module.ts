import { Module } from '@nestjs/common'
import { AuthenticationModule } from './authentication/authentication.module'
import { AuthorizationModule } from './authorization/authorization.module'
import { FinanceModule } from './finance/finance.module'
@Module({
  imports: [AuthenticationModule, AuthorizationModule, FinanceModule],
  controllers: [],
  providers: []
})
export class AppContainerModule {}
