import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { Public } from './auth/constants';
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
      return this.errorResponse(error);
    }
  }
  @Public()
  @Post('login')
  @UsePipes(new ValidationPipe())
  async sellerSignIn(@Body() signInBody: SellerSignInDto) {
    try {
      return await this.sellerService.sellerSignIn(signInBody);
    } catch (error) {
      return this.errorResponse(error);
    }
  }

  @Get()
  findAll() {
    return this.sellerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sellerService.findOne(+id);
  }

  @Patch('update')
  @UsePipes(new ValidationPipe())
  async update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateSellerDto: UpdateSellerDto,
  ) {
    try {
      const { userId } = req.user;
      return await this.sellerService.update(userId, updateSellerDto);
    } catch (error) {
      return this.errorResponse(error);
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sellerService.remove(+id);
  }

  private errorResponse(error: any) {
    return {
      message: [error.message],
      error: 'Bad Request',
      statusCode: 400,
    };
  }
}
