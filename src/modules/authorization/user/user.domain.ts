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
    const { name, secondName, lastName, secondLastName, phone, isActive } =
      userInput
    const repeatedUser = await this.getOneByPhone(userInput.phone)
    if (repeatedUser !== null)
      throw new BadRequestException(
        serviceErrorCodeMap.USER.USER_PHONE_EXIST.message,
        serviceErrorCodeMap.USER.USER_PHONE_EXIST.code
      )

    const newUser = new User()
    newUser.name = name
    newUser.secondName = secondName
    newUser.lastName = lastName
    newUser.secondLastName = secondLastName
    newUser.phone = phone
    newUser.isActive = isActive

    const user = await this.userRepository.save(newUser)

    return user
  }

  async getOneByPhone(phone: string) {
    const user = await this.userRepository.findOneBy({ phone })
    return user
  }

  async getOneById(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['credential']
    })
    return user
  }
}
