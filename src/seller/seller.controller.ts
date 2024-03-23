import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { Request } from 'express';
import { Public } from './auth/constants';
import { errorResponse } from './functions/errorResponse';
import {
  SellerSignInDto,
  SellerSignUpDto,
  UpdateSellerDto,
} from './seller.dto';
import { SellerService } from './seller.service';

@Controller('seller')
export class SellerController {
  constructor(private readonly sellerService: SellerService) {}

  @Public()
  @Post('register')
  @UsePipes(new ValidationPipe())
  async sellerSignUp(@Body() signInBody: SellerSignUpDto) {
    try {
      return await this.sellerService.sellerSignUp(signInBody);
    } catch (error) {
      return errorResponse(error);
    }
  }
  @Public()
  @Post('login')
  @UsePipes(new ValidationPipe())
  async sellerSignIn(@Body() signInBody: SellerSignInDto) {
    try {
      return await this.sellerService.sellerSignIn(signInBody);
    } catch (error) {
      return errorResponse(error);
    }
  }

  @Get()
  @Public()
  findAll() {
    return this.sellerService.findAll();
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.sellerService.findOne(+id);
  }

  @Patch('update')
  @UsePipes(new ValidationPipe())
  async update(
    @Req() req: Request | any,
    @Param('id') id: string,
    @Body() updateSellerDto: UpdateSellerDto,
  ) {
    try {
      const { userId } = req.user;

      return await this.sellerService.update(userId, updateSellerDto);
    } catch (error) {
      return errorResponse(error);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return await this.sellerService.remove(+id);
    } catch (error) {
      return errorResponse(error);
    }
  }

  @Delete('logout')
  async logout(@Req() req) {
    return await this.sellerService.logout();
  }
}
