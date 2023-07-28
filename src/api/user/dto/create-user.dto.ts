import {
  IsString,
  MaxLength,
  IsEmail,
  IsNotEmpty,
  IsBoolean,
} from 'class-validator';

export class UserDto {
  @IsString()
  @MaxLength(64)
  fullname: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsBoolean()
  isAdmin: boolean;
}
