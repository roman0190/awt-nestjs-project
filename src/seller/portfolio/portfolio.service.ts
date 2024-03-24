import { Injectable, Req, Request } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GigEntity } from '../gigs/gig.entity';
import { SellerEntity } from '../seller.entity';
import { addToPortfolioDto } from './portfolio.dto';
import { PortfolioEntity } from './portfolio.entity';

@Injectable()
export class PortfolioService {
  constructor(
    @InjectRepository(PortfolioEntity)
    private portfolioRepository: Repository<PortfolioEntity>,
    @InjectRepository(GigEntity)
    private gigRepository: Repository<GigEntity>,
    @InjectRepository(SellerEntity)
    private sellerRepository: Repository<SellerEntity>,
  ) {}
  async create(addToPortfolioDto: addToPortfolioDto, @Req() request: Request) {
    // @ts-ignore
    const { userId } = request.user;

    const gigId = parseInt(addToPortfolioDto.gigId);

    const gig = await this.gigRepository.findOneBy({ id: gigId });
    if (!gig) {
      throw new Error('gig not found');
    }
    const portfolio = new PortfolioEntity();
    portfolio.title = addToPortfolioDto.title;
    portfolio.description = addToPortfolioDto.description;
    portfolio.rating = addToPortfolioDto.rating;
    portfolio.reviewMessage = addToPortfolioDto.reviewMessage;
    portfolio.relevantSkills = addToPortfolioDto.relevantSkills;
    portfolio.sellerId = userId;

    portfolio.gig = gig;

    return await this.portfolioRepository.save(portfolio);
  }

  async findAll() {
    return await this.portfolioRepository.find();
  }

  async findAllForGig(id: number) {
    return await this.portfolioRepository.find({ where: { gig: { id: id } } });
  }
  async findAllForUser(id: number) {
    return await this.portfolioRepository.find({
      where: { gig: { gigOwner: { id: id } } },
    });
  }

  async findOne(id: number) {
    return await this.portfolioRepository.findOneBy({ id: id });
  }
}
