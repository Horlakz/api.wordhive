import { IsString, MaxLength, IsEmail, IsNotEmpty } from 'class-validator';

export class RegisterDto {
  @IsString()
  @MaxLength(64)
  fullname: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
