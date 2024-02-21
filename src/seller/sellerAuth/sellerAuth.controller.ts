import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateSellerDto } from './sellerAuth.dto';
import { SellerAuthService } from './sellerAuth.service';

@Controller('/seller/auth')
export class SellerAuthController {
  constructor(private readonly sellerService: SellerAuthService) {}

  @Get()
  req() {
    return 'hello';
  }
  @Post('register')
  @UsePipes(new ValidationPipe())
  registerUser(@Body() user: CreateSellerDto): object {
    return this.sellerService.registerUser(user);
  }

  @Post('/register/image')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 2000,
      },
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log('uploaded file');
    return { message: 'file recieved' };
  }

  @Put('/login')
  loginUser(@Body() user: any): object {
    return this.sellerService.login(user);
  }

  @Get('/logout')
  logout(): object {
    return this.sellerService.logout();
  }
}
