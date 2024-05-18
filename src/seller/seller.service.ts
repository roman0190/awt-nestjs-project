import { HttpStatus, Injectable, Req, Session } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';

import { EntityNotFoundError, Repository } from 'typeorm';
import { checkPassword, generateHash } from './auth/hashings';

import { Request } from 'express';
import { use } from 'passport';
import {
  SellerSignInDto,
  SellerSignUpDto,
  UpdateSellerDto,
} from './seller.dto';
import { SellerEntity } from './seller.entity';
import { SellerCredsEntity } from './sellerCreds.entity';

@Injectable()
export class SellerService {
  constructor(
    @InjectRepository(SellerCredsEntity)
    private sellerCredsRepository: Repository<SellerCredsEntity>,
    @InjectRepository(SellerEntity)
    private sellerRepository: Repository<SellerEntity>,
    private jwtService: JwtService,
  ) {}

  async sellerSignUp(sellerSignUpData: any): Promise<object> {
    try {
      const username = sellerSignUpData.username;
      const email = sellerSignUpData.email;
      const password = sellerSignUpData.password;

      const seller = new SellerEntity();
      seller.username = username;
      seller.email = email;
      const savedSeller = await this.sellerRepository.save(seller);

      const hash = await generateHash(password);
      const pass = hash.pass;
      const salt = hash.salt;
      const sellerCreds = new SellerCredsEntity();
      sellerCreds.id = savedSeller.id;
      sellerCreds.username = username;
      sellerCreds.password = pass;
      sellerCreds.salt = salt;
      sellerCreds.seller = savedSeller;
      await this.sellerCredsRepository.save(sellerCreds);

      const token = await this.getToken(sellerCreds);

      const sellerResponse = {
        ...seller,
        access_token: token,
      };

      return sellerResponse;
    } catch (error) {
      throw new Error(this.handleError(error, 'create seller '));
    }
  }

  async sellerSignIn(sellerSignInData: any) {
    let seller = await this.sellerCredsRepository.findOneBy({
      username: sellerSignInData.username,
    });

    if (!seller) {
      throw new Error('user does not exist');
    }

    const matchedPassword = await checkPassword(
      sellerSignInData.password + seller.salt,
      seller.password,
    );

    if (!matchedPassword) {
      throw new Error('wrong password');
    }
    const token = await this.getToken(seller);

    let sellerObject = {
      ...seller,
      password: undefined,
      salt: undefined,
      access_token: token,
    };

    return sellerObject;
  }
  async findAll() {
    return await this.sellerRepository.find();
  }

  async findOne(id: number) {
    const user = await this.sellerRepository.findOneBy({ id: id });

    return user;
  }

  async update(id: number, updateSellerDto: UpdateSellerDto) {
    try {
      await this.sellerRepository.update(id, updateSellerDto);
      return await this.sellerRepository.findOneBy({ id: id });
    } catch (error) {
      throw new Error(this.handleError(error, 'update seller'));
    }
  }

  async remove(id: number) {
    const user = await this.sellerRepository.findOneBy({ id: id });
    if (!user) throw new EntityNotFoundError(SellerEntity, { id: id });
    await this.sellerRepository.remove(user);
    return {
      message: 'deleted',
      deletedData: user,
    };
  }
  async logout() {
    return { message: 'logged out' };
  }

  async setUserPfp(file: Express.Multer.File, req: Request) {
    // @ts-ignore
    const userId = req.user.userId;
    await this.sellerRepository.update(userId, {
      pfp: file.filename,
    });
    const user = await this.sellerRepository.findOneBy({ id: userId });
    if (!user) {
      throw new EntityNotFoundError(SellerEntity, { id: userId });
    }
    return user;
  }

  private handleError(error: any, errorOccuredFunction: string): string {
    let errorResponse: string;
    const errorMessage = error.message;
    switch (errorMessage) {
      case 'duplicate key value violates unique constraint "UQ_83a576c17c115427311c5fc907e"':
        errorResponse = 'username is already taken';
        break;
      case 'duplicate key value violates unique constraint "UQ_1f677314b76e057b56c48042ace"':
        errorResponse = 'email address already exists';
        break;
      default:
        errorResponse = errorMessage;
    }

    return errorResponse;
  }

  private async getToken(seller: SellerCredsEntity) {
    const payload = { sub: seller.id, username: seller.username };
    return await this.jwtService.signAsync(payload);
  }
}
