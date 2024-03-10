import { Module } from '@nestjs/common';
import { AdminModule } from './admin/admin.module';
import { SellerModule } from './seller/Seller.module';
import { BuyerModule } from './buyer/buyer.module';
import { TypeOrmModule } from '@nestjs/typeorm';


@Module({
  imports: [
    AdminModule,
    SellerModule,
    BuyerModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'roman',
      database: 'talent_trades', 
      autoLoadEntities: true,
      synchronize: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

