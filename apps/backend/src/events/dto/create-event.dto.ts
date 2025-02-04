import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import {
  IsArray,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateEventDto {
  @IsString()
  @ApiProperty({
    type: String,
    description: 'This is a required property',
  })
  name: string;

  @IsString()
  @ApiProperty({
    type: String,
    description: 'This is a required property',
  })
  description: string;

  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'This is a required property',
  })
  event_date: string;

  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'This is a required property',
  })
  event_time: string;

  @IsString()
  @ApiProperty({
    type: String,
    description: 'This is a required property',
  })
  location: string;

  @IsString()
  @IsIn(['Workshop', 'Social', 'Conference', 'Seminar'])
  @ApiProperty({
    type: String,
    description: 'This is a required property',
  })
  event_type: string;

  @IsString()
  @IsIn(['Upcoming', 'Ongoing', 'Completed', 'Cancelled'])
  @ApiProperty({
    type: String,
    description: 'This is a required property',
  })
  event_status: string;

  @IsString()
  @ApiProperty({
    type: String,
    description: 'This is a required property',
  })
  organizer: string;

  @IsNumber()
  @ApiProperty({
    type: Number,
    description: 'This is a required property',
  })
  max_participants: number;

  @IsArray()
  @ApiProperty({
    type: Array,
    description: 'This is a required property',
  })
  speaker: Prisma.InputJsonValue;

  @IsOptional()
  @ApiProperty({
    type: Array,
    description: 'This is a required property',
  })
  agenda: Prisma.NullTypes.JsonNull | Prisma.InputJsonValue;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'This is a required property',
  })
  event_image_url: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    type: String,
    description: 'This is a required property',
  })
  image?: Express.Multer.File;
}
