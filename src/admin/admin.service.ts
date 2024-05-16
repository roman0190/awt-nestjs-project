import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import {  AdminRegDto, AnnouncementDto, logDto} from './dto/admin.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError, Repository } from 'typeorm';
import { AdminRegEntity } from './entities/admin.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from './entities/user.entity';
import { GigEntity } from './entities/gig.entity';
import { AdditionalInfoEntity } from './entities/AdditionalInfo.entity';
import { AnnouncementEntity } from './entities/announcement.entity';
import { MailerService } from '@nestjs-modules/mailer';


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
    private jwtService: JwtService,
    private readonly mailerService: MailerService
   
  ) {}
  //0.1
  async mail(){
    this.mailerService.sendMail({
        to: 'cartoonworld517@gmail.com', // list of receivers
        from: 'cartoonworld517@gmail.com', // sender address
        subject: 'Testing Nest MailerModule ✔', // Subject line
        text: 'welcome', // plaintext body
        html: '<b>welcome</b>', // HTML body content
      })
      .then((success) => {
        console.log(success)
        console.log("ee")

      })
      .catch((err) => {
        console.log(err)
        console.log("ere")
      });
  }
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
        throw new Error(error);
      }
    }
  }
  //1.1
  async uploadpfp(user ,filename){
    
      const adminId = user.id;
      await this.adminRepository.update(adminId, {
        path: filename,
      });
      const getuser = await this.adminRepository.findOneBy({ id: adminId });
      if (!getuser) {
        throw new EntityNotFoundError(AdminRegEntity, { id: adminId });
      }
      return getuser;

  }
//2
  async Adminlogin(logdata: logDto):Promise<any> {
    const { email, password } = logdata;
    const user = await this.adminRepository.findOne({where:{email}});
    if(!user){
      return ("user not found")
    }
    logdata.id = user.id
    logdata.name = user.name
    
    
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
//3.1
async searchAdminByName(name:string){
  const user = await this.adminRepository.findOne({where:{name:name}})
 if(!user){
  return null
 }
 return user
}
//3.1.2
async searchAdminById(id:number){
  const user = await this.adminRepository.findOne({where:{id:id}})
 if(!user){
  return null
 }
 return user
}

//3.2
async deleteAdminById(id: number): Promise<void> {
  const user = await this.adminRepository.findOne({ where: { id } });
  if (!user) {
    throw new NotFoundException(`Admin with ID ${id} not found`);
  }
  await this.adminRepository.delete(id);
}
//4
  async getAdminInfo(user):Promise<AdminRegEntity>{
      const adminId = user.id;
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
    async deleteAdminInfo(user): Promise<any> {
      const adminId = user.id;
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
    async editAdmin(user,editData: Partial<AdminRegEntity>): Promise<any> {
      const adminId = user.id;
      const userToUpdate = await this.adminRepository.findOne({where:{id:adminId}});

      if (!userToUpdate) {
        return {meaasage:`User with ID ${adminId} not found.`};
      }

      Object.assign(userToUpdate, editData);

      return await this.adminRepository.save(userToUpdate);
    }
//7
async AddmoreInfo(additionalInfo: AdditionalInfoEntity, user): Promise<any> {
  try {
      const adminId = user.id;
      
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
async editmoreInfo(additionalInfo: AdditionalInfoEntity, user): Promise<any> {
  try {
    const adminId = user.id;

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
  async sendAnnouncement(announcement: AnnouncementDto,user): Promise<AnnouncementEntity> {
    try {
      const adminId = user.id;
      announcement.admin = adminId
      return await this.announcementRepository.save(announcement);
    } catch (error) {
      // console.error('Error occurred while sending announcement:', error);
      throw new InternalServerErrorException('Failed to send announcement');
    }
  }
  //9.1
  async getAllAnnouncement(){
    return await this.announcementRepository.find();
  }
  
 //10
  async deleteAnnouncement(id: number, user): Promise<any> {
    const adminId = user.id;

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

    async CreateUser(userdata:UserEntity,user):Promise<any>{
     try{
        const adminId = user.id;
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
  //13.1
  async searchUser(userID: number): Promise<any> {

    const user = await this.userRepository.findOne({where:{id:userID}});

    if (!user) {
      return ("User Not found");
    }

    return user
  }
//14
async deleteUser(userID: number): Promise<any> {
      
  const userToDelete = await this.userRepository.findOne({where:{id:userID}});

  if (!userToDelete) {
    return (`Admin with ID ${userID} not found.`);
  }

  await this.userRepository.remove(userToDelete);
}
//14.1
async getAllGigs(): Promise<GigEntity[]> {
  try {
    return await this.gigRepository.find(); 
  } catch (error) {
    console.error('Failed to retrieve all gigs', error.message);
    throw new Error('Failed to retrieve all gigs');
  }
}
//14.2
async searchGigById(gigId: number){
  try {
    return await this.gigRepository.findOne({where:{id:gigId}});
  } catch (error) {
    console.error(`Failed to search gig with ID ${gigId}`, error.message);
    throw new Error(`Failed to search gig with ID ${gigId}`);
  }
}
//14.3
async deleteGigById(id: number): Promise<void> {
  try {
    const gig = await this.gigRepository.findOne({where:{id}});
    if (!gig) {
      throw new Error('Gig not found');
    }
    await this.gigRepository.remove(gig);
  } catch (error) {
    throw new Error(`Failed to delete gig: ${error.message}`);
  }
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
