import { Global, Module, type Provider } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { AwsS3Service } from './services/aws-s3.service';
import { EmailService } from './services/email.service';
import { PaystackService } from './services/paystack.service';

const providers: Provider[] = [AwsS3Service, EmailService, PaystackService];

@Global()
@Module({ imports: [HttpModule], providers, exports: [...providers] })
export class SharedModule {}
