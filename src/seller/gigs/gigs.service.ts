import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { SellerEntity } from '../seller.entity';
import { CreateGigDto, UpdateGigDto } from './gig.dto';
import { GigEntity } from './gig.entity';

@Injectable()
export class GigsService {
  constructor(
    @InjectRepository(GigEntity)
    private gigRepository: Repository<GigEntity>,
    @InjectRepository(SellerEntity)
    private sellerRepository: Repository<SellerEntity>,
  ) {}

  async create(sellerId: number, createGigDto: CreateGigDto) {
    const gig = new GigEntity();
    gig.title = createGigDto.title;
    gig.description = createGigDto.description;
    gig.price = createGigDto.price;
    gig.gigImage = createGigDto.gigImage;
    gig.gigThumbnail = createGigDto.gigThumbnail;

    const gigOwner = await this.sellerRepository.findOneBy({ id: sellerId });
    if (!gigOwner) {
      throw new Error('no  user found');
    }
    gig.gigOwner = gigOwner;

    try {
      const newGig = await this.gigRepository.save(gig);
      return newGig;
    } catch (error) {
      if (
        error.message ===
        `duplicate key value violates unique constraint \"UQ_97c13ec495f2b4dbe4cc3880b2a\"`
      ) {
        throw new Error('Gig with same title already exists');
      }
      throw new Error(error.message);
    }
  }

  async findAll() {
    return this.gigRepository.find();
  }
  async findForOneUser(id: number) {
    return this.gigRepository.find({ where: { gigOwner: { id: id } } });
  }

  findOne(id: number) {
    return this.gigRepository.findOneBy({ id: id });
  }

  async update(gigId: number, userId: number, updateGigDto: UpdateGigDto) {
    const gig = await this.gigRepository.findOneBy({ id: gigId });
    if (!gig) {
      throw new Error('no gig found');
    }
    const gigOwnerId = gig.gigOwner?.id;

    if (gigOwnerId !== userId) {
      throw new Error('Gig is not owned by this user');
    }
    await this.gigRepository.update(gigId, updateGigDto);
    return this.gigRepository.findOneBy({ id: gigId });
  }

  async remove(id: number, userId: number) {
    const gig = await this.gigRepository.findOneBy({ id: id });
    if (!gig) {
      throw new Error('no gig found');
    }
    const gigOwnerId = gig.gigOwner.id;

    if (gigOwnerId !== userId) {
      throw new Error('Gig is not owned by this user');
    }

    await this.gigRepository.remove(gig);
    return {
      message: 'deleted',
      deletedData: gig,
    };
  }
}
