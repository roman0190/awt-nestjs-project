import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { AdminAuthModule } from './Auth/admin-auth/admin-auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from './entities/admin.entity';

@Module({
  imports: [AdminAuthModule,TypeOrmModule.forFeature([Admin])],
  providers: [AdminService],
  controllers: [AdminController]
})
export class AdminModule {}
