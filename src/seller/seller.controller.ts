import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { MulterError, diskStorage } from 'multer';
import { stringify } from 'querystring';
import { Public } from './auth/constants';
import { errorResponse } from './functions/errorResponse';
import {
  SellerSignInDto,
  SellerSignUpDto,
  UpdateSellerDto,
  fileUploadDto,
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

  @Get()
  @Public()
  async findAll() {
    try {
      return this.sellerService.findAll();
    } catch (error) {
      return errorResponse(error);
    }
  }

  @Get(':id')
  @Public()
  async findOne(@Param('id') id: string) {
    try {
      return this.sellerService.findOne(+id);
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

  @Post('upload-pfp')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: (req, file, cb) => {
        if (file.originalname.match(/^.*\.(jpg|webp|png|jpeg)$/))
          cb(null, true);
        else {
          cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);
        }
      },
      limits: { fileSize: 2000000 },
      storage: diskStorage({
        destination: './uploads',
        filename: function (req: Request, file, cb) {
          try {
            // @ts-ignore
            const userId = req.user?.userId;
            const extention = file.mimetype.split('/')[1];

            const fileName = userId
              ? userId + 'pfp.' + extention
              : Date.now() + file.originalname;

            cb(null, fileName);
          } catch (error) {
            cb(new Error('Illegal file name'), null);
          }
        },
      }),
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ) {
    try {
      return await this.sellerService.setUserPfp(file, req);
    } catch (error) {
      return errorResponse(error);
    }
  }

  @Public()
  @Get('/getimage/:name')
  getImages(@Param('name') name, @Res() res) {
    try {
      res.sendFile(name, { root: './uploads' });
      return;
    } catch (error) {
      return errorResponse(error);
    }
  }
}
