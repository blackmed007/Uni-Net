import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  UseInterceptors,
  Param,
  Delete,
  UploadedFile,
} from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { Blog } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImagesService } from 'src/images/images.service';

@Controller('blogs')
export class BlogsController {
  constructor(
    private readonly blogsService: BlogsService,
    private readonly imagessService: ImagesService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('blog_image'))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createBlogDto: CreateBlogDto,
  ) {
    if (file) {
      const eventImageUrl = await this.imagessService.uploadImage(file, 'blog');
      createBlogDto.blog_image = eventImageUrl;
    }
    return this.blogsService.create(createBlogDto);
  }

  @Get()
  findAll() {
    return this.blogsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.blogsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBlogDto: UpdateBlogDto) {
    return this.blogsService.update(id, updateBlogDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.blogsService.remove(id);
  }
  @Get(':id/view')
  async viewBlog(@Param('id') id: string): Promise<Blog> {
    return this.blogsService.incrementViews(id);
  }
}
