import { Global, Module, type Provider } from '@nestjs/common';

import { AwsS3Service } from './services/aws-s3.service';
import { EmailService } from './services/email.service';

const providers: Provider[] = [AwsS3Service, EmailService];

@Global()
@Module({ providers, exports: [...providers] })
export class SharedModule {}
