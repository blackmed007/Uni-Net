import { Module } from '@nestjs/common';
import { EventService } from './events.service';
import { EventController } from './events.controller';
import { ImagesService } from 'src/images/images.service';

@Module({
  controllers: [EventController],
  providers: [EventService, ImagesService],
})
export class EventModule {}
