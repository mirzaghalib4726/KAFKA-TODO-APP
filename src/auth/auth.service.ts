import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import utils from 'src/utils';
import { formatResponse } from 'src/utils/response';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(data) {
    try {
      const hash = utils.generateHash(data.password);
      data.password = hash;

      const createdUser = await this.userService.createUser(data);

      return formatResponse(201, 'User Created Successfully', createdUser.data);
    } catch (e) {
      throw new HttpException(e.message, e.status || 500);
    }
  }

  async signin(data) {
    try {
      const findUser = await this.userService.findOneUser(data.email);

      const validHash = utils.compaireHash(
        data.password,
        findUser.data.password,
      );

      if (validHash) {
        findUser.data._id = findUser.data._id.toString();
        const payload = {
          id: findUser.data._id,
          email: findUser.data.email,
        };

        return formatResponse(200, 'Logged in successfull', {
          access_token: await this.jwtService.signAsync(payload),
          data: findUser,
        });
      }

      return formatResponse(404, 'Credentials Not Correct');
    } catch (e) {
      throw new HttpException(e.message, e.status || 500);
    }
  }
}
