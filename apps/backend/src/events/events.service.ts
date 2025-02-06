import {
  BadRequestException,
  ForbiddenException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
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

  async create(userId: string, createEventDto: CreateEventDto) {
    try {
      const { event_date, event_time, speaker, ...eventDto } = createEventDto;

      const formattedDate = new Date(
        `${event_date}T${event_time}`,
      ).toISOString();

      const eventData = {
        ...eventDto,
        datetime: `${formattedDate}`,
      };

      const newData = {
        datetime: eventData.datetime,
        name: eventData.name,
        description: eventData.description,
        location: eventData.location,
        event_type: eventData.event_type,
        event_status: eventData.event_status,
        organizer: eventData.organizer,
        max_participants: eventData.max_participants,
        speaker: speaker,
        agenda: eventData.agenda,
        event_thumbnail: eventData.event_image_url,
      };

      const event = await this.prisma.event.create({
        data: newData,
      });

      await this.prisma.userActivity.create({
        data: {
          userId,
          activity: `Event created: ${event.name}`,
        },
      });
      return event;
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
        throw new BadRequestException('Invalid field validation');
      } else {
        throw new InternalServerErrorException(
          'Server error - please try again later',
        );
      }
    }
  }

  async findAll() {
    try {
      const events = await this.prisma.event.findMany({
        include: {
          participants: {
            select: {
              userId: true,
            },
          },
        },
      });

      const eventsWithParticipantCount = events.map((event) => ({
        ...event,
        currentParticipants: event.participants.length,
      }));

      return eventsWithParticipantCount;
    } catch (error) {
      this.logger.error(`${error} - Error while fetching events`);
      throw new InternalServerErrorException(`Error while fetching events`);
    }
  }

  async findOne(id: string) {
    try {
      const event = await this.prisma.event.findUnique({
        where: {
          id,
        },
        include: {
          participants: {
            select: {
              userId: true,
            },
          },
        },
      });

      if (!event) {
        throw new NotFoundException(`Event with id ${id} not found`);
      }

      const eventWithParticipantCount = {
        ...event,
        currentParticipants: event.participants.length,
      };

      return eventWithParticipantCount;
    } catch (error) {
      this.logger.error(`${error} - Error while fetching an event`);
      throw new InternalServerErrorException(`Error while fetching an event`);
    }
  }

  async update(userId: string, id: string, updateEventDto: UpdateEventDto) {
    try {
      const event = await this.prisma.event.update({
        where: {
          id,
        },
        data: updateEventDto,
      });

      await this.prisma.userActivity.create({
        data: {
          userId,
          activity: `Event updated: ${event.name}`,
        },
      });

      return event;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          this.logger.error(
            `${HttpStatus.FORBIDDEN} - error while updating event`,
          );
          throw new ForbiddenException('error while updating event');
        }
      } else if (error instanceof PrismaClientValidationError) {
        this.logger.error(error.message);
        throw new BadRequestException(
          'Invalid date format. Expected ISO-8601 DateTime',
        );
      } else {
        this.logger.error(error);
        throw new InternalServerErrorException(
          'Server error while updating event - please try again later',
        );
      }
    }
  }

  async remove(id: string) {
    this.logger.log(`Removing event entry with id: ${id}`);
    try {
      const event = await this.prisma.event.findUnique({
        where: { id },
      });
      if (!event) {
        throw new NotFoundException(`Event with id ${id} not found`);
      }
      return await this.prisma.event.delete({
        where: { id },
      });
    } catch (error) {
      this.logger.error(`Error removing event entry with id: ${id}`, error);
      throw new InternalServerErrorException('Could not remove event entry');
    }
  }
}
