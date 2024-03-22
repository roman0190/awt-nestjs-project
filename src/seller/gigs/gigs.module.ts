import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SellerEntity } from '../seller.entity';
import { GigEntity } from './gig.entity';
import { GigsController } from './gigs.controller';
import { GigsService } from './gigs.service';

@Module({
  imports: [TypeOrmModule.forFeature([GigEntity, SellerEntity])],
  controllers: [GigsController],
  providers: [GigsService],
})
export class GigsModule {}
