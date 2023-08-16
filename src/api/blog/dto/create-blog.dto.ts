import { IsEmpty, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateBlogDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  body: string;

  @IsEmpty()
  // @IsUUID('all', { each: true })
  tags: string[];

  @IsNotEmpty()
  @IsUUID()
  category: string;
}
