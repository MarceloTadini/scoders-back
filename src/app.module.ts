import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ProductModule } from './product/product.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://localhost:27017/default-db'),
    UserModule,
    AuthModule,
    ProductModule,
    JwtModule.register({
      global: true,
      secret: process.env.API_SECRET,
      signOptions: { expiresIn: '10m' },
    }),
  ],
})
export class AppModule {}