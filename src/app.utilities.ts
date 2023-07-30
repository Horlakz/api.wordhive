import { Injectable } from '@nestjs/common';
import slugify from 'slugify';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AppUtilities {
  public static transformFilename(originalfilename) {
    const timestamp = new Date().getTime();
    const ext = originalfilename.split('.').pop().toLocaleLowerCase();
    const filename = originalfilename.split('.').slice(0, -1).join('.');
    const slug = slugify(filename, { lower: true, strict: true });

    return `${timestamp}-${slug}.${ext}`;
  }

  public static async generateHash(text: string): Promise<string> {
    const saltRound = 12;
    const salt: string = await bcrypt.genSalt(saltRound);

    return await bcrypt.hash(text, salt);
  }

  public static async validateHash(
    text: string,
    hash: string,
  ): Promise<boolean> {
    return await bcrypt.compare(text, hash);
  }

  public static generateRandomNumber(length: number = 6): string {
    const digits = '0123456789';
    let otp = '';
    for (let i = 1; i <= length; i++) {
      const index = Math.floor(Math.random() * digits.length);
      otp = otp + digits[index];
    }
    return otp;
  }

  public static generateRandomString(length: number = 6): string {
    const digits = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let digit = '';
    for (let i = 1; i <= length; i++) {
      const index = Math.floor(Math.random() * digits.length);
      digit = digit + digits[index];
    }
    return digit;
  }
}
