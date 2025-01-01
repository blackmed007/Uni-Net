import { IsString } from 'class-validator';

export class OnboardUserDto {
  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

  @IsString()
  profile_url: string;

  @IsString()
  gender: string;

  @IsString()
  cityId: string;

  @IsString()
  universityId: string;
}
