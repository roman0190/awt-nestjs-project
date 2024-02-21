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
} from '@nestjs/common';
import { SellerService } from './seller.service';

@Controller('seller')
export class SellerController {
  constructor(private readonly sellerService: SellerService) {}

  @Get()
  req() {
    return 'hello';
  }

  @Post('/create-gig')
  create(@Body() data: any): object {
    return this.sellerService.createGig(data);
  }

  @Patch('/edit-gig')
  edit(@Query('id') id: string, @Body() data: object): object {
    return this.sellerService.editGig(id, data);
  }

  @Get('/gigs')
  getGigs(): object {
    return this.sellerService.getAllGigs();
  }
  @Get('/gig/:id')
  getGig(@Param('id') id: string): object {
    return this.sellerService.getGig(id);
  }
  @Delete('/delete-gig/:id')
  deleteGig(@Param('id') id: string): object {
    return this.sellerService.deleteGig(id);
  }
}
