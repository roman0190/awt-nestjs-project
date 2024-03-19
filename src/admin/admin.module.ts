import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminRegEntity} from './entities/admin.entity';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { UserEntity } from './entities/user.entity';
import { GigEntity } from './entities/gig.entity';
import { AdditionalInfoEntity } from './entities/AdditionalInfo.entity';

@Module({
  imports: [AdminModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '30m' },
    }),TypeOrmModule.forFeature([AdminRegEntity,UserEntity,GigEntity,AdditionalInfoEntity])],
  providers: [AdminService],
  controllers: [AdminController]
})
export class AdminModule {}
