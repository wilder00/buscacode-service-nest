import { Injectable } from '@nestjs/common';
import { CreateAccountTypeInput } from './dto/create-account-type.input';
import { UpdateAccountTypeInput } from './dto/update-account-type.input';

@Injectable()
export class AccountTypeService {
  create(createAccountTypeInput: CreateAccountTypeInput) {
    return 'This action adds a new accountType';
  }

  findAll() {
    return `This action returns all accountType`;
  }

  findOne(id: number) {
    return `This action returns a #${id} accountType`;
  }

  update(id: number, updateAccountTypeInput: UpdateAccountTypeInput) {
    return `This action updates a #${id} accountType`;
  }

  remove(id: number) {
    return `This action removes a #${id} accountType`;
  }
}
