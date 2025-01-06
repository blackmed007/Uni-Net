import { IsIn, IsOptional, IsString } from 'class-validator';

export class OnboardUserDto {
  @IsOptional()
  profile_url: string;

  @IsIn(['male', 'female'])
  gender: 'male' | 'female';

  @IsString()
  cityId: string;

  @IsString()
  universityId: string;
}
