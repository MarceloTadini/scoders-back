import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ProductModule } from './product/product.module';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-ioredis';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './shared/interceptors/logging.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://localhost:27017/default-db'),
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      url: process.env.REDIS_URL || 'redis://localhost:6379',
    }),
    JwtModule.register({
      global: true,
      secret: process.env.API_SECRET,
      signOptions: { expiresIn: '10m' },
    }),
    UserModule,
    AuthModule,
    ProductModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
