import {
  IsArray,
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

type Speaker = {
  name: string;
  role: string;
  image_url: string;
};

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
  @IsIn(['Workshop', 'Social', 'Conference', 'Seminar'])
  event_type: string;

  @IsString()
  @IsIn(['Upcoming', 'Ongoing', 'Completed', 'Cancelled'])
  event_status: string;

  @IsString()
  organizer: string;

  @IsNumber()
  max_participants: number;

  @IsArray()
  speaker: Speaker[];

  @IsArray()
  agenda: string[];

  @IsOptional()
  @IsString()
  event_image_url: string;

  @IsOptional()
  @IsString()
  image?: Express.Multer.File;
}
