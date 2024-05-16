import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminRegEntity} from './entities/admin.entity';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { UserEntity } from './entities/user.entity';
require('dotenv').config()
import { GigEntity } from './entities/gig.entity';
import { AdditionalInfoEntity } from './entities/AdditionalInfo.entity';
import { AnnouncementEntity } from './entities/announcement.entity';
import { MailerModule } from '@nestjs-modules/mailer';  
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
@Module({
  imports: [AdminModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '3000m' },
    }),TypeOrmModule.forFeature([AdminRegEntity,UserEntity,GigEntity,AdditionalInfoEntity,AnnouncementEntity]),

    MailerModule.forRoot({
      transport: {
        host: process.env.EMAIL_HOST,
        auth: {
          user: process.env.EMAIL_ID,
          pass: process.env.EMAIL_PASS,
        },
      },
      defaults: {
        from:'"nest-modules" <cartoonworld517@gmail.com>',
      },
      template: {
        dir: process.cwd() + '/templates/',
        adapter: new PugAdapter(), 
        options: {
          strict: true,
        },
      },
    }),
  ],
    
  providers: [AdminService],
  controllers: [AdminController]
})
export class AdminModule {}
