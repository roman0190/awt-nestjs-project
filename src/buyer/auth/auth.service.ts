import { Injectable, UnauthorizedException } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { BuyerService } from '../buyer.service';
import { BuyerDto, loginDTO } from 'src/buyer/buyer.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private buyerService: BuyerService, 
    private jwtService: JwtService
  ) {}

  async signUp(myobj: BuyerDto): Promise<BuyerDto> {
    return await this.buyerService.addBuyer(myobj);
}

  async signIn( logindata:loginDTO): Promise<{ access_token: string }> {
    const user = await this.buyerService.findOne(logindata);
    //console.log(user)
    //console.log("abcd",logindata.password, user.password)
   if (!user) {
    throw new UnauthorizedException();
   }
    const isMatch = await bcrypt.compare(logindata.password, user.password);
    console.log(isMatch)
    if (!isMatch) {
      throw new UnauthorizedException();
    }
    //const payload = { email: user.email }; 
    const payload = logindata;
    return {
      access_token: await this.jwtService.signAsync(payload),
    };


  }

//   async login(logindata: loginDTO){
//     const buyer = await this.buyerService.searchBuyer(logindata);
//     const result = await bcrypt.compare(logindata.password, buyer.password);
//     if(result)
//     {
//       return true;
//     }
//     else{
//       return false;
//     }
//   }
}







