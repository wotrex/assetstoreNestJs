import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "src/users/users.module";
import { AssetsService } from "./asset.service";
import { AssetsController } from "./assets.controller";
import { Assets } from "./assets.entity";
import { Categories } from "./categories.entity";
import { CategoriesService } from "./categories.service";

@Module({
    imports: [TypeOrmModule.forFeature([Assets, Categories]), UsersModule,
    ClientsModule.register([
      { 
        name: 'HELLO_SERVICE', transport: Transport.RMQ,
        options: {
          urls: ['amqps://bsomqwfy:lop0UbcBOwi2X-AI9EbaNaQ5cVHAyWIt@roedeer.rmq.cloudamqp.com/bsomqwfy'],
          queue: 'assets',
          queueOptions: {
            durable: true
                },
          },
       },
     ]),],
    providers: [AssetsService, CategoriesService],
    controllers: [AssetsController],
    exports: [AssetsService, CategoriesService]
  })
  export class AssetsModule {}