import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GigEntity } from '../gigs/gig.entity';
import { SellerEntity } from '../seller.entity';
import { PortfolioController } from './portfolio.controller';
import { PortfolioEntity } from './portfolio.entity';
import { PortfolioService } from './portfolio.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([GigEntity, SellerEntity, PortfolioEntity]),
  ],
  controllers: [PortfolioController],
  providers: [PortfolioService],
})
export class PortfolioModule {}
