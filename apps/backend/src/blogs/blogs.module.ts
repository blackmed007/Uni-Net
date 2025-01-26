import { Module } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { BlogsController } from './blogs.controller';
import { ImagesService } from 'src/images/images.service';

@Module({
  controllers: [BlogsController],
  providers: [BlogsService, ImagesService],
})
export class BlogsModule {}
