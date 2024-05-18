import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateGigDto, UpdateGigDto } from './gig.dto';

import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { MulterError, diskStorage } from 'multer';
import { Public } from '../auth/constants';
import { errorResponse } from '../functions/errorResponse';
import { GigsService } from './gigs.service';

@Controller('seller/gigs')
export class GigsController {
  constructor(private readonly gigsService: GigsService) {}

  @Post('create')
  @UseInterceptors(
    FileInterceptor('gigImage', {
      fileFilter: (req, file, cb) => {
        if (file.originalname.match(/^.*\.(jpg|webp|png|jpeg)$/))
          cb(null, true);
        else {
          cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);
        }
      },
      limits: { fileSize: 9000000 },
      storage: diskStorage({
        destination: './uploads',
        filename: function (req: Request, file, cb) {
          try {
            // @ts-ignore
            const userId = req.user?.userId;
            const extention = file.mimetype.split('/')[1];

            const fileName = userId
              ? userId + 'gigImg.' + Date.now() + extention
              : Date.now() + file.originalname;

            cb(null, fileName);
          } catch (error) {
            cb(new Error('Illegal file name'), null);
          }
        },
      }),
    }),
  )
  @UsePipes(new ValidationPipe())
  async create(
    @Req() req,
    @Body() createGigDto: CreateGigDto,
    @UploadedFile() gigImage: Express.Multer.File,
  ) {
    console.log('create', gigImage);
    try {
      const { userId } = req.user;

      return await this.gigsService.create(userId, {
        ...createGigDto,
        gigImage: gigImage.filename,
        gigThumbnail: gigImage.filename,
      });
    } catch (error) {
      return errorResponse(error);
    }
  }

  @Get('all')
  @Public()
  async findAll() {
    try {
      return await this.gigsService.findAll();
    } catch (error) {
      return errorResponse(error);
    }
  }
  @Get(':id/all')
  @Public()
  async findForUser(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.gigsService.findForOneUser(id);
    } catch (error) {
      return errorResponse(error);
    }
  }

  @Get(':id')
  @Public()
  async findOne(@Param('id') id: string) {
    try {
      return await this.gigsService.findOne(+id);
    } catch (error) {
      return errorResponse(error);
    }
  }

  @Patch('update/:id')
  @UseInterceptors(
    FileInterceptor('gigImage', {
      fileFilter: (req, file, cb) => {
        if (file.originalname.match(/^.*\.(jpg|webp|png|jpeg)$/))
          cb(null, true);
        else {
          cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);
        }
      },
      limits: { fileSize: 9000000 },
      storage: diskStorage({
        destination: './uploads',
        filename: function (req: Request, file, cb) {
          try {
            // @ts-ignore
            const userId = req.user?.userId;
            const extention = file.mimetype.split('/')[1];

            const fileName = userId
              ? userId + 'gigImg.' + Date.now() + extention
              : Date.now() + file.originalname;

            cb(null, fileName);
          } catch (error) {
            cb(new Error('Illegal file name'), null);
          }
        },
      }),
    }),
  )
  @UsePipes(new ValidationPipe())
  async update(
    @Req() req,
    @Param('id') gigId: string,
    @Body() updateGigDto: UpdateGigDto,
    @UploadedFile() gigImage: Express.Multer.File,
  ) {
    try {
      const { userId } = req.user;
      let data = updateGigDto;
      if (gigImage) {
        data = { ...data, gigImage: gigImage.filename };
      }
      return await this.gigsService.update(+gigId, userId, data);
    } catch (error) {
      return errorResponse(error);
    }
  }

  @Delete('delete/:id')
  async remove(@Req() req, @Param('id') id: string) {
    try {
      const { userId } = req.user;
      return await this.gigsService.remove(+id, userId);
    } catch (error) {
      return errorResponse(error);
    }
  }
}
