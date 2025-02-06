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
  InternalServerErrorException,
  UseGuards,
  Request,
} from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { Blog } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImagesService } from 'src/images/images.service';
import { Request as ExpressRequest } from 'express';
import { JwtGuard } from 'src/auth/guard';

@Controller('blogs')
export class BlogsController {
  constructor(
    private readonly blogsService: BlogsService,
    private readonly imagessService: ImagesService,
  ) {}

  @Post('upload-blog-image')
  @UseInterceptors(FileInterceptor('blog_image'))
  async uploadBlogImage(@UploadedFile() file: Express.Multer.File) {
    if (file) {
      const blogImageUrl = await this.imagessService.uploadImage(
        file,
        'blog_image',
      );
      return { url: blogImageUrl };
    }
    throw new InternalServerErrorException(
      'Error while trying to upload blog image',
    );
  }

  @Post('upload-author-image')
  @UseInterceptors(FileInterceptor('author_image'))
  async uploadAuthorImage(@UploadedFile() file: Express.Multer.File) {
    if (file) {
      const authorImageUrl = await this.imagessService.uploadImage(
        file,
        'blog_author_image',
      );
      return { url: authorImageUrl };
    }
    throw new InternalServerErrorException(
      'Error while trying to upload blog author image',
    );
  }

  @Post()
  @UseGuards(JwtGuard)
  async create(
    @Request() req: ExpressRequest,
    @Body() createBlogDto: CreateBlogDto,
  ) {
    const userId = (req.user as { id: string }).id;
    return this.blogsService.create(userId, createBlogDto);
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
