import { PartialType } from '@nestjs/mapped-types';
import { OnboardUserDto } from './onboard-user.dto';

export class UpdateUserDto extends PartialType(OnboardUserDto) {}
