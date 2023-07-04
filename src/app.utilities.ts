import { Injectable } from '@nestjs/common';
import slugify from 'slugify';

@Injectable()
export class AppUtilities {
  public static transformFilename(originalfilename) {
    const timestamp = new Date().getTime();
    const ext = originalfilename.split('.').pop().toLocaleLowerCase();
    const filename = originalfilename.split('.').slice(0, -1).join('.');
    const slug = slugify(filename, { lower: true, strict: true });

    return `${timestamp}-${slug}.${ext}`;
  }
}
