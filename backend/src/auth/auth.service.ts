import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { createHash, randomBytes } from 'crypto';
import { UsersService, SafeUser } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

export type AuthResponse = {
  accessToken: string;
  user: SafeUser;
};

export type ForgotPasswordResponse = {
  message: string;
  resetToken?: string;
};

@Injectable()
export class AuthService {
  private static readonly BCRYPT_ROUNDS = 10;
  private static readonly PASSWORD_RESET_TTL_MS = 15 * 60 * 1000;
  private static readonly FORGOT_PASSWORD_MESSAGE =
    'If the account exists, a reset token has been generated.';

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

  async forgotPassword(
    dto: ForgotPasswordDto,
  ): Promise<ForgotPasswordResponse> {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      return { message: AuthService.FORGOT_PASSWORD_MESSAGE };
    }

    const resetToken = randomBytes(32).toString('hex');
    const resetTokenHash = this.hashResetToken(resetToken);
    const expiresAt = new Date(Date.now() + AuthService.PASSWORD_RESET_TTL_MS);

    await this.usersService.setPasswordResetToken(
      user.id,
      resetTokenHash,
      expiresAt,
    );

    return {
      message: AuthService.FORGOT_PASSWORD_MESSAGE,
      ...(process.env.NODE_ENV !== 'production' ? { resetToken } : {}),
    };
  }

  async resetPassword(dto: ResetPasswordDto): Promise<void> {
    const tokenHash = this.hashResetToken(dto.token);
    const user =
      await this.usersService.findByPasswordResetTokenHash(tokenHash);
    if (!user || !user.passwordResetExpiresAt) {
      throw new BadRequestException('Invalid or expired reset token');
    }
    if (user.passwordResetExpiresAt.getTime() < Date.now()) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    const passwordHash = await bcrypt.hash(
      dto.password,
      AuthService.BCRYPT_ROUNDS,
    );
    await this.usersService.updatePassword(user.id, passwordHash);
  }

  private async signToken(userId: string, email: string): Promise<string> {
    const payload = { sub: userId, email };
    return this.jwtService.signAsync(payload);
  }

  private hashResetToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }
}
