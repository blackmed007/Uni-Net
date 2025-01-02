import {
  BadRequestException,
  ForbiddenException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateUniversityDto } from './dto/create-university.dto';
import { UpdateUniversityDto } from './dto/update-university.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';

@Injectable()
export class UniversitiesService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly logger = new Logger(UniversitiesService.name, {
    timestamp: true,
  });

  async create(createUniversityDto: CreateUniversityDto) {
    try {
      const university = await this.prisma.university.create({
        data: createUniversityDto,
      });

      return university;
    } catch (error) {
      this.logger.error(`${error} - Error while creating a new university`);

      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          this.logger.error(
            `${HttpStatus.FORBIDDEN} - Error while creating a university`,
          );
          throw new ForbiddenException('Error while creating university');
        }
      } else if (error instanceof PrismaClientValidationError) {
        this.logger.error(error.message);
        throw new BadRequestException(
          'Invalid date format. Expected ISO-8601 DateTime',
        );
      } else {
        throw new InternalServerErrorException(
          'Server error - please try again later',
        );
      }
    }
  }

  async findAll() {
    try {
      return await this.prisma.university.findMany();
    } catch (error) {
      this.logger.error(`${error} - Error while fetching universities`);
      throw new InternalServerErrorException(
        `Error while fetching universities`,
      );
    }
  }

  async findOne(id: string) {
    try {
      const university = await this.prisma.university.findUnique({
        where: {
          id,
        },
      });
      return university;
    } catch (error) {
      this.logger.error(`${error} - Error while fetching university`);
      throw new InternalServerErrorException(
        `Error while fetching a university`,
      );
    }
  }

  async update(id: string, updateUniversityDto: UpdateUniversityDto) {
    try {
      const univerity = await this.prisma.university.update({
        where: {
          id,
        },
        data: updateUniversityDto,
      });

      return univerity;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          this.logger.error(
            `${HttpStatus.FORBIDDEN} - error while updating university`,
          );
          throw new ForbiddenException('error while updating university');
        }
      } else if (error instanceof PrismaClientValidationError) {
        this.logger.error(error.message);
        throw new BadRequestException(
          'Invalid date format. Expected ISO-8601 DateTime',
        );
      } else {
        this.logger.error(error);
        throw new InternalServerErrorException(
          'Server error while updating university - please try again later',
        );
      }
    }
  }

  async remove(id: string) {
    try {
      const university = await this.prisma.university.delete({
        where: {
          id,
        },
      });

      return university;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          this.logger.error(
            `${HttpStatus.FORBIDDEN} - Error while deleting a university`,
          );
          throw new ForbiddenException('Error while deleting a university');
        }
      } else {
        throw new InternalServerErrorException(
          'Server error while deleting a university - please try again later',
        );
      }
    }
  }
}
