import { Injectable, Logger, NotFoundException } from '@nestjs/common';
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

    // Handle error if user does not exist
    if (!user) {
      this.logger.log(`User with ID ${userId} not found`);
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Update the user with the provided data and set status to true
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        ...onboardUserDto,
        status: true,
      },
    });
  }

  findAll() {
    return `This action returns all users`;
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
