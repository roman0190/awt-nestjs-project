// buyer.entity
// buyer.controller.ts
import { Controller, Post, Body, Param, Get, Delete, UsePipes, ValidationPipe, UploadedFile, Res, UseGuards, Query, UseInterceptors, Put, InternalServerErrorException } from '@nestjs/common';
import { BuyerService } from './buyer.service';
import { Buyer } from './buyer.entity';
import {Order} from './order.entity';
import {Address} from './address.entity';
//import { BuyerDto, loginDTO } from './buyer.dto';
import { BuyerDto, loginDTO, addressDto, orderDto } from "./buyer.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { MulterError, diskStorage } from "multer";
import { AuthGuard } from './auth/auth.guard';


@Controller('buyer')
export class BuyerController {
  orderService: any;
  addressService: any;
  constructor(private readonly buyerService: BuyerService) {}

  //@UseGuards(AuthGuard)
    @Get()
    async getUsers(): Promise<Buyer[]> {
      try {
        return this.buyerService.getUsers();
      } catch (error) {
        throw new InternalServerErrorException("Failed to fetch users");
      }
    }

    @Get('users/:id')
    async getUsersById(@Param('id') id: number): Promise<object> {
      try {
        return await this.buyerService.getUsersById(id);
      } catch (error) {
        throw new InternalServerErrorException("Failed to fetch user by id");
      }
    }

    @Get('users/')
    async getUsersByNameAndId(@Query('name') name: string,
        @Query('id') id: string): Promise<object> {
          try {
            return await this.buyerService.getUsersByNameAndId(name, id);
          } catch (error) {
            throw new InternalServerErrorException("Failed to fetch users by name and id");
          }
    }

    @Post('addbuyer')
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
    async addUser(@Body() myobj: BuyerDto, @UploadedFile() myfile: Express.Multer.File): Promise<BuyerDto> {
        myobj.filename = myfile.filename;
        return this.buyerService.addBuyer(myobj);
    }

    @Get('/getimage/:name')
    getImages(@Param('name') name: string, @Res() res) {
        res.sendFile(name, { root: './upload' })
    }

  @Post()
  @UsePipes(new ValidationPipe)
  async createBuyer(@Body() buyer: BuyerDto): Promise<BuyerDto> {
    return this.buyerService.createBuyer(buyer);
  }

  @Post(':buyerId/phone/:newPhoneNumber')
  async modifyPhoneNumber(@Param('buyerId') buyerId: number, @Param('newPhoneNumber') newPhoneNumber: string): Promise<BuyerDto> {
    return this.buyerService.modifyPhoneNumber(buyerId, newPhoneNumber);
  }

  @Get('null-fullname')
  async getBuyerWithNullFullName(): Promise<Buyer[]> {
    return this.buyerService.getBuyerWithNullFullName();
  }

  @Delete(':buyerId')
  async deleteUser(@Param('buyerId') buyerId: number): Promise<void> {
    await this.buyerService.deleteBuyer(buyerId);
  }


  // order
  @Post('order')
  @UsePipes(new ValidationPipe())
  async createOrder(@Body() orderDto: orderDto): Promise<Order> {
    const id=1
    return this.buyerService.createOrder(orderDto, id);
  }

  @Get()
  async getAllOrders(): Promise<Order[]> {
    return this.buyerService.getAllOrders();
  }

  @Get(':id')
  async getOrderById(@Param('id') id: number): Promise<Order> {
    return this.buyerService.getOrderById(id);
  }

  @Put(':id')
  async updateOrder(@Param('id') id: number, @Body() orderDto: orderDto): Promise<Order> {
    return this.buyerService.updateOrder(id, orderDto);
  }

  @Delete(':id')
  async deleteOrder(@Param('id') id: number): Promise<void> {
    return this.buyerService.deleteOrder(id);
  }


  // Address

  @Post('address')
  async createAddress(@Body() addressDto: addressDto): Promise<Address> {
    return this.buyerService.createAddress(addressDto);
  }

  @Get()
  async getAllAddresses(): Promise<Address[]> {
    return this.buyerService.getAllAddresses();
  }

  @Get(':id')
  async getAddressById(@Param('id') id: number): Promise<Address> {
    return this.buyerService.getAddressById(id);
  }

  @Put(':id')
  async updateAddress(@Param('id') id: number, @Body() addressDto: addressDto): Promise<Address> {
    return this.buyerService.updateAddress(id, addressDto);
  }

  @Delete(':id')
  async deleteAddress(@Param('id') id: number): Promise<void> {
    return this.buyerService.deleteAddress(id);
  }



}
