import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignupDto } from './dto/signup.dto';
import * as argon from 'argon2';
import {
  PrismaClientInitializationError,
  PrismaClientKnownRequestError,
} from '@prisma/client/runtime/library';
import { SigninDto } from './dto/signin.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async signUp(authDto: SignupDto) {
    const hashedPassword = await argon.hash(authDto.password);

    try {
      const user = await this.prisma.user.create({
        data: {
          first_name: authDto.first_name,
          last_name: authDto.last_name,
          email: authDto.email,
          password: hashedPassword,
          role: 'user',
        },
      });
      return this.signToken(user.id, user.email);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException(
            'A user with this email address already exists',
          );
        }
      } else if (error instanceof PrismaClientInitializationError) {
        throw new InternalServerErrorException(
          'Server error - please try again later',
        );
      }

      throw error;
    }
  }
  async signIn(authDto: SigninDto) {
    try {
      // Find user from the database
      const user = await this.prisma.user.findUnique({
        where: {
          email: authDto.email,
        },
      });

      // Return error if user not found
      if (!user) {
        throw new ForbiddenException('Incorrect Credentials!');
      }

      // Password comparison
      const pwdMatches = await argon.verify(user.password, authDto.password);

      if (!pwdMatches) {
        throw new ForbiddenException('Incorrect Credentials!');
      }
      return this.signToken(user.id, user.email);
    } catch (error) {
      if (error instanceof PrismaClientInitializationError) {
        throw new InternalServerErrorException(
          'Server error - please try again later',
        );
      }

      throw error;
    }
  }
  async signToken(
    userId: string,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    };

    // Get JWT_SECRET from environment variable configs
    const secret = this.config.get('JWT_SECRET');

    // Signing a token
    const token = this.jwt.sign(payload, {
      expiresIn: '15m',
      secret,
    });

    return { access_token: token };
  }
}
