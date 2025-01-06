import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseInterceptors,
  Delete,
  UploadedFile,
} from '@nestjs/common';
import { EventService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImagesService } from 'src/images/images.service';

@Controller('events')
export class EventController {
  constructor(
    private readonly eventService: EventService,
    private readonly imagessService: ImagesService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('event_image'))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createEventDto: CreateEventDto,
  ) {
    if (file) {
      const eventImageUrl = await this.imagessService.uploadImage(
        file,
        'event',
      );
      createEventDto.event_image_url = eventImageUrl;
    }
    return this.eventService.create(createEventDto);
  }

  @Get()
  findAll() {
    return this.eventService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventService.update(id, updateEventDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventService.remove(+id);
  }
}
