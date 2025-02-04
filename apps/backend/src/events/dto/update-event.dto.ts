import { ApiPropertyOptional } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import {
  IsOptional,
  IsString,
  IsNotEmpty,
  IsIn,
  IsNumber,
  IsArray,
} from 'class-validator';

export class UpdateEventDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    type: String,
    description: 'This is an optional property',
  })
  name?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    type: String,
    description: 'This is an optional property',
  })
  description?: string;

  @IsOptional()
  @IsNotEmpty()
  @ApiPropertyOptional({
    type: String,
    description: 'This is an optional property',
  })
  event_date?: string;

  @IsOptional()
  @IsNotEmpty()
  @ApiPropertyOptional({
    type: String,
    description: 'This is an optional property',
  })
  event_time?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    type: String,
    description: 'This is an optional property',
  })
  location?: string;

  @IsOptional()
  @IsString()
  @IsIn(['Workshop', 'Social', 'Conference', 'Seminar'])
  @ApiPropertyOptional({
    type: String,
    description: 'This is an optional property',
  })
  event_type?: string;

  @IsOptional()
  @IsString()
  @IsIn(['Upcoming', 'Ongoing', 'Completed', 'Cancelled'])
  @ApiPropertyOptional({
    type: String,
    description: 'This is an optional property',
  })
  event_status?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    type: String,
    description: 'This is an optional property',
  })
  organizer?: string;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({
    type: Number,
    description: 'This is an optional property',
  })
  max_participants?: number;

  @IsOptional()
  @IsArray()
  @ApiPropertyOptional({
    type: Array,
    description: 'This is an optional property',
  })
  speaker?: Prisma.InputJsonValue;

  @IsOptional()
  @ApiPropertyOptional({
    type: Array,
    description: 'This is an optional property',
  })
  agenda?: Prisma.NullTypes.JsonNull | Prisma.InputJsonValue;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    type: String,
    description: 'This is an optional property',
  })
  event_image_url?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    type: String,
    description: 'This is an optional property',
  })
  image?: Express.Multer.File;
}
