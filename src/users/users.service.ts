import { UserDocument } from './models/user.schema';
import { UsersRepository } from './users.repository';
import {
  Injectable,
  UnprocessableEntityException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserInput } from './dto/input/create-user.input';
import { UpdateUserInput } from './dto/input/update-user.input';
import * as bcrypt from 'bcrypt';
import { User } from './models/user.model';
import { GetUserArgs } from './dto/args/get-user.args';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}
  private async validateCreateUserData(createUserData: CreateUserInput) {
    try {
      await this.usersRepository.findOne({ email: createUserData.email });
      throw new UnprocessableEntityException('Email already exists.');
    } catch (err) {}
  }
  private toModel(userDocument: UserDocument): User {
    return {
      _id: userDocument._id.toHexString(),
      email: userDocument.email,
    };
  }

  async createUser(createUserInput: CreateUserInput) {
    await this.validateCreateUserData(createUserInput);
    const userDocument = await this.usersRepository.create({
      ...createUserInput,
      password: await bcrypt.hash(createUserInput.password, 10),
    });
    return this.toModel(userDocument);
  }

  async getUser(getUserArgs: GetUserArgs) {
    const userDocument = await this.usersRepository.findOne({
      ...getUserArgs,
    });
    return this.toModel(userDocument);
  }
  async validateUser(email: string, password: string) {
    const userDocument = await this.usersRepository.findOne({ email });
    const passwordIsValid = await bcrypt.compare(
      password,
      userDocument.password,
    );
    if (!passwordIsValid) {
      throw new UnauthorizedException('Crediantials are not valid!!');
    }
    return this.toModel(userDocument);
  }
}
