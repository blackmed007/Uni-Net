import {
  BadRequestException,
  ForbiddenException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { OnboardUserDto } from './dto/onboard-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JoinEventDto } from './dto/join-event.dto';
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';
import { Bookmark } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly logger = new Logger(UsersService.name, {
    timestamp: true,
  });

  async onboard(userId: string, onboardUserDto: OnboardUserDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        this.logger.log(`User with ID ${userId} not found`);
        throw new NotFoundException(`User with ID ${userId} not found`);
      }

      return this.prisma.user.update({
        where: { id: userId },
        data: {
          ...onboardUserDto,
          status: true,
        },
        select: {
          id: true,
          first_name: true,
          last_name: true,
          email: true,
          status: true,
          profile_url: true,
          gender: true,
          cityId: true,
          universityId: true,
          events: true,
          city: true,
          university: true,
          createdAt: true,
          updatedAt: true,
        },
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
      return await this.prisma.user.findMany({
        select: {
          id: true,
          first_name: true,
          last_name: true,
          email: true,
          status: true,
          profile_url: true,
          gender: true,
          cityId: true,
          universityId: true,
          events: true,
          city: true,
          university: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    } catch (error) {
      this.logger.error(`${error} - Error while fetching users`);
      throw new InternalServerErrorException(`Error while fetching users`);
    }
  }

  async findOne(id: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id,
        },
        select: {
          id: true,
          first_name: true,
          last_name: true,
          email: true,
          status: true,
          profile_url: true,
          gender: true,
          cityId: true,
          universityId: true,
          events: true,
          city: true,
          university: true,
          createdAt: true,
        },
      });
      return user;
    } catch (error) {
      this.logger.error(`${error} - Error while fetching user`);
      throw new InternalServerErrorException(`Error while fetching a user`);
    }
  }
  async getCurrentUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        status: true,
        profile_url: true,
        gender: true,
        cityId: true,
        universityId: true,
        createdAt: true,
        events: {
          select: {
            event: {
              select: {
                id: true,
                name: true,
                description: true,
                datetime: true,
                location: true,
                event_type: true,
                event_status: true,
                organizer: true,
                max_participants: true,
                agenda: true,
                speaker: true,
                event_thumbnail: true,
              },
            },
            joinedAt: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Transform the events structure
    const transformedUser = {
      ...user,
      events: user.events.map((eventEntry) => ({
        ...eventEntry.event, // Spread the event fields
        joinedAt: eventEntry.joinedAt, // Include joinedAt
      })),
    };

    return transformedUser;
  }

  async joinEvent(userId: string, joinEventDto: JoinEventDto) {
    const { eventId } = joinEventDto;

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!user || !event) {
      throw new ForbiddenException('User or Event not found');
    }

    return this.prisma.usersOnEvents.create({
      data: {
        userId,
        eventId,
      },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });

    return updatedUser;
  }

  async remove(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    await this.prisma.user.delete({
      where: { id },
    });

    return { message: `User with ID ${id} has been removed` };
  }

  async addBookmark(userId: string, blogId: string): Promise<Bookmark> {
    return this.prisma.bookmark.create({
      data: {
        user: { connect: { id: userId } },
        blog: { connect: { id: blogId } },
      },
    });
  }

  async getUserBookmarks(userId: string): Promise<Bookmark[]> {
    return this.prisma.bookmark.findMany({
      where: { userId },
      include: { blog: true },
    });
  }

  async removeBookmark(userId: string, blogId: string): Promise<Bookmark> {
    return this.prisma.bookmark.delete({
      where: {
        userId_blogId: {
          userId,
          blogId,
        },
      },
    });
  }
}
