import {
  Controller,
  Get,
  Put,
  Post,
  Body,
  Param,
  Query,
  Patch,
  Delete,
  ValidationPipe,
  UsePipes,
  UseInterceptors,
  UploadedFile,
  ParseIntPipe,
  UseGuards,
  NotFoundException,
  Req,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import {
  AdditionalInfoDto,
  AdminRegDto, AnnouncementDto, logDto,
} from './dto/admin.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterError, diskStorage } from 'multer';
import * as bcrypt from 'bcrypt';
import { UserDto } from './dto/user.dto';
import { UserEntity } from './entities/user.entity';
import { AdminRegEntity } from './entities/admin.entity';
import { AuthGuard } from './auth.guard';
import { GigEntity } from './entities/gig.entity';
import { AdditionalInfoEntity } from './entities/AdditionalInfo.entity';



@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}
//1 Admin
  @Post('register')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: (req, file, cb) => {
        if (file.originalname.match(/\.(jpg|webp|png|jpeg)$/)) {
          cb(null, true);
        } else {
          cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);
        }
      },
      limits: { fileSize: 300000 },
      storage: diskStorage({
        destination: './uploads/profilePic',
        filename: (req, file, cb) => {
          cb(null, Date.now() + file.originalname);
        },
      }),
    }),
  )
  @UsePipes(new ValidationPipe())
  async AdminReg(@Body() adminReg: AdminRegDto, @UploadedFile() file: Express.Multer.File) {
    const role ='admin'
    const salt = await bcrypt.genSalt();
    const hassedpassed = await bcrypt.hash(adminReg.password, salt);

    adminReg.password = hassedpassed
    adminReg.role = role
    return await this.adminService.AdminReg(adminReg);
    // console.log(file.path)
  }

//2
  @Post('login')
  @UsePipes(new ValidationPipe())
  async Adminlogin(@Body() logdata:logDto){
    return await this.adminService.Adminlogin(logdata)
  }
//3
  @Get('all')
  @UseGuards(AuthGuard)
  async getAllAdmins() {
    return await this.adminService.getAllAdmins();
  }

//4
  @Get('search/:adminId')
  //@UseGuards(AuthGuard)
  async getAdminInfo(@Param('adminId',ParseIntPipe) adminId: number) {
    return await this.adminService.getAdminInfo(adminId);
  }
//5
  @Delete('delete/:adminId')
  //@UseGuards(AuthGuard)
  async deleteAdminInfo(@Param('adminId',ParseIntPipe) adminId: number) {
    return await this.adminService.deleteAdminInfo(adminId);
  }
//6
  @Patch('edit-admin/:userID')
  //@UseGuards(AuthGuard)
  async editAdmin(@Param("userID",ParseIntPipe) userID, @Body()editdata:Partial<AdminRegEntity>){
    return await this.adminService.editAdmin(userID,editdata)

  }

//7
@Patch("add-more-info")
@UseGuards(AuthGuard) 
async addMoreInfo(@Body() additionalInfo: AdditionalInfoDto, @Req() req){
  const token = req.headers.authorization.replace('Bearer ', ''); 
  return this.adminService.AddmoreInfo(additionalInfo, token);
  
}
//8
@Post('send-announcement')
@UseGuards(AuthGuard) 
  async sendAnnouncement(@Body() announcementDto: AnnouncementDto,@Req() req) {
    const token = req.headers.authorization.replace('Bearer ', ''); 
    return this.adminService.sendAnnouncement(announcementDto,token);
  }
//9
@Delete('delete-announcement/:id')
@UseGuards(AuthGuard) 
async deleteAnnouncement(@Param('id',ParseIntPipe) id:number,@Req() req){
  const token = req.headers.authorization.replace('Bearer ', ''); 
    return this.adminService.deleteAnnouncement(id,token);
}


//10 Admin Manage Users
  @Post('users/create-user')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async CreateUser(@Body() userdata : UserDto,@Req() req) {
      const token = req.headers.authorization.replace('Bearer ', ''); 
      return await this.adminService.CreateUser(userdata,token)
  }

//11
  @Get('users/all')
  async getAllUsers() {
    return await this.adminService.getAllUsers();
  }

//12
  @Patch('users/edit-user/:userID')
  //@UseGuards(AuthGuard)
  async editUser(@Param("userID",ParseIntPipe) userID, @Body()editdata:Partial<UserEntity>){
    return await this.adminService.editUser(userID,editdata)
  }

//13
  @Delete('users/delete/:userId')
  //@UseGuards(AuthGuard)
  async deleteUser(@Param('userId',ParseIntPipe) userID: number) {
    return await this.adminService.deleteUser(userID);
  }

//14 Admin Manage Users gigs 
  @Get('gigs/:status')
  //@UseGuards(AuthGuard)
  async getGigsByStatus(@Param('status') status: string): Promise<GigEntity[]> {
    if (status === 'unapproved') {
      return this.adminService.getUnapprovedGigs();
    } else if (status === 'approved') {
      return this.adminService.getApprovedGigs();
    } else {
      throw new Error('Invalid status parameter');
    }
  }
//15
  @Post('gigs/control-approval/:gigId')
  //@UseGuards(AuthGuard)
  async toggleGigApproval(@Param('gigId',ParseIntPipe) gigId: number): Promise<GigEntity> {
    return await this.adminService.toggleGigApproval(gigId);
  }

//16
@Patch('logout')
// @UseGuards(AuthGuard)
async logout(){
 return await this.adminService.logout();
}


}
