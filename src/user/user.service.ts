import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/schemas/user.schema';
import { formatResponse } from 'src/utils/response';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createUser(data) {
    try {
      const createdUser = new this.userModel(data);
      const savedUser = await createdUser.save();

      return formatResponse(201, 'User created successfully', savedUser);
    } catch (e) {
      if (e?.code == 11000) {
        throw new HttpException('User Entity Exists', 422);
      }
      throw new HttpException(e.message, e.status || 500);
    }
  }

  async findOneUser(email) {
    try {
      const findUser = await this.userModel.findOne({ email: email });

      if (!findUser) {
        throw { message: 'User Not Found', status: 404 };
      }

      return formatResponse(200, 'User fetched successfully', findUser);
    } catch (e) {
      throw new HttpException(e.message, e.status || 500);
    }
  }
}
