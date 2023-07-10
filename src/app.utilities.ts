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
}
