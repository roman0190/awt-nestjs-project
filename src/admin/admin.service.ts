import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import {  AdminRegDto, AnnouncementDto, logDto} from './dto/admin.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdminRegEntity } from './entities/admin.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from './entities/user.entity';
import { GigEntity } from './entities/gig.entity';
import { AdditionalInfoEntity } from './entities/AdditionalInfo.entity';
import { AnnouncementEntity } from './entities/announcement.entity';


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
    @InjectRepository(AnnouncementEntity)
    private readonly announcementRepository: Repository<AnnouncementEntity>,
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
  async Adminlogin(logdata: logDto):Promise<any> {
    const { email, password } = logdata;
    const user = await this.adminRepository.findOne({where:{email}});
    if(!user){
      return ("user not found")
    }
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
  async getAdminInfo(token):Promise<AdminRegEntity>{
    const decodedToken = this.jwtService.verify(token);
      const adminId = decodedToken.id;
      return await this.adminRepository.findOne({
        where:{id:adminId},
        relations : {
          users:true,
          additionalInfo:true,
          announcements:true
        }
      });

    }

//5
    async deleteAdminInfo(token): Promise<any> {
      const decodedToken = this.jwtService.verify(token);
      const adminId = decodedToken.id;
      const adminToDelete = await this.adminRepository.findOne({where:{id:adminId},relations:{users:true}});

      if (!adminToDelete) {
        return (`Admin with ID ${adminId} not found.`);
      }

      
      for (const user of adminToDelete.users) {
          user.admin = null;
          await this.userRepository.save(user); 
      }

      await this.adminRepository.remove(adminToDelete);
    }

//6
    async editAdmin(token,editData: Partial<AdminRegEntity>): Promise<any> {
      const decodedToken = this.jwtService.verify(token);
      const adminId = decodedToken.id;
      const userToUpdate = await this.adminRepository.findOne({where:{id:adminId}});

      if (!userToUpdate) {
        return {meaasage:`User with ID ${adminId} not found.`};
      }

      Object.assign(userToUpdate, editData);

      return await this.adminRepository.save(userToUpdate);
    }
//7
async AddmoreInfo(additionalInfo: AdditionalInfoEntity, token: string): Promise<any> {
  try {
      const decodedToken = this.jwtService.verify(token);
      const adminId = decodedToken.id;
      
      const newInfo = new AdditionalInfoEntity();
      newInfo.admin = adminId;

      Object.assign(newInfo, additionalInfo);

      const savedInfo = await this.additionalInfoRepository.save(newInfo);

      return savedInfo;
  } catch (error) {
      return { message: 'Information Already added' };
  }
}
//8
async editmoreInfo(additionalInfo: AdditionalInfoEntity, token: string): Promise<any> {
  try {
      const decodedToken = this.jwtService.verify(token);
      const adminId = decodedToken.id;

      let existingInfo = await this.additionalInfoRepository.findOne({ where: { admin: adminId } });

      if (!existingInfo) {
          return { message: 'No information found for this admin' };
      }

      Object.assign(existingInfo, additionalInfo);

      const savedInfo = await this.additionalInfoRepository.save(existingInfo);

      return savedInfo;
  } catch (error) {
      return { message: 'Error editing information' };
  }
}

//9
  async sendAnnouncement(announcementDto: AnnouncementDto,token:string): Promise<AnnouncementEntity> {
    try {
      const decodedToken = this.jwtService.verify(token); 
      const adminId = decodedToken.id;
      announcementDto.admin = adminId
      return await this.announcementRepository.save(announcementDto);
    } catch (error) {
      // console.error('Error occurred while sending announcement:', error);
      throw new InternalServerErrorException('Failed to send announcement');
    }
  }
 //10
  async deleteAnnouncement(id: number, token: string): Promise<any> {
    const decodedToken = this.jwtService.verify(token);
    const adminId = decodedToken.id;

    const announcement = await this.announcementRepository.findOne({where:{id:id},relations:{admin:true}});
    if (!announcement) {
      return ('Announcement not found');
    }

    if (announcement.admin.id!== adminId) {
      return ('You are not authorized to delete this announcement');
    }
    await this.announcementRepository.remove(announcement);
    // return ("Deleted Successfully")
  }

//11

    async CreateUser(userdata:UserEntity,token:string):Promise<any>{
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
            return ('Failed to create user');
          }
        }
     }catch{
      return {message:'Invalid.'}
     }  
    }

//12
    async getAllUsers(): Promise<UserEntity[]> {
      return await this.userRepository.find();
    }

//13
  async editUser(userID: number, editData: Partial<UserEntity>): Promise<any> {

    const userToUpdate = await this.userRepository.findOne({where:{id:userID}});

    if (!userToUpdate) {
      return (`User with ID ${userID} not found.`);
    }

    Object.assign(userToUpdate, editData);

    return await this.userRepository.save(userToUpdate);
  }

//14
async deleteUser(userID: number): Promise<any> {
      
  const userToDelete = await this.userRepository.findOne({where:{id:userID}});

  if (!userToDelete) {
    return (`Admin with ID ${userID} not found.`);
  }

  await this.userRepository.remove(userToDelete);
}
//15
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

//16
async toggleGigApproval(gigId: number): Promise<any> {
  const gig = await this.gigRepository.findOne({ where: { id: gigId } });
  if (!gig) {
    return (`Gig with ID ${gigId} not found.`);
  }

  gig.approved = !gig.approved; 
  return await this.gigRepository.save(gig);
}

//17
async logout() {
 const payload = {
      name :"Romppan",
      password:"secret@forlog"
  }
  await this.jwtService.signAsync(payload)
  return { message: 'Logout successful' };
}
  
}
