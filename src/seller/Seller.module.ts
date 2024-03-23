import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { jwtConstants } from './auth/constants';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { JwtStrategy } from './auth/jwt.strategy';
import { SellerAuthGuard } from './auth/sellerAuth.guard';
import { SellerController } from './seller.controller';
import { SellerEntity } from './seller.entity';
import { SellerService } from './seller.service';

import { GigsModule } from './gigs/gigs.module';
import { SellerCredsEntity } from './sellerCreds.entity';
import { PortfolioModule } from './portfolio/portfolio.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SellerEntity, SellerCredsEntity]),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60d' },
    }),
    GigsModule,
    PortfolioModule,
  ],
  controllers: [SellerController],
  providers: [
    SellerService,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class SellerModule {}
