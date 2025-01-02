import { IsIn, IsString } from 'class-validator';

export class OnboardUserDto {
  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

  @IsString()
  profile_url: string;

  @IsIn(['male', 'female'])
  gender: 'male' | 'female';

  @IsString()
  cityId: string;

  @IsString()
  universityId: string;
}
