import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  Post,
  UseGuards,
  Request,
  NotFoundException,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { OnboardUserDto } from './dto/onboard-user.dto';
import { JwtGuard } from 'src/auth/guard';
import { Request as ExpressRequest } from 'express';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('onboard')
  @UseGuards(JwtGuard)
  @UseInterceptors(FileInterceptor('profile_url')) // 'profile_url' is the name of the file input
  async onboard(
    @Request() req: ExpressRequest,
    @UploadedFile() file: Express.Multer.File,
    @Body() onboardUserDto: OnboardUserDto,
  ) {
    const userId = (req.user as { id: string }).id;

    if (!userId) {
      throw new NotFoundException('User not found');
    }
    if (file) {
      const profileUrl = await this.usersService.uploadImage(file, userId);
      onboardUserDto.profile_url = profileUrl; // Set the profile_url to the URL returned from uploadImage
    }

    return this.usersService.onboard(userId, onboardUserDto);
  }

  @Get('me')
  @UseGuards(JwtGuard)
  async getMe(@Request() req: ExpressRequest) {
    const userId = (req.user as { id: string }).id;
    return this.usersService.getCurrentUser(userId);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
