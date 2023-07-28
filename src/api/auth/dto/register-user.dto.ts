import {
  IsEmail,
  IsEmpty,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';

export class RegisterUserDto {
  @IsString()
  @MaxLength(64)
  fullname: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsEmpty({ message: 'You are not authorized to set admin' })
  isAdmin: boolean;
}
