import { Injectable } from '@nestjs/common';
import { sign } from 'jsonwebtoken';
import { UserService } from 'src/shared/user.service';
import { Payload } from 'src/types/payload';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async signPayLoad(payload: Payload) {
    return sign(payload, process.env.JWT_SECRET, { expiresIn: '12h' });
  }
  async vaidateUser(payload: Payload) {
    return await this.userService.findByPayLoad(payload);
  }
}
