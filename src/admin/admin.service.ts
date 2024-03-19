import { Injectable, UnauthorizedException } from '@nestjs/common';
import {  AdminRegDto, logDto} from './dto/admin.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdminRegEntity } from './entities/admin.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from './entities/user.entity';
import { GigEntity } from './entities/gig.entity';
import { AdditionalInfoEntity } from './entities/AdditionalInfo.entity';


@Injectable()
export class AdminService {
  
  constructor(
    @InjectRepository(AdminRegEntity)
    private readonly adminRepository: Repository<AdminRegEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(GigEntity)
    private readonly gigRepository: Repository<GigEntity>,
    @InjectRepository(AdditionalInfoEntity)
    private readonly additionalInfoRepository: Repository<AdditionalInfoEntity>,
    private jwtService: JwtService
   
  ) {}
//1
  async AdminReg(adminReg: AdminRegDto): Promise<object> { 
    const email  = adminReg.email;
    adminReg.role = "Admin"

    const existingUser = await this.adminRepository.findOne({ where: { email } });
    if (existingUser) {
      return { message: 'Admin already exists' };
    }
    else{
      try {
        await this.adminRepository.save(adminReg);
        return { message: 'Admin registration successful' };
      } catch (error) {
        throw new Error('Failed to save admin');
      }
    }
  }
 
//2
  async Adminlogin(logdata: logDto):Promise<{ access_token: string }> {
    const { email, password } = logdata;
    const user = await this.adminRepository.findOne({where:{email}});
    logdata.id = user.id
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
//3
  async getAllAdmins(): Promise<AdminRegEntity[]> {
    return await this.adminRepository.find();
  }
//4
    async getAdminInfo(adminId: number):Promise<AdminRegEntity> {
      return await this.adminRepository.findOne({
        where:{id:adminId},
        relations : {
          users:true,
          additionalInfo:true,
        }
      });

    }

//5
    async deleteAdminInfo(adminId: number): Promise<void> {
      
      const adminToDelete = await this.adminRepository.findOne({where:{id:adminId},relations:{users:true}});

      if (!adminToDelete) {
        throw new Error(`Admin with ID ${adminId} not found.`);
      }

      
      for (const user of adminToDelete.users) {
          user.admin = null;
          await this.userRepository.save(user); 
      }

      await this.adminRepository.remove(adminToDelete);
    }

//6
    async editAdmin(userID: number, editData: Partial<AdminRegEntity>): Promise<any> {

      const userToUpdate = await this.adminRepository.findOne({where:{id:userID}});

      if (!userToUpdate) {
        return {meaasage:`User with ID ${userID} not found.`};
      }

      Object.assign(userToUpdate, editData);

      return await this.adminRepository.save(userToUpdate);
    }
//7
async AddmoreInfo(additionalInfo: AdditionalInfoEntity, token: string): Promise<any> {
  try {
    const decodedToken = this.jwtService.verify(token); 
    const adminId = decodedToken.id;
    additionalInfo.admin = adminId;

    const findInfo = await this.additionalInfoRepository.findOne({where:{admin:adminId}})

    Object.assign(findInfo,additionalInfo);
    
    return await this.additionalInfoRepository.save(findInfo);
  } catch (error) {
    return {message:'Information Already added'};
  }
}


//8

    async CreateUser(userdata:UserEntity,token:string):Promise<object>{
     try{
        const decodedToken = this.jwtService.verify(token); 
        const adminId = decodedToken.id;
        const email= userdata.email;
        userdata.admin = adminId

        const existingUser = await this.userRepository.findOne({ where: { email } });
        if (existingUser) {
          return { message: 'User already exists' };
        }
        else{
          try {
            await this.userRepository.save(userdata);
            return { message: 'User Created successfully' };
          } catch (error) {
            // console.error('Error occurred while saving admin:', error.message);
            throw new Error('Failed to create user');
          }
        }
     }catch{
      return {message:'Invalid.'}
     }  
    }
//9
    async getAllUsers(): Promise<UserEntity[]> {
      return await this.userRepository.find();
    }
//10
async editUser(userID: number, editData: Partial<UserEntity>): Promise<UserEntity> {

  const userToUpdate = await this.userRepository.findOne({where:{id:userID}});

  if (!userToUpdate) {
    throw new Error(`User with ID ${userID} not found.`);
  }

  Object.assign(userToUpdate, editData);

  return await this.userRepository.save(userToUpdate);
}
//11

async deleteUser(userID: number): Promise<void> {
      
  const userToDelete = await this.userRepository.findOne({where:{id:userID}});

  if (!userToDelete) {
    throw new Error(`Admin with ID ${userID} not found.`);
  }

  await this.userRepository.remove(userToDelete);
}
//12
async getUnapprovedGigs(): Promise<GigEntity[]> {
  try {
    return await this.gigRepository.find({ where: { approved: false } });
  } catch (error) {
    console.error('Failed to retrieve unapproved gigs', error.message);
  }
}
async getApprovedGigs(): Promise<GigEntity[]> {
  try {
    return await this.gigRepository.find({ where: { approved: true } });
  } catch (error) {
    console.error('Error fetching approved gigs:', error.message);
  }
}
//13
async toggleGigApproval(gigId: number): Promise<GigEntity> {
  const gig = await this.gigRepository.findOne({ where: { id: gigId } });
  if (!gig) {
    throw new Error(`Gig with ID ${gigId} not found.`);
  }

  gig.approved = !gig.approved; 
  return await this.gigRepository.save(gig);
}
//14 
async logout() {
 const payload = {
      name :"Romppan",
      password:"secret@forlog"
  }
  await this.jwtService.signAsync(payload)
  return { message: 'Logout successful' };
}
  
}
