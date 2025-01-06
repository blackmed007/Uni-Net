import {
  BadRequestException,
  ForbiddenException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';

@Injectable()
export class BlogsService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly logger = new Logger(BlogsService.name, {
    timestamp: true,
  });

  async create(createBlogDto: CreateBlogDto) {
    try {
      const blog = await this.prisma.blog.create({
        data: createBlogDto,
      });

      return blog;
    } catch (error) {
      this.logger.error(`${error} - Error while creating a new university`);

      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          this.logger.error(
            `${HttpStatus.FORBIDDEN} - Could not create blog entry`,
          );
          throw new ForbiddenException('Could not create blog entry');
        }
      } else if (error instanceof PrismaClientValidationError) {
        this.logger.error(error.message);
        throw new BadRequestException(
          'Invalid date format. Expected ISO-8601 DateTime',
        );
      } else {
        throw new InternalServerErrorException('Could not create blog entry');
      }
    }
  }

  async findAll() {
    this.logger.log('Fetching all blog entries');
    try {
      return await this.prisma.blog.findMany();
    } catch (error) {
      this.logger.error('Error fetching blog entries', error);
      throw new InternalServerErrorException('Could not fetch blog entries');
    }
  }

  async findOne(id: string) {
    this.logger.log(`Fetching blog entry with id: ${id}`);
    try {
      const blog = await this.prisma.blog.findUnique({
        where: { id },
      });
      if (!blog) {
        throw new NotFoundException(`Blog with id ${id} not found`);
      }
      return blog;
    } catch (error) {
      this.logger.error(`Error fetching blog entry with id: ${id}`, error);
      throw new InternalServerErrorException('Could not fetch blog entry');
    }
  }

  async update(id: string, updateBlogDto: UpdateBlogDto) {
    this.logger.log(`Updating blog entry with id: ${id}`);
    try {
      const blog = await this.prisma.blog.findUnique({
        where: { id },
      });
      if (!blog) {
        throw new NotFoundException(`Blog with id ${id} not found`);
      }
      return await this.prisma.blog.update({
        where: { id },
        data: updateBlogDto,
      });
    } catch (error) {
      this.logger.error(`Error updating blog entry with id: ${id}`, error);
      throw new InternalServerErrorException('Could not update blog entry');
    }
  }

  async remove(id: string) {
    this.logger.log(`Removing blog entry with id: ${id}`);
    try {
      const blog = await this.prisma.blog.findUnique({
        where: { id },
      });
      if (!blog) {
        throw new NotFoundException(`Blog with id ${id} not found`);
      }
      return await this.prisma.blog.delete({
        where: { id },
      });
    } catch (error) {
      this.logger.error(`Error removing blog entry with id: ${id}`, error);
      throw new InternalServerErrorException('Could not remove blog entry');
    }
  }
}
