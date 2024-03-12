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
} from '@nestjs/common';
import { AdminService } from './admin.service';
import {
  AdminRegDto, logDto,
} from './dto/admin.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterError, diskStorage } from 'multer';
import * as bcrypt from 'bcrypt';
import { UserDto } from './dto/user.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  
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

  @Get(':adminId')
  async getAdminInfo(@Param('adminId',ParseIntPipe) adminId: number) {
    return await this.adminService.getAdminInfo(adminId);
  }


  @Post('login')
  @UsePipes(new ValidationPipe())
  async Adminlogin(@Body() logdata:logDto){
    return await this.adminService.Adminlogin(logdata)
  }

  @Post('users/create-user')
  @UsePipes(new ValidationPipe())
  async CreateUser(@Body() userdata : UserDto) {
      return await this.adminService.CreateUser(userdata)
  }

}
