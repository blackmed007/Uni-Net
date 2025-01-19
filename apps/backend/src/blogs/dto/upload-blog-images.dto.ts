import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UploadBlogImageDto {
  @IsString()
  @IsNotEmpty()
  @ApiPropertyOptional({
    type: String,
    description: 'Blog Author Image',
  })
  author_profile_url?: string;

  @IsString()
  @IsNotEmpty()
  @ApiPropertyOptional({
    type: String,
    description: 'Blog Image',
  })
  blog_image?: string;
}
