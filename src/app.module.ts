import { Module } from '@nestjs/common';
import { AdminModule } from './admin/admin.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SellerModule } from './seller/Seller.module';
import {BuyerModule} from './buyer/buyer.module';
import { ModeratorModule } from './moderator/moderator.module';

@Module({
  imports: [AdminModule,SellerModule, BuyerModule, ModeratorModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
