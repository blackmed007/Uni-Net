import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class JoinEventDto {
  @IsOptional()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  eventId: string;
}
