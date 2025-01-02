import {
  BadRequestException,
  ForbiddenException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';

@Injectable()
export class CitiesService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly logger = new Logger(CitiesService.name, {
    timestamp: true,
  });

  async create(createCityDto: CreateCityDto) {
    try {
      const city = await this.prisma.city.create({
        data: createCityDto,
      });

      return city;
    } catch (error) {
      this.logger.error(`${error} - Error while creating a new city`);

      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          this.logger.error(
            `${HttpStatus.FORBIDDEN} - Error while creating a city`,
          );
          throw new ForbiddenException('Error while creating city');
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
      return await this.prisma.city.findMany();
    } catch (error) {
      this.logger.error(`${error} - Error while fetching cities`);
      throw new InternalServerErrorException(`Error while fetching cities`);
    }
  }

  async findOne(id: string) {
    try {
      const city = await this.prisma.city.findUnique({
        where: {
          id,
        },
      });
      return city;
    } catch (error) {
      this.logger.error(`${error} - Error while fetching city`);
      throw new InternalServerErrorException(`Error while fetching a city`);
    }
  }

  async update(id: string, updateCityDto: UpdateCityDto) {
    try {
      const city = await this.prisma.city.update({
        where: {
          id,
        },
        data: updateCityDto,
      });

      return city;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          this.logger.error(
            `${HttpStatus.FORBIDDEN} - error while updating city`,
          );
          throw new ForbiddenException('error while updating city');
        }
      } else if (error instanceof PrismaClientValidationError) {
        this.logger.error(error.message);
        throw new BadRequestException(
          'Invalid date format. Expected ISO-8601 DateTime',
        );
      } else {
        this.logger.error(error);
        throw new InternalServerErrorException(
          'Server error while updating city - please try again later',
        );
      }
    }
  }

  async remove(id: string) {
    try {
      const city = await this.prisma.city.delete({
        where: {
          id,
        },
      });

      return city;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          this.logger.error(
            `${HttpStatus.FORBIDDEN} - Error while deleting a city`,
          );
          throw new ForbiddenException('Error while deleting a city');
        }
      } else {
        throw new InternalServerErrorException(
          'Server error while deleting a city - please try again later',
        );
      }
    }
  }
}
