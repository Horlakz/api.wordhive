import { IsArray, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateShowcaseDto {
  @IsString()
  title: string;

  @IsString()
  body: string;

  image: Express.Multer.File;

  @IsUUID('all', { each: true })
  genre: string[];

  @IsUUID()
  field: string;
}
