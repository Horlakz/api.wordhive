import { Module } from '@nestjs/common';

import { AwsModule } from '@/config/aws/aws.module';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';

@Module({
  imports: [AwsModule],
  controllers: [MediaController],
  providers: [MediaService],
  exports: [MediaService],
})
export class MediaModule {}
