import {
  BadRequestException,
  ForbiddenException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import * as argon from 'argon2';
import { OnboardUserDto } from './dto/onboard-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JoinEventDto } from './dto/join-event.dto';
import {
  PrismaClientInitializationError,
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';
import { Bookmark, Event, EventBookmark, UserActivity } from '@prisma/client';
import { SignupDto } from 'src/auth/dto/signup.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly logger = new Logger(UsersService.name, {
    timestamp: true,
  });

  async create(authDto: SignupDto) {
    const hashedPassword = await argon.hash(authDto.password);

    try {
      const user = await this.prisma.user.create({
        data: {
          first_name: authDto.first_name,
          last_name: authDto.last_name,
          email: authDto.email,
          password: hashedPassword,
          role: authDto.role.toLowerCase(),
        },
      });
      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException(
            'A user with this email address already exists',
          );
        }
      } else if (error instanceof PrismaClientInitializationError) {
        throw new InternalServerErrorException(
          'Server error - please try again later',
        );
      }

      throw error;
    }
  }

  async onboard(userId: string, onboardUserDto: OnboardUserDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        this.logger.log(`User with ID ${userId} not found`);
        throw new NotFoundException(`User with ID ${userId} not found`);
      }

      const onboardedUser = await this.prisma.user.update({
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

      await this.prisma.userActivity.create({
        data: {
          userId,
          activity: `New user registered: ${onboardedUser.first_name} ${onboardedUser.last_name}`,
        },
      });

      return onboardedUser;
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
          role: true,
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
          role: true,
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
        role: true,
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

    const joinedEvent = this.prisma.usersOnEvents.create({
      data: {
        userId,
        eventId,
      },
    });

    await this.prisma.userActivity.create({
      data: {
        userId,
        activity: 'Joined event',
      },
    });

    return joinedEvent;
  }

  async leaveEvent(userId: string, leaveEventDto: JoinEventDto) {
    const { eventId } = leaveEventDto;

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!user || !event) {
      throw new ForbiddenException('User or Event not found');
    }

    // Check if the user is joined to the event
    const joinedEvent = await this.prisma.usersOnEvents.findUnique({
      where: {
        userId_eventId: {
          userId,
          eventId,
        },
      },
    });

    if (!joinedEvent) {
      throw new ForbiddenException('User is not joined to this event');
    }

    // Remove the user from the event
    await this.prisma.usersOnEvents.delete({
      where: {
        userId_eventId: {
          userId,
          eventId,
        },
      },
    });

    await this.prisma.userActivity.create({
      data: {
        userId,
        activity: 'Left event',
      },
    });

    return { message: 'Successfully left the event' };
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
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        status: true,
        role: true,
        profile_url: true,
        gender: true,
        cityId: true,
        universityId: true,
        createdAt: true,
      },
    });

    await this.prisma.userActivity.create({
      data: {
        userId: id,
        activity: `User profile updated: ${updatedUser.first_name} ${updatedUser.last_name}`,
      },
    });

    return updatedUser;
  }

  async updateAdmin(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        status: true,
        profile_url: true,
        gender: true,
        createdAt: true,
      },
    });

    await this.prisma.userActivity.create({
      data: {
        userId: id,
        activity: 'Updated profile',
      },
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
    const bookmark = this.prisma.bookmark.create({
      data: {
        user: { connect: { id: userId } },
        blog: { connect: { id: blogId } },
      },
    });

    await this.prisma.userActivity.create({
      data: {
        userId,
        activity: `Blog post bookmarked`,
      },
    });

    return bookmark;
  }

  async addEventBookmark(
    userId: string,
    eventId: string,
  ): Promise<EventBookmark> {
    const existingBookmark = await this.prisma.eventBookmark.findUnique({
      where: {
        userId_eventId: {
          userId,
          eventId,
        },
      },
    });

    if (existingBookmark) {
      throw new Error('Bookmark already exists');
    }

    // Create a new bookmark
    const bookmark = this.prisma.eventBookmark.create({
      data: {
        userId,
        eventId,
      },
    });

    await this.prisma.userActivity.create({
      data: {
        userId,
        activity: `Event bookmarked`,
      },
    });

    return bookmark;
  }

  async getUserBookmarks(userId: string): Promise<Bookmark[]> {
    return this.prisma.bookmark.findMany({
      where: { userId },
      include: { blog: true },
    });
  }

  async getUserEventsBookmarks(userId: string): Promise<EventBookmark[]> {
    return this.prisma.eventBookmark.findMany({
      where: { userId },
      include: { event: true },
    });
  }

  async getUserJoinedEvents(userId: string): Promise<Event[]> {
    const userEvents = await this.prisma.usersOnEvents.findMany({
      where: {
        userId: userId,
      },
      include: {
        event: true,
      },
    });

    return userEvents.map((userEvent) => userEvent.event);
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

  async getUserMetrics(userId: string) {
    try {
      const registeredEvents = await this.prisma.usersOnEvents.count({
        where: {
          userId,
        },
      });

      const bookmarkedPosts = await this.prisma.bookmark.count({
        where: {
          userId,
        },
      });

      const totalBlogViews = await this.prisma.blog.aggregate({
        _sum: {
          views: true,
        },
      });

      const engagementRate =
        bookmarkedPosts > 0
          ? ((totalBlogViews._sum.views || 0) + bookmarkedPosts) /
            bookmarkedPosts
          : 0;

      return {
        registerd_events: registeredEvents,
        bookmarked_posts: bookmarkedPosts,
        engagement_rate: engagementRate,
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new ForbiddenException('Error while trying to fetch metrics');
      } else if (error instanceof PrismaClientInitializationError) {
        throw new InternalServerErrorException(
          'Server error - please try again later',
        );
      }

      throw error;
    }
  }

  async removeEventBookmark(
    userId: string,
    eventId: string,
  ): Promise<EventBookmark> {
    return this.prisma.eventBookmark.delete({
      where: {
        userId_eventId: {
          userId,
          eventId,
        },
      },
    });
  }

  async getUserActivities(userId: string): Promise<UserActivity[]> {
    return this.prisma.userActivity.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
