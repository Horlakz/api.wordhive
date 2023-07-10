import { Injectable } from '@nestjs/common';

import { AwsS3Service } from '@/shared/services/aws_s3.service';
import { Readable } from 'stream';

@Injectable()
export class MediaService {
  constructor(private readonly awsS3Service: AwsS3Service) {}

  async upload(file: Express.Multer.File) {
    return await this.awsS3Service.upload(file);
  }

  async stream(fileKey: string) {
    const file = await this.awsS3Service.stream(fileKey);
    return file.Body as Readable;
  }

  async delete(fileKey: string) {
    return await this.awsS3Service.delete(fileKey);
  }

  generateKey(originalName: string) {
    return this.awsS3Service.generateKey(originalName);
  }
}
