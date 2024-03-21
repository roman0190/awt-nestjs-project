// import {Module} from "@nestjs/common";
// import {BuyerService} from './buyer.service';
// import {BuyerController} from './buyer.controller';

// //import { BuyerEntity } from "./buyer.entity";
// import { buyerProfile } from './buyerProfile.entity';
// import { TypeOrmModule } from "@nestjs/typeorm";
// import { Buyer } from './buyer.entity';


// @Module({
//     imports:[TypeOrmModule.forFeature([BuyerEntity]),],
//     controllers:[BuyerController],
//     providers:[BuyerService],
// })
// export class BuyerModule{}


// buyer.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BuyerController } from './buyer.controller';
import { BuyerService } from './buyer.service';
import { Buyer } from './buyer.entity'; // Assuming you have a Buyer entity defined
import { Order } from './order.entity'; // Assuming you have a Buyer entity defined
import { Address } from './address.entity'; // Assuming you have a Buyer entity defined
import { JwtModule } from "@nestjs/jwt/dist/jwt.module";
import { AuthService } from "./auth/auth.service";


@Module({
  imports: [
    TypeOrmModule.forFeature([Buyer, Order, Address]),
    JwtModule.register({
      global: true,
      secret: "3NP_Backend_Admin",
      signOptions: { expiresIn: '30m' },
    }), // Importing the Buyer entity for use in the module
  ],
  controllers: [BuyerController], // Declaring the controller(s) belonging to this module
  providers: [BuyerService], // Declaring the service(s) belonging to this module
  exports: [BuyerService], // Exporting the service(s) to be used by other modules if needed
})
export class BuyerModule {}
