import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { OnboardUserDto } from './dto/onboard-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly logger = new Logger(UsersService.name, {
    timestamp: true,
  });

  async onboard(userId: string, onboardUserDto: OnboardUserDto) {
    this.logger.log(onboardUserDto);

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

  async uploadImage(
    file: Express.Multer.File,
    userId: string,
  ): Promise<string> {
    const uploadPath = path.join(__dirname, '..', '..', 'uploads'); // Ensure this directory exists

    // Ensure the uploads directory exists
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }

    const imageName = `${Date.now()}-${userId}-${file.originalname}`;
    const filePath = path.join(uploadPath, imageName);

    console.log('loging the path');
    console.log(filePath);

    // Write the file to the filesystem
    fs.writeFileSync(filePath, file.buffer);

    // Return the URL to access the image
    return `http://localhost/api/v1/uploads/${imageName}`; // Adjust the URL as needed
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
