import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PaymentModule } from './payment/payment.module';
import { AssetsModule } from './assets/assets.module';
import { ChatModule } from './websocket/chat.module';

@Module({
  imports: [ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: 'mongodb+srv://chartsuser:dOmd4lpIamSl921i@mongodbcharts.w3h6u.mongodb.net/',
      database: "AssetStoreDB",
      entities: [
        __dirname + '/**/*.entity{.ts,.js}',
      ],
      ssl: true,
      useUnifiedTopology: true,
      useNewUrlParser: true
    }),
    TypeOrmModule.forFeature(),
    UsersModule, AuthModule, PaymentModule, AssetsModule, ChatModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
