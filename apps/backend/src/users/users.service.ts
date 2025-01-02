import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { OnboardUserDto } from './dto/onboard-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
// import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly logger = new Logger(UsersService.name, {
    timestamp: true,
  });

  async onboard(userId: string, onboardUserDto: OnboardUserDto) {
    // Fetch the user by ID
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

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
