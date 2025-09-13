import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { AccountTypeService } from './account-type.service';
import { AccountType } from './entities/account-type.entity';
import { CreateAccountTypeInput } from './dto/create-account-type.input';
import { UpdateAccountTypeInput } from './dto/update-account-type.input';

@Resolver(() => AccountType)
export class AccountTypeResolver {
  constructor(private readonly accountTypeService: AccountTypeService) {}

  @Mutation(() => AccountType)
  createAccountType(@Args('createAccountTypeInput') createAccountTypeInput: CreateAccountTypeInput) {
    return this.accountTypeService.create(createAccountTypeInput);
  }

  @Query(() => [AccountType], { name: 'accountType' })
  findAll() {
    return this.accountTypeService.findAll();
  }

  @Query(() => AccountType, { name: 'accountType' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.accountTypeService.findOne(id);
  }

  @Mutation(() => AccountType)
  updateAccountType(@Args('updateAccountTypeInput') updateAccountTypeInput: UpdateAccountTypeInput) {
    return this.accountTypeService.update(updateAccountTypeInput.id, updateAccountTypeInput);
  }

  @Mutation(() => AccountType)
  removeAccountType(@Args('id', { type: () => Int }) id: number) {
    return this.accountTypeService.remove(id);
  }
}
