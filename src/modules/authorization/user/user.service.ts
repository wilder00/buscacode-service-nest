import { Injectable } from '@nestjs/common'
import { UpdateUserInput } from './dto/update-user.input'
import { UserInput } from './dto/user.input'
import { UserDomain } from './user.domain'

@Injectable()
export class UserService {
  constructor(private readonly userDomain: UserDomain) {}

  async create(userInput: UserInput) {
    const user = await this.userDomain.addNewUser(userInput)
    return user
  }

  findAll() {
    return `This action returns all user`
  }

  findOne(id: string) {
    const user = this.userDomain.getOneById(id)
    return user
  }

  update(id: number, updateUserInput: UpdateUserInput) {
    return updateUserInput
  }

  remove(id: number) {
    return `This action removes a #${id} user`
  }
}
