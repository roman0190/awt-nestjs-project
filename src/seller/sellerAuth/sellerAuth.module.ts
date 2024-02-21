import { Module } from '@nestjs/common';
import { SellerAuthController } from './sellerAuth.controller';
import { SellerAuthService } from './sellerAuth.service';

@Module({
  imports: [],
  controllers: [SellerAuthController],
  providers: [SellerAuthService],
})
export class SellerAuthModule {}
