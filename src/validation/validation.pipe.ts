import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import { SKIPVALIDATION } from '@/common/decorators/skip-validation.decorator';

@Injectable()
export class ValidationPipe implements PipeTransform {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    // Check if the class has the SkipValidation decorator
    const skipValidation = Reflect.getMetadata(SKIPVALIDATION, metatype);
    if (skipValidation) {
      return value;
    }

    if (value.volumes) return value;

    const object = plainToInstance(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      const obj = errors[0].constraints;

      throw new BadRequestException(obj[this.firstObjKey(obj)]);
    }
    return value;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }

  private firstObjKey(obj: any): string {
    return Object.keys(obj)[0];
  }
}
