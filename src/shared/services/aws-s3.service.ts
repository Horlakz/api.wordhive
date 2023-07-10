import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AppUtilities } from '@/app.utilities';

@Injectable()
export class AwsS3Service {
  constructor(private configService: ConfigService) {}

  private client = new S3Client({
    region: this.configService.get<string>('AWS_BUCKET_REGION'),
    credentials: {
      accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY'),
      secretAccessKey: this.configService.get<string>('AWS_SECRET_KEY'),
    },
  });

  async upload(file: Express.Multer.File) {
    const uploadParams = {
      Bucket: this.configService.get<string>('AWS_BUCKET_NAME'),
      Body: file.buffer,
      Key: this.generateKey(file.originalname),
    };

    const command = new PutObjectCommand(uploadParams);

    return await this.client.send(command);
  }

  async stream(fileKey: string) {
    const downloadParams = {
      Key: fileKey,
      Bucket: this.configService.get<string>('AWS_BUCKET_NAME'),
    };

    const command = new GetObjectCommand(downloadParams);

    return await this.client.send(command);
  }

  async delete(fileKey: string) {
    const deleteParams = {
      Key: fileKey,
      Bucket: this.configService.get<string>('AWS_BUCKET_NAME'),
    };
    const command = new DeleteObjectCommand(deleteParams);

    return await this.client.send(command);
  }

  generateKey(originalfilename: string) {
    const folder = this.configService.get<string>('AWS_BUCKET_BASE_FOLDER');
    const newFilename = AppUtilities.transformFilename(originalfilename);

    return `${folder}/${newFilename}`;
  }
}
