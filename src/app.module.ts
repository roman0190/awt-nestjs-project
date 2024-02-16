import { Module } from '@nestjs/common';
import { AdminModule } from './admin/admin.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SellerModule } from './seller/Seller.module';

@Module({
  imports: [AdminModule,SellerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
