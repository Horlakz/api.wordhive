import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  fullname: string;

  @IsString()
  @IsNotEmpty()
  message: string;
}
