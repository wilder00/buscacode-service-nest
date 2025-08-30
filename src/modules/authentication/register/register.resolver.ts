import { Args, Mutation, Resolver } from '@nestjs/graphql'
import { Login } from '../login/entities/login.entity'
import { RegisterInput } from './dto/register.input'
import { RegisterService } from './register.service'

@Resolver(() => Login)
export class RegisterResolver {
  constructor(private readonly registerService: RegisterService) {}

  @Mutation(() => Login)
  register(@Args('RegisterInput') registerInput: RegisterInput) {
    return this.registerService.create(registerInput)
  }
}
