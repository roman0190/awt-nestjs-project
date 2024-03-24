// buyer.entity
// buyer.controller.ts
import { Controller, Post, Body, Param, Get, Delete, UsePipes, ValidationPipe, UploadedFile, Res, UseGuards, Query, UseInterceptors, Put, InternalServerErrorException, Session, NotFoundException } from '@nestjs/common';
import { BuyerService } from './buyer.service';
import { Buyer } from './buyer.entity';
import {Order} from './order.entity';
import {Address} from './address.entity';
//import { BuyerDto, loginDTO } from './buyer.dto';
import { BuyerDto, loginDTO, addressDto, orderDto } from "./buyer.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { MulterError, diskStorage } from "multer";
import { AuthGuard } from './auth/auth.guard';
import { SessionGuard } from './session.guard';
import session from 'express-session';


@Controller('buyer')
export class BuyerController {
  //orderService: any;
  //addressService: any;
  constructor(private readonly buyerService: BuyerService) {}



  /*@Post('addbuyer')
  @UseInterceptors(FileInterceptor('myfile',
      {
          fileFilter: (req, file, cb) => {
              if (file.originalname.match(/^.*\.(jpg|webp|png|jpeg)$/))
                  cb(null, true);
              else {
                  cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);
              }
          },
          limits: { fileSize: 30000 },
          storage: diskStorage({
              destination: './upload',
              filename: function (req, file, cb) {
                  cb(null, Date.now() + file.originalname)
              },
          })
      }
  ))
  @UsePipes(new ValidationPipe)
  async addBuyer(@Body() myobj: BuyerDto, @UploadedFile() myfile: Express.Multer.File): Promise<BuyerDto> {
      myobj.filename = myfile.filename;
      return this.buyerService.addBuyer(myobj);
  }*/


@Get('index')
@UseGuards(AuthGuard)
//@UseGuards(SessionGuard)
getIndex(@Session() session) {
console.log(session.email);
  return this.buyerService.getAll();
  
}


@Put('updatebuyer')
@UseGuards(SessionGuard)
@UsePipes(new ValidationPipe())
updateBuyer(
  @Session() session,
  @Body() updateData: { name?: string, phone?: string } 
): any {
  console.log(session.email);
  return this.buyerService.updateBuyer(session.email, updateData);
}


@Delete(':buyerId')
async deleteUser(@Param('buyerId') buyerId: number): Promise<void> {
  await this.buyerService.deleteBuyer(buyerId);
}


// order
@Post('order')
@UseGuards(SessionGuard)
@UsePipes(new ValidationPipe())
async createOrder(@Session() session, @Body() orderDto: orderDto): Promise<Order> {
  try {
    return await this.buyerService.createOrder(orderDto, session.email);
  } catch (error) {
    throw new InternalServerErrorException('Failed to create order');
  }
}

@Get('allorder')
@UseGuards(SessionGuard)
async getAllOrders(): Promise<Order[]> {
  try {
    return await this.buyerService.getAllOrders();
  } catch (error) {
    throw new InternalServerErrorException('Failed to fetch all orders');
  }
}

@Get('order/:id')
@UseGuards(SessionGuard)
async getOrderById(@Param('id') id: number): Promise<Order> {
  try {
    const order = await this.buyerService.getOrderById(id);
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  } catch (error) {
    throw new InternalServerErrorException('Failed to fetch order by ID');
  }
}

/*@Put('updateorder')
@UseGuards(SessionGuard)
async updateOrder(@Session() session, @Body() orderDto: orderDto): Promise<object> {
  try {
    return await this.buyerService.updateOrder(session.email, orderDto);
  } catch (error) {
    throw new InternalServerErrorException('Failed to update order');
  }
}*/


// @Get('order')
// @UseGuards(SessionGuard)
// async getOrder(@Session() session): Promise<Order> {
//   try {
//     const order = await this.buyerService.getOrderByEmail(session.email);
//     if (!order) {
//       throw new NotFoundException(`Order for user with email ${session.email} not found`);
//     }
//     return order;
//   } catch (error) {
//     throw new InternalServerErrorException('Failed to fetch order by email');
//   }
// }

// @Put('updateorder')
// @UseGuards(SessionGuard)
// async updateOrder(@Session() session, @Body() orderDto: orderDto): Promise<Order> {
//   try {
//     return await this.buyerService.updateOrder(session.email, orderDto);
//   } catch (error) {
//     throw new InternalServerErrorException('Failed to update order');
//   }
// }

@Put('updateorder/:id')
@UseGuards(SessionGuard)
async update(@Param('id') id:number, @Body() orderDto: orderDto): Promise<Order> {
  try {
    return await this.buyerService.updateOrder(id, orderDto);
  } catch (error) {
    throw new InternalServerErrorException('Failed to update address');
  }
}



@Delete(':id')
@UseGuards(SessionGuard)
async deleteOrder(@Param('id') id: number): Promise<void> {
  try {
    await this.buyerService.deleteOrder(id);
  } catch (error) {
    throw new InternalServerErrorException('Failed to delete order');
  }
}


// Address

@Post('address')
@UsePipes(new ValidationPipe())
@UseGuards(SessionGuard)
async createAddress(@Session() session,@Body() addressDto: addressDto): Promise<Address> {
  try {
    //const id = 1;
    return await this.buyerService.createAddress(addressDto, session.email);
  } catch (error) {
    throw new InternalServerErrorException('Failed to create address');
  }
}

@Get('alladdress')
@UseGuards(SessionGuard)
async getAllAddresses(): Promise<Address[]> {
  try {
    return await this.buyerService.getAllAddresses();
  } catch (error) {
    throw new InternalServerErrorException('Failed to fetch all addresses');
  }
}

@Get('address/:id')
@UseGuards(SessionGuard)
async getAddressById(@Param('id') id: number): Promise<Address> {
  try {
    const address = await this.buyerService.getAddressById(id);
    if (!address) {
      throw new NotFoundException(`Address with ID ${id} not found`);
    }
    return address;
  } catch (error) {
    throw new InternalServerErrorException('Failed to fetch address by ID');
  }
}

@Put('updateaddress/:id')
@UseGuards(SessionGuard)
async updateAddress(@Param('id') id:number, @Body() addressDto: addressDto): Promise<Address> {
  try {
    return await this.buyerService.updateAddress(id, addressDto);
  } catch (error) {
    throw new InternalServerErrorException('Failed to update address');
  }
}




// @Get('address')
// @UseGuards(SessionGuard)
// async getAddress(@Session() session): Promise<Address> {
//   try {
//     const address = await this.buyerService.getAddressByEmail(session.email);
//     if (!address) {
//       throw new NotFoundException(`Address for user with email ${session.email} not found`);
//     }
//     return address;
//   } catch (error) {
//     throw new InternalServerErrorException('Failed to fetch address by email');
//   }
// }

// @Put('updateaddress')
// @UseGuards(SessionGuard)
// async updateAddress(@Session() session, @Body() addressDto: addressDto): Promise<Address> {
//   try {
//     return await this.buyerService.updateAddress(session.email, addressDto);
//   } catch (error) {
//     throw new InternalServerErrorException('Failed to update address');
//   }
// }

@Delete(':id')
@UseGuards(SessionGuard)
async deleteAddress(@Param('id') id: number): Promise<void> {
  try {
    await this.buyerService.deleteAddress(id);
  } catch (error) {
    throw new InternalServerErrorException('Failed to delete address');
  }
}



}
