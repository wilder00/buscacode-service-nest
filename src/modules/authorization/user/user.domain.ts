import { serviceErrorCodeMap } from '@/src/helpers/errors.helper'
import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UserInput } from './dto/user.input'
import { User } from './entities/user.entity'

@Injectable()
export class UserDomain {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async addNewUser(userInput: UserInput) {
    const repeatedUser = await this.getOneByPhone(userInput.phone)
    if (repeatedUser !== null)
      throw new BadRequestException(
        serviceErrorCodeMap.USER.USER_PHONE_EXIST.message,
        serviceErrorCodeMap.USER.USER_PHONE_EXIST.code
      )

    const user = await this.userRepository.save(userInput)

    return user
  }

  async getOneByPhone(phone: string) {
    const user = await this.userRepository.findOne({ where: { phone } })
    return user
  }

  async getOneById(id: string) {
    const user = await this.userRepository.findOne({ where: { id } })
    return user
  }
}
