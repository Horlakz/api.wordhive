import { IsNotEmpty, IsString } from 'class-validator';

export class CreateIconDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  file: Express.Multer.File;
}
