// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RequestLog } from './entities/request-log.entity';
import { ProxyService } from './services/proxy.service';
import { YoutubeService } from './services/youtube.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [RequestLog],
        synchronize: true, // Chỉ dùng cho development
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([RequestLog]),
  ],
  providers: [ProxyService, YoutubeService],
  exports: [YoutubeService],
})
export class AppModule {}