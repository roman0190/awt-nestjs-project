import { Injectable, UnauthorizedException } from '@nestjs/common';
import {  AdminRegDto, logDto} from './dto/admin.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdminRegEntity } from './entities/admin.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AdminService {
  
  constructor(
    
    @InjectRepository(AdminRegEntity)
    private readonly adminRepository: Repository<AdminRegEntity>,
    private jwtService: JwtService
  ) {}

  async AdminReg(adminReg: AdminRegDto): Promise<object> {
    const { email } = adminReg;

    const existingUser = await this.adminRepository.findOne({ where: { email } });
    if (existingUser) {
      return { message: 'Email already exists' };
    }
    else{
      try {
        await this.adminRepository.save(adminReg);
        return { message: 'Admin registration successful' };
      } catch (error) {
        // console.error('Error occurred while saving admin:', error.message);
        throw new Error('Failed to save admin');
      }
    }
  }
  
  async Adminlogin(logdata: logDto) {
    const { email, password } = logdata;
    const user = await this.adminRepository.findOne({where:{email}});
    
    if (user) {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (isPasswordValid) {
        const payload = logdata;
        return {
          access_token: await this.jwtService.signAsync(payload),
        };
      } else {
        throw new UnauthorizedException();
      }
    } else {
      throw new UnauthorizedException();
    }
  }

  
}
