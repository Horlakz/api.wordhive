import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as hbs from 'nodemailer-express-handlebars';

import { MailOptions } from '@/common/interfaces/mail-options';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('EMAIL_HOST'),
      port: Number(this.configService.get('EMAIL_PORT')),
      secure: true,
      auth: {
        user: this.configService.get('EMAIL_USER'),
        pass: this.configService.get('EMAIL_PASS'),
      },
    });

    this.transporter.use(
      'compile',
      hbs({
        viewEngine: {
          extname: '.hbs',
          partialsDir: './src/templates/',
          layoutsDir: './src/templates/layouts/',
        },
        viewPath: './src/templates/',
        extName: '.hbs',
      }),
    );
  }

  async sendEmail(options: MailOptions) {
    try {
      if (!options.from) {
        options.from = `"Wordhive" <${this.configService.get('EMAIL_USER')}>`;
      }

      await this.transporter.sendMail(options);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
