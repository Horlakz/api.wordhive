import { Global, Module, type Provider } from '@nestjs/common';

import { AwsS3Service } from './services/aws_s3.service';

const providers: Provider[] = [AwsS3Service];

@Global()
@Module({ providers, exports: [...providers] })
export class SharedModule {}
