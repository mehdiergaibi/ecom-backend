import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LoginDTO, RegisterDTO } from 'src/auth/auth.dto';
import { User } from 'src/types/user';
import * as bcrypt from 'bcrypt';
import { Payload } from 'src/types/payload';
@Injectable()
export class UserService {
  constructor(@InjectModel('User') private userModel: Model<User>) {}

  private santizeUser(user: User) {
    const { password, ...santizedUser } = user.toObject();
    return santizedUser;
  }

  async findAll(){
    return await this.userModel.find();
  }

  async create(userDTO: RegisterDTO) {
    const { username } = userDTO;
    const user = await this.userModel.findOne({ username });
    if (user) {
      throw new HttpException('username already exist', HttpStatus.BAD_REQUEST);
    }
    const createdUSer = new this.userModel(userDTO);
    await createdUSer.save();
    return this.santizeUser(createdUSer);
  }
  async findByLogin(userDTO: LoginDTO) {
    const { username, password } = userDTO;
    const user = await this.userModel.findOne({ username });
    if (!user) {
      throw new HttpException('invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    if (await bcrypt.compare(password, user.password)) {
      return this.santizeUser(user);
    } else {
      throw new HttpException('invaid creadentials', HttpStatus.UNAUTHORIZED);
    }
  }
  async findByPayLoad(payload: Payload) {
    const { username } = payload;
    return await this.userModel.findOne({ username });
  }
}
