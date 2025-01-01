import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateEventDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNotEmpty()
  @IsDateString()
  event_date: string | Date;

  @IsNotEmpty()
  event_time: string;

  @IsString()
  location: string;

  @IsString()
  event_type: string;

  @IsString()
  organizer: string;

  @IsNumber()
  max_participants: number;

  @IsString()
  speaker: string;

  @IsString()
  event_thumbnail: string;
}
