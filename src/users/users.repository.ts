import { UserDocument } from './models/user.schema';
import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from 'src/database/abstract.repository';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './models/user.model';
import { Model } from 'mongoose';

Injectable();
export class UsersRepository extends AbstractRepository<UserDocument> {
  protected readonly logger = new Logger(UsersRepository.name);
  constructor(@InjectModel(User.name) userModel: Model<UserDocument>) {
    super(userModel);
  }
}
