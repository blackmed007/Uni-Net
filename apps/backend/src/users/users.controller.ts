import {
  Controller,
  Get,
  Body,
  // Patch,
  Param,
  Delete,
  Post,
  UseGuards,
  Request,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
// import { UpdateUserDto } from './dto/update-user.dto';
import { OnboardUserDto } from './dto/onboard-user.dto';
import { JwtGuard } from 'src/auth/guard';
import { Request as ExpressRequest } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('onboard')
  @UseGuards(JwtGuard)
  onboard(
    @Request() req: ExpressRequest,
    @Body() onboardUserDto: OnboardUserDto,
  ) {
    const userId = (req.user as { id: string }).id;

    if (!userId) {
      throw new NotFoundException('User not found');
    }

    return this.usersService.onboard(userId, onboardUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(+id, updateUserDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
