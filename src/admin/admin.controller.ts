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
  Res,
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
  //0.1
  @Get('mail')
  async mail(){
    return await this.adminService.mail();
  }
//1 Admin
  @Post('register')
  @UsePipes(new ValidationPipe())
  async AdminReg(@Body() adminReg: AdminRegDto) {
    const salt = await bcrypt.genSalt();
    const hassedpassed = await bcrypt.hash(adminReg.password, salt);
    adminReg.password = hassedpassed
    return await this.adminService.AdminReg(adminReg);
  }

//1.1
@Post('uploadpfp')
@UseGuards(AuthGuard)
@UseInterceptors(
  FileInterceptor('file', {
    fileFilter: (req, file, cb) => {
      if (file.originalname.match(/\.(jpg|webp|png|jpeg|JPG|heic)$/)) {
        cb(null, true);
      } else {
        cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);
      }
    },
    limits: { fileSize: 300000000 },
    storage: diskStorage({
      destination: './uploads/profilePic',
      filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname);
      },
    }),
  }),
)
async uploadpfp(@Body() filename : string,@UploadedFile() file: Express.Multer.File,@Req() req ){
  const user = req.user
  filename = file.filename
  return await this.adminService.uploadpfp(user,filename)
}

//1.2
@Get('profilePic/:filename')
  async getProfilePic(@Param('filename') filename: string, @Res() res){
    try {
      if(!filename || filename ==="null"){
        res.sendFile("Placeholder.png", { root: './uploads/profilePic/' });
        return;
      }
      res.sendFile(filename, { root: './uploads/profilePic' });
      return;
    } catch (error) {
      return errorResponse(error);

    }
  }

//2
  @Post('login')
  @UsePipes(new ValidationPipe())
  async Adminlogin(@Body() logdata:logDto){
    return await this.adminService.Adminlogin(logdata)
  }
//3
  @Get('all')
  // @UseGuards(AuthGuard)
  async getAllAdmins() {
    return await this.adminService.getAllAdmins();
  }
//3.1
  @Get('search/:name')
  async searchAdminByName(@Param("name") name :string ){
    return await this.adminService.searchAdminByName(name)
  }
  @Get('profile/:id')
  async searchAdminById(@Param("id") id :number ){
    return await this.adminService.searchAdminById(id)
  }
//3.2
@Delete('delete/:adminId')
  async deleteAdminById(@Param('adminId', ParseIntPipe) id: number) {
    return await this.adminService.deleteAdminById(id);
  }
//4

  @Get('view-profile/own')
  @UseGuards(AuthGuard)
  async getAdminInfo(@Req() req) {
    const user = req.user
    // console.log(admin)
    return await this.adminService.getAdminInfo(user);
  }
//5
  @Delete('delete-account/own')
  @UseGuards(AuthGuard)
  async deleteAdminInfo(@Req() req) {
    const user = req.user
    return await this.adminService.deleteAdminInfo(user);
  }
//6
  @Patch('edit-profile/own')
  @UseGuards(AuthGuard)
  async editAdmin(@Body()editdata:Partial<AdminRegEntity>,@Req() req){
    const user = req.user
    return await this.adminService.editAdmin(user,editdata)

  }

//7
@Post("add-more-info")
@UsePipes(new ValidationPipe())
@UseGuards(AuthGuard) 
async addMoreInfo(@Body() additionalInfo: AdditionalInfoDto, @Req() req){
  const user = req.user
  return this.adminService.AddmoreInfo(additionalInfo, user);
  
}
//8
@Patch("edit-more-info")
@UsePipes(new ValidationPipe())
@UseGuards(AuthGuard) 
async editMoreInfo(@Body() additionalInfo: AdditionalInfoDto, @Req() req){
  const user = req.user
  return this.adminService.editmoreInfo(additionalInfo, user);
}
//9
@Post('send-announcement')
@UsePipes(new ValidationPipe())
@UseGuards(AuthGuard) 
  async sendAnnouncement(@Body() announcementDto: AnnouncementDto,@Req() req) {
    const user = req.user
    return this.adminService.sendAnnouncement(announcementDto,user);
  }
//9.1
@Get('all-announcement')
async getAllAnnouncement() {
  return await this.adminService.getAllAnnouncement();
}

//10
@Delete('delete-announcement/:id')
@UseGuards(AuthGuard) 
async deleteAnnouncement(@Param('id',ParseIntPipe) id:number,@Req() req){
  const user = req.user 
    return this.adminService.deleteAnnouncement(id,user);
}

//Admin Manage Users
//11
  @Post('users/create-user')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async CreateUser(@Body() userdata : UserDto,@Req() req) {
    const user = req.user
      return await this.adminService.CreateUser(userdata,user)
  }

//12
  @Get('users/all')
  // @UseGuards(AuthGuard)
  async getAllUsers() {
    return await this.adminService.getAllUsers();
  }

//13

  @Patch('users/edit-user/:userID')
  @UseGuards(AuthGuard)
  async editUser(@Param("userID",ParseIntPipe) userID, @Body()editdata:Partial<UserEntity>){
    return await this.adminService.editUser(userID,editdata)
  }
 //13.1 
  @Get('users/search-user/:userID')
  // @UseGuards(AuthGuard)
  async searchUser(@Param("userID",ParseIntPipe) userID){
    return await this.adminService.searchUser(userID)
  }

//14
  @Delete('users/delete/:userId')
  // @UseGuards(AuthGuard)
  async deleteUser(@Param('userId',ParseIntPipe) userID: number) {
    return await this.adminService.deleteUser(userID);
    
  }

//14.1
@Get('gigs/all')
// @UseGuards(AuthGuard)
async getAllGigs(): Promise<GigEntity[]> {
  return this.adminService.getAllGigs();
}
//14.2
@Get('gigs/search/:id')
// @UseGuards(AuthGuard)
async searchGigById(@Param('id') id: number) {
  return await this.adminService.searchGigById(id);
}
14.3
@Delete('gig/delete/:id')
async deleteGigById(@Param('id') id: number) {
  return await this.adminService.deleteGigById(id);
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
  // @UseGuards(AuthGuard)
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
function errorResponse(error: any) {
  throw new Error('Function not implemented.');
}

