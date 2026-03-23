import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService, SafeUser } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

export type AuthResponse = {
  accessToken: string;
  user: SafeUser;
};

@Injectable()
export class AuthService {
  private static readonly BCRYPT_ROUNDS = 10;

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResponse> {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('Email already registered');
    }
    const passwordHash = await bcrypt.hash(
      dto.password,
      AuthService.BCRYPT_ROUNDS,
    );
    const user = await this.usersService.create(dto.email, passwordHash);
    const accessToken = await this.signToken(user.id, user.email);
    return { accessToken, user };
  }

  async login(dto: LoginDto): Promise<AuthResponse> {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const match = await bcrypt.compare(dto.password, user.passwordHash);
    if (!match) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const safe = this.usersService.toSafeUser(user);
    const accessToken = await this.signToken(safe.id, safe.email);
    return { accessToken, user: safe };
  }

  private async signToken(userId: string, email: string): Promise<string> {
    const payload = { sub: userId, email };
    return this.jwtService.signAsync(payload);
  }
}
