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
} from '@nestjs/common';
import { AdminService } from './admin.service';
import {
  AdminAuthDto,
  AdminLoginDto,
  AdminRegistrationDto,
  CreateUserDto,
} from './dto/admin.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('admin/registration')
  @UsePipes(new ValidationPipe())
  async adminRegistration(@Body() adminRegistration: AdminRegistrationDto) {
    console.log('Rrgistration Info:', adminRegistration);
    return await this.adminService.adminRegistration(adminRegistration);
  }
  @Get('admin/get-all-user')
  async getAllUsers() {
    return await this.adminService.getAllUsers();
  }

  @Get('admin/:userId')
  async getUserById(@Param('userId') id: number) {
    return this.adminService.getUserById(id);
  }

  @Delete('admin/delete-user/:userId')
  deleteUser(@Param('userId') id: number) {
    return this.adminService.deleteUser(id);
  }
  
  @Put('admin/update-user/:userId')
  updateUser(@Param('userId') id: number, @Body() updatedUser:AdminRegistrationDto) {
    return this.adminService.updateUser(id,updatedUser);
  }

  @Post('admin/login')
  @UsePipes(new ValidationPipe())
  adminLogin(@Body() AdminLoginDto: AdminLoginDto) {
    console.log('Login Info:', AdminLoginDto);
    return this.adminService.login(AdminLoginDto);
  }

  @Post('admin/logout')
  adminLogout() {
    return this.adminService.logoutUsers();
  }

  @Post('admin/createUser')
  createUser(@Body() createUser: CreateUserDto) {
    return this.adminService.createUser(createUser);
  }

  @Post('admin/upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
    return file;
  }

  @Patch('admin/edit-user/:userId')
  editUser(@Param('userId') userId: string, @Body() editUserDto: object) {
    return this.adminService.editUser(userId, editUserDto);
  }


}
