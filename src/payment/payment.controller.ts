import { Controller, Param, Post, Headers, UseGuards } from "@nestjs/common";
import { PaymentService } from "./payment.service";
import jwt_decode from "jwt-decode";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";

@Controller('payment')
export class PaymentController {
    constructor(
        private readonly paymentService: PaymentService
    ){}

    @UseGuards(JwtAuthGuard)
    @Post('create/:id')
    async createSession(@Param('id') id, @Headers() headers): Promise<any> {
        var decoded = jwt_decode(String(headers.authorization).replace("Bearer ", ""));
        return this.paymentService.createSession(id, decoded['username']);
    }
    @Post('cancel/:id')
    async cancelSession(@Param('id') id): Promise<any> {
        return this.paymentService.cancelSession(id);
    }
    @Post('success/:id')
    async successSession(@Param('id') id): Promise<any> {
        return this.paymentService.successSession(id);
    }
}