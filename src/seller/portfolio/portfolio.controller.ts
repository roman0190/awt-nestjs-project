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
import { Public } from '../auth/constants';
import { errorResponse } from '../functions/errorResponse';
import { addToPortfolioDto } from './portfolio.dto';
import { PortfolioService } from './portfolio.service';

@Controller('seller/portfolio')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Post('add')
  @UsePipes(new ValidationPipe())
  async create(
    @Body() addToPortfolioDto: addToPortfolioDto,
    @Req() request: Request,
  ) {
    try {
      return await this.portfolioService.create(addToPortfolioDto, request);
    } catch (error) {
      return errorResponse(error);
    }
  }

  @Get('all')
  findAll() {
    try {
      return this.portfolioService.findAll();
    } catch (error) {
      return errorResponse(error);
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    try {
      return this.portfolioService.findOne(+id);
    } catch (error) {
      return errorResponse(error);
    }
  }
  @Get('gig/:id')
  findOneForGig(@Param('id') id: string) {
    try {
      return this.portfolioService.findAllForGig(+id);
    } catch (error) {
      return errorResponse(error);
    }
  }
  @Get('by/:id')
  findOneForUser(@Param('id') id: string) {
    try {
      return this.portfolioService.findAllForUser(+id);
    } catch (error) {
      return errorResponse(error);
    }
  }
}
