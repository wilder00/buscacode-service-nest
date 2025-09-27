import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql'
import { Auth } from '../../authentication/auth/decorators/auth.decorator'
import { UpdateUserInput } from './dto/update-user.input'
import { UserInput } from './dto/user.input'
import { User } from './entities/user.entity'
import { UserService } from './user.service'

@Resolver(() => User)
@Auth()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => User)
  createUser(@Args('userInput') userInput: UserInput) {
    return this.userService.create(userInput)
  }

  @Query(() => [User], { name: 'user' })
  findAll() {
    return this.userService.findAll()
  }

  @Query(() => User, { name: 'user', nullable: true })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.userService.findOne(id)
  }

  @Mutation(() => User)
  updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.userService.update(updateUserInput.id, updateUserInput)
  }

  @Mutation(() => User)
  removeUser(@Args('id', { type: () => Int }) id: number) {
    return this.userService.remove(id)
  }
}
