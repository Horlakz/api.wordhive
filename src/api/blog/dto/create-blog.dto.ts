import { IsString, IsArray, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateBlogDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  body: string;

  @IsNotEmpty()
  @IsUUID('all', { each: true })
  tags: string[];

  @IsNotEmpty()
  @IsUUID()
  category: string;
}
