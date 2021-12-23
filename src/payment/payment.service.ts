import { Injectable } from "@nestjs/common";
import { InjectStripe } from "nestjs-stripe";
import { AssetsService } from "src/assets/asset.service";
import { Assets } from "src/assets/assets.entity";
import { User } from "src/users/user.entity";
import { UsersService } from "src/users/users.service";
import Stripe from 'stripe';

@Injectable()
export class PaymentService {
    constructor(
        @InjectStripe()
        private readonly stripeClient: Stripe,
        private readonly userService: UsersService,
        private readonly assetsService: AssetsService
    ) {}
    async createSession(productId: string, username: string) {
        let prod: Assets = await this.assetsService.getById(productId);
        const product = await this.stripeClient.products.create({name :prod.name})
        const price = await this.stripeClient.prices.create({
            unit_amount: prod.cost,
            currency: 'uah',
            product: product.id,
          })
        const session = await this.stripeClient.checkout.sessions.create({
            success_url: 'https://example.com/success',
            cancel_url: 'https://example.com/cancel',
            line_items: [
                {price: price.id, quantity: 1},
            ],
            mode: 'payment',
            client_reference_id: username,
            metadata: {"productId": productId}
            });
        return session;
    }

    async cancelSession(id: string) {
        const session = await this.stripeClient.checkout.sessions.expire(id);
        return session;
    }
    async successSession(id: string) {
        const session = await this.stripeClient.checkout.sessions.retrieve(id);
        if(session.status == "complete"){
            let user: User = await this.userService.getByUsername(session.client_reference_id)
            user.items.push(session.metadata['productId'])           
            return this.userService.update(user,session.client_reference_id);
        }
    }
    
}