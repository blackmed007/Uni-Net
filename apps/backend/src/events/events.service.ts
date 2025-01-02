import {
  BadRequestException,
  ForbiddenException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';

@Injectable()
export class EventService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly logger = new Logger(EventService.name, {
    timestamp: true,
  });

  async create(createEventDto: CreateEventDto) {
    try {
      const { event_date, event_time, ...eventDto } = createEventDto;

      const eventData = {
        ...eventDto,
        datetime: `${event_date}T${event_time}`,
      };

      return await this.prisma.event.create({
        data: eventData,
      });
    } catch (error) {
      this.logger.error(`${error} - Error while creating event`);

      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          this.logger.error(
            `${HttpStatus.FORBIDDEN} - Error while creating event`,
          );
          throw new ForbiddenException('Error while creating event');
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
      const events = await this.prisma.event.findMany();
      return events;
    } catch (error) {
      this.logger.error(`${error} - Error while fetching events`);
      throw new InternalServerErrorException(`Error while fetching events`);
    }
  }

  async findOne(id: string) {
    try {
      const appointment = await this.prisma.event.findUnique({
        where: {
          id,
        },
      });
      return appointment;
    } catch (error) {
      this.logger.error(`${error} - Error while fetching events`);
      throw new InternalServerErrorException(`Error while fetching an event`);
    }
  }

  update(id: number, updateEventDto: UpdateEventDto) {
    console.log(updateEventDto);
    return `This action updates a #${id} event`;
  }

  remove(id: number) {
    return `This action removes a #${id} event`;
  }
}
