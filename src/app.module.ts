import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminModule } from './admin/admin.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BuyerModule } from './buyer/buyer.module';
import { ModeratorModule } from './moderator/moderator.module';
import { SellerModule } from './seller/seller.module';

@Module({
  imports: [
    AdminModule,
    BuyerModule,
    ModeratorModule,
    SellerModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'admin',
      database: 'talent-trades', //Change to your database name
      autoLoadEntities: true,
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
