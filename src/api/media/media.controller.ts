import { Controller, Get, Param, StreamableFile } from '@nestjs/common';

import { MediaService } from './media.service';
import { Public } from '@/common/decorators/auth.public.decorator';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Public()
  @Get(':key')
  async streamFile(@Param('key') key: string) {
    const file = await this.mediaService.stream(key);
    return new StreamableFile(file);
  }
}
