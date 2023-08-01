import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BaseSubscriber } from './subscribers/base.subscriber';
import { BlogSubscriber } from './subscribers/blog.subscriber';
import { PaymentSubscriber } from './subscribers/payment.subscriber';
import { UserSubscriber } from './subscribers/user.subscriber';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        subscribers: [
          BaseSubscriber,
          UserSubscriber,
          BlogSubscriber,
          PaymentSubscriber,
        ],
        autoLoadEntities: true,
        synchronize: true,
        ssl: configService.get('DB_SSL') === 'true',
      }),
    }),
  ],
})
export class DatabaseModule {}
