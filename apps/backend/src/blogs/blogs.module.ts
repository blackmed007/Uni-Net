import { Module } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { BlogsController } from './blogs.controller';
import { ImagesModule } from '../images/images.module'; 
@Module({
  imports: [ImagesModule],
  controllers: [BlogsController],
  providers: [BlogsService],
})
export class BlogsModule {}