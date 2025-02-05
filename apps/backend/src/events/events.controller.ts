import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseInterceptors,
  Request,
  Delete,
  UseGuards,
  UploadedFile,
  InternalServerErrorException,
} from '@nestjs/common';
import { EventService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImagesService } from 'src/images/images.service';
import { JwtGuard } from 'src/auth/guard';
import { Request as ExpressRequest } from 'express';

@Controller('events')
export class EventController {
  constructor(
    private readonly eventService: EventService,
    private readonly imagessService: ImagesService,
  ) {}

  @Post()
  @UseGuards(JwtGuard)
  async create(
    @Request() req: ExpressRequest,
    @Body() createEventDto: CreateEventDto,
  ) {
    const userId = (req.user as { id: string }).id;
    return this.eventService.create(userId, createEventDto);
  }

  @Get()
  findAll() {
    return this.eventService.findAll();
  }

  @Post('upload-event-image')
  @UseInterceptors(FileInterceptor('event_image'))
  async uploadEventImage(@UploadedFile() file: Express.Multer.File) {
    if (file) {
      const eventImageUrl = await this.imagessService.uploadImage(
        file,
        'event_image',
      );
      return { url: eventImageUrl };
    }
    throw new InternalServerErrorException(
      'Error while trying to upload event image',
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtGuard)
  update(
    @Param('id') id: string,
    @Request() req: ExpressRequest,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    const userId = (req.user as { id: string }).id;
    return this.eventService.update(userId, id, updateEventDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventService.remove(id);
  }
}
