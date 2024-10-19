import { Prisma } from '@prisma/client';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignupDto implements Prisma.UserCreateInput {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
