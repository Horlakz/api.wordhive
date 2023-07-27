import { Controller, Get, Param, StreamableFile } from '@nestjs/common';

import { MediaService } from './media.service';
import { Public } from '@/common/decorators/auth.public.decorator';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Public()
  @Get(':key/:filename')
  async streamFile(
    @Param('key') key: string,
    @Param('filename') filename: string,
  ) {
    const file = await this.mediaService.stream(key + '/' + filename);
    return new StreamableFile(file);
  }
}
