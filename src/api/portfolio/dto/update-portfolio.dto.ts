import { PartialType } from '@nestjs/mapped-types';

import { CreateShowcaseDto } from './create-portfolio.dto';

export class UpdateShowcaseDto extends PartialType(CreateShowcaseDto) {}
