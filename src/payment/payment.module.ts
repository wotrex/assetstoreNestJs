import { Module } from "@nestjs/common";
import { StripeModule } from "nestjs-stripe";
import { AssetsModule } from "src/assets/assets.module";
import { UsersModule } from "src/users/users.module";
import { PaymentController } from "./payment.controller";
import { PaymentService } from "./payment.service";

@Module({
    imports: [StripeModule.forRoot({
        apiKey: 'sk_test_51IvG6CI90no2RL3hvYAvWr67fLSUaTsRIXkN9b4DiiI9t6xDM9DDpuS1R37p6wUr1zxDdvdZUpg4qDwNFwGtslX500CRZornnE',
        apiVersion: '2020-08-27',
      }), UsersModule, AssetsModule],
    providers: [PaymentService],
    controllers: [PaymentController],
    exports: [PaymentService]
  })
  export class PaymentModule {}