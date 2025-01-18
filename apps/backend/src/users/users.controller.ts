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
  ForbiddenException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { OnboardUserDto } from './dto/onboard-user.dto';
import { JwtGuard } from 'src/auth/guard';
import { Request as ExpressRequest } from 'express';
import { UpdateUserDto } from './dto/update-user.dto';
import { JoinEventDto } from './dto/join-event.dto';
import { ImagesService } from 'src/images/images.service';
import { Bookmark } from '@prisma/client';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly imagessService: ImagesService,
  ) {}

  @Post('onboard')
  @UseGuards(JwtGuard)
  @UseInterceptors(FileInterceptor('profile_url'))
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
      const profileUrl = await this.imagessService.uploadImage(file, userId);
      onboardUserDto.profile_url = profileUrl;
    }

    return this.usersService.onboard(userId, onboardUserDto);
  }

  @Get('me')
  @UseGuards(JwtGuard)
  async getMe(@Request() req: ExpressRequest) {
    const userId = (req.user as { id: string }).id;
    return this.usersService.getCurrentUser(userId);
  }

  @Post('join-event')
  @UseGuards(JwtGuard)
  async joinEvent(
    @Request() req: ExpressRequest,
    @Body() joinEventDto: JoinEventDto,
  ) {
    const userId = (req.user as { id: string }).id;
    const role = (req.user as { role: string }).role;

    if (role === 'admin' && req.body.userId) {
      return this.usersService.joinEvent(req.body.userId, joinEventDto);
    }

    if (role === 'user') {
      return this.usersService.joinEvent(userId, joinEventDto);
    }

    throw new ForbiddenException(
      'You do not have permission to join this event',
    );
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
  @Post('bookmarks')
  @UseGuards(JwtGuard)
  async addBookmark(
    @Request() req: ExpressRequest,
    @Body('blogId') blogId: string,
  ): Promise<Bookmark> {
    const userId = (req.user as { id: string }).id;
    return this.usersService.addBookmark(userId, blogId);
  }

  @Get('bookmarks')
  @UseGuards(JwtGuard)
  async getUserBookmarks(@Request() req: ExpressRequest): Promise<Bookmark[]> {
    const userId = (req.user as { id: string }).id;
    return this.usersService.getUserBookmarks(userId);
  }

  @Get('events')
  @UseGuards(JwtGuard)
  async getUserEvents(@Request() req: ExpressRequest) {
    const userId = (req.user as { id: string }).id;
    return this.usersService.getUserJoinedEvents(userId);
  }

  @Delete('bookmarks/:blogId')
  @UseGuards(JwtGuard)
  async removeBookmark(
    @Request() req: ExpressRequest,
    @Param('blogId') blogId: string,
  ): Promise<Bookmark> {
    const userId = (req.user as { id: string }).id;
    return this.usersService.removeBookmark(userId, blogId);
  }
}
