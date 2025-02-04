import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    description: 'User first name',
    required: false,
  })
  first_name?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    description: 'User last name',
    required: false,
  })
  last_name?: string;

  @IsEmail()
  @IsOptional()
  @ApiProperty({
    type: String,
    description: 'User email address',
    required: false,
  })
  email?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    description: 'User password',
    required: false,
  })
  password?: string;

  @IsOptional()
  @ApiProperty({
    type: String,
    description: 'User role',
    required: false,
  })
  role?: string;

  @IsOptional()
  @ApiProperty({
    type: String,
    description: 'User profile URL',
    required: false,
  })
  profile_url?: string;

  @IsIn(['male', 'female'])
  @IsOptional()
  @ApiProperty({
    type: String,
    description: 'User gender',
    required: false,
  })
  gender?: 'male' | 'female';

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    description: 'City ID',
    required: false,
  })
  cityId?: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    type: Boolean,
    description: 'User status (Active or Suspended)',
    required: false,
  })
  status?: boolean;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    description: 'University ID',
    required: false,
  })
  universityId?: string;
}
