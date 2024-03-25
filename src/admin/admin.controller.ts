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
// import { AdditionalInfoEntity } from './entities/AdditionalInfo.entity';



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
    const salt = await bcrypt.genSalt();
    const hassedpassed = await bcrypt.hash(adminReg.password, salt);
    adminReg.password = hassedpassed
    adminReg.path = file.path
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
  @Get('view-profile/own')
  @UseGuards(AuthGuard)
  async getAdminInfo(@Req() req) {
    const token = req.headers.authorization.replace('Bearer ', ''); 
    return await this.adminService.getAdminInfo(token);
  }
//5
  @Delete('delete-account/own')
  @UseGuards(AuthGuard)
  async deleteAdminInfo(@Req() req) {
    const token = req.headers.authorization.replace('Bearer ', '');
    return await this.adminService.deleteAdminInfo(token);
  }
//6
  @Patch('edit-profile/own')
  @UseGuards(AuthGuard)
  async editAdmin(@Body()editdata:Partial<AdminRegEntity>,@Req() req){
    const token = req.headers.authorization.replace('Bearer ', ''); 
    return await this.adminService.editAdmin(token,editdata)

  }

//7
@Post("add-more-info")
@UsePipes(new ValidationPipe())
@UseGuards(AuthGuard) 
async addMoreInfo(@Body() additionalInfo: AdditionalInfoDto, @Req() req){
  const token = req.headers.authorization.replace('Bearer ', ''); 
  return this.adminService.AddmoreInfo(additionalInfo, token);
  
}
//8
@Patch("edit-more-info")
@UsePipes(new ValidationPipe())
@UseGuards(AuthGuard) 
async editMoreInfo(@Body() additionalInfo: AdditionalInfoDto, @Req() req){
  const token = req.headers.authorization.replace('Bearer ', ''); 
  return this.adminService.editmoreInfo(additionalInfo, token);
}
//9
@Post('send-announcement')
@UsePipes(new ValidationPipe())
@UseGuards(AuthGuard) 
  async sendAnnouncement(@Body() announcementDto: AnnouncementDto,@Req() req) {
    const token = req.headers.authorization.replace('Bearer ', ''); 
    return this.adminService.sendAnnouncement(announcementDto,token);
  }

//10
@Delete('delete-announcement/:id')
@UseGuards(AuthGuard) 
async deleteAnnouncement(@Param('id',ParseIntPipe) id:number,@Req() req){
  const token = req.headers.authorization.replace('Bearer ', ''); 
    return this.adminService.deleteAnnouncement(id,token);
}


//11Admin Manage Users
  @Post('users/create-user')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async CreateUser(@Body() userdata : UserDto,@Req() req) {
      const token = req.headers.authorization.replace('Bearer ', ''); 
      return await this.adminService.CreateUser(userdata,token)
  }

//12
  @Get('users/all')
  @UseGuards(AuthGuard)
  async getAllUsers() {
    return await this.adminService.getAllUsers();
  }

//13
  @Patch('users/edit-user/:userID')
  @UseGuards(AuthGuard)
  async editUser(@Param("userID",ParseIntPipe) userID, @Body()editdata:Partial<UserEntity>){
    return await this.adminService.editUser(userID,editdata)
  }

//14
  @Delete('users/delete/:userId')
  @UseGuards(AuthGuard)
  async deleteUser(@Param('userId',ParseIntPipe) userID: number) {
    return await this.adminService.deleteUser(userID);
  }

//15 Admin Manage Users gigs 
  @Get('gigs/:status')
  @UseGuards(AuthGuard)
  async getGigsByStatus(@Param('status') status: string): Promise<GigEntity[]> {
    if (status === 'unapproved') {
      return this.adminService.getUnapprovedGigs();
    } else if (status === 'approved') {
      return this.adminService.getApprovedGigs();
    } else {
      throw new Error('Invalid status parameter');
    }
  }
//16
  @Post('gigs/control-approval/:gigId')
  @UseGuards(AuthGuard)
  async toggleGigApproval(@Param('gigId',ParseIntPipe) gigId: number): Promise<GigEntity> {
    return await this.adminService.toggleGigApproval(gigId);
  }

//17
@Post('logout')
@UseGuards(AuthGuard)
async logout(){
 return await this.adminService.logout();
}


}
