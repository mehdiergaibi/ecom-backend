import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { SharedModule } from 'src/shared/shared.module';
import { AuthService } from './auth.service';
import { JwtStategy } from './jwt.strategy';

@Module({
  imports:[SharedModule],
  controllers: [AuthController],
  providers: [AuthService, JwtStategy]
})
export class AuthModule {}
