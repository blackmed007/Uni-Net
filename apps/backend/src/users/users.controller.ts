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
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { OnboardUserDto } from './dto/onboard-user.dto';
import { JwtGuard } from 'src/auth/guard';
import { Request as ExpressRequest } from 'express';
import { UpdateUserDto } from './dto/update-user.dto';
import { JoinEventDto } from './dto/join-event.dto';
import { ImagesService } from 'src/images/images.service';
import { Bookmark, EventBookmark, UserActivity } from '@prisma/client';
import { SignupDto } from 'src/auth/dto/signup.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly imagessService: ImagesService,
  ) {}

  @Post('create')
  @UseGuards(JwtGuard)
  async create(
    @Request() req: ExpressRequest,
    @Body(new ValidationPipe()) createDto: SignupDto,
  ) {
    const role = (req.user as { role: string }).role;

    if (role === 'admin') {
      return this.usersService.create(createDto);
    }

    throw new ForbiddenException(
      'You do not have permission to join this event',
    );
  }

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
  @Post('leave-event')
  @UseGuards(JwtGuard)
  async leaveEvent(
    @Request() req: ExpressRequest,
    @Body() leaveEventDto: JoinEventDto,
  ) {
    const userId = (req.user as { id: string }).id;
    return this.usersService.leaveEvent(userId, leaveEventDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
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

  @Post('event-bookmarks')
  @UseGuards(JwtGuard)
  async addEventBookmark(
    @Request() req: ExpressRequest,
    @Body('eventId') eventId: string,
  ): Promise<EventBookmark> {
    const userId = (req.user as { id: string }).id;
    return this.usersService.addEventBookmark(userId, eventId);
  }

  @Get('event-bookmarks')
  @UseGuards(JwtGuard)
  async getUserEventsBookmarks(
    @Request() req: ExpressRequest,
  ): Promise<EventBookmark[]> {
    const userId = (req.user as { id: string }).id;
    return this.usersService.getUserEventsBookmarks(userId);
  }

  @Get('bookmarks')
  @UseGuards(JwtGuard)
  async getUserBookmarks(@Request() req: ExpressRequest): Promise<Bookmark[]> {
    const userId = (req.user as { id: string }).id;
    return this.usersService.getUserBookmarks(userId);
  }

  @Get('activity')
  @UseGuards(JwtGuard)
  async getUserActivity(
    @Request() req: ExpressRequest,
  ): Promise<UserActivity[]> {
    const userId = (req.user as { id: string }).id;
    return this.usersService.getUserActivities(userId);
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

  @Delete('event-bookmarks/:eventId')
  @UseGuards(JwtGuard)
  async removeEventBookmark(
    @Request() req: ExpressRequest,
    @Param('eventId') eventId: string,
  ): Promise<EventBookmark> {
    const userId = (req.user as { id: string }).id;
    return this.usersService.removeEventBookmark(userId, eventId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtGuard)
  @UseInterceptors(FileInterceptor('profile_url'))
  async update(
    @Param('id') id: string,
    // @Request() req: ExpressRequest,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    // const userId = (req.user as { id: string }).id;
    // const role = (req.user as { role: string }).role;

    // if (role === 'admin' && req.body.userId) {
    // }
    if (file) {
      const profileUrl = await this.imagessService.uploadImage(file, id);
      updateUserDto.profile_url = profileUrl;
    }

    return this.usersService.update(id, updateUserDto);
  }

  @Patch('admin/:id')
  updateAdmin(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateAdmin(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
