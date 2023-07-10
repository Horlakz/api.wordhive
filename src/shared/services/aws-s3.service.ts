import type {
  PutObjectCommandInput,
  DeleteObjectCommandInput,
  GetObjectCommandInput,
} from '@aws-sdk/client-s3';

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
  private readonly s3: S3Client;

  constructor(private configService: ConfigService) {
    this.s3 = new S3Client({
      region: this.configService.get<string>('AWS_BUCKET_REGION'),
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY'),
        secretAccessKey: this.configService.get<string>('AWS_SECRET_KEY'),
      },
    });
  }

  async upload(file: Express.Multer.File) {
    const uploadParams: PutObjectCommandInput = {
      Bucket: this.configService.get<string>('AWS_BUCKET_NAME'),
      Body: file.buffer,
      Key: this.generateKey(file.originalname),
    };

    const command = new PutObjectCommand(uploadParams);

    return await this.s3.send(command);
  }

  async stream(fileKey: string) {
    const downloadParams: GetObjectCommandInput = {
      Key: fileKey,
      Bucket: this.configService.get<string>('AWS_BUCKET_NAME'),
    };

    const command = new GetObjectCommand(downloadParams);

    return await this.s3.send(command);
  }

  async delete(fileKey: string) {
    const deleteParams: DeleteObjectCommandInput = {
      Key: fileKey,
      Bucket: this.configService.get<string>('AWS_BUCKET_NAME'),
    };
    const command = new DeleteObjectCommand(deleteParams);

    return await this.s3.send(command);
  }

  generateKey(originalfilename: string) {
    const folder = this.configService.get<string>('AWS_BUCKET_BASE_FOLDER');
    const newFilename = AppUtilities.transformFilename(originalfilename);

    return `${folder}/${newFilename}`;
  }
}
