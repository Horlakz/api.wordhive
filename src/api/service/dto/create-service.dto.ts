import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class Quality {
  @IsString()
  @IsNotEmpty()
  type: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;
}

export class Volume {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Quality)
  // @IsNotEmpty()
  qualities: Quality[];
}

export class CreateServiceDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  body: string;

  @IsString()
  @IsNotEmpty()
  icon: string;

  @IsUUID()
  category: string;

  @IsArray()
  // @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => Volume)
  volumes: Volume[];
}
