import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsString()
  serviceId: string;

  @IsNotEmpty()
  @IsString()
  serviceVolume: string;

  @IsNotEmpty()
  @IsString()
  serviceQuality: string;

  // @IsNotEmpty()
  // @IsNumber()
  // price: number;
}
