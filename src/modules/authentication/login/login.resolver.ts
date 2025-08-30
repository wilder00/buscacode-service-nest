import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { LoginInput } from './dto/create-login.input'
import { Login } from './entities/login.entity'
import { LoginService } from './login.service'

@Resolver(() => Login)
export class LoginResolver {
  constructor(private readonly loginService: LoginService) {}

  @Query(() => String)
  check() {
    return 'good'
  }

  @Mutation(() => Login)
  login(@Args('LoginInput') loginInput: LoginInput) {
    return this.loginService.login(loginInput)
  }
}
