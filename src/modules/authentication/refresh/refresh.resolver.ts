import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { Login } from '../login/entities/login.entity'
import { RefreshInput } from './dto/refresh.input'
import { RefreshDomain } from './refresh.domain'

@Resolver(() => Login)
export class RefreshResolver {
  constructor(private readonly refreshDomain: RefreshDomain) {}

  @Query(() => String)
  check() {
    return 'good'
  }

  @Mutation(() => Login)
  refresh(@Args('RefreshInput') refreshInput: RefreshInput) {
    return this.refreshDomain.refresh(refreshInput)
  }
}
