import { Module } from '@nestjs/common';

import { AwsS3Service } from './aws_s3.service';

@Module({
  providers: [AwsS3Service],
  exports: [AwsS3Service],
})
export class AwsModule {}
