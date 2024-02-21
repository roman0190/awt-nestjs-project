import { Module } from '@nestjs/common';
import { SellerController } from './seller.controller';
import { SellerService } from './seller.service';
import { SellerAuthModule } from './sellerAuth/sellerAuth.module';

@Module({
  imports: [SellerAuthModule],
  controllers: [SellerController],
  providers: [SellerService],
})
export class SellerModule {}
