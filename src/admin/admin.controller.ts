import { Controller, Get,Put, Post, Body, Param, Query, Patch, Delete, ValidationPipe, UsePipes } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminLoginDto, AdminRegistrationDto, CreateUserDto } from './admin.dto';


@Controller()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('admin/registration')
  @UsePipes(new ValidationPipe)
  adminRegistration(@Body() adminRegistration:AdminRegistrationDto) {
    console.log('Rrgistration Info:', adminRegistration);
    return this.adminService.adminRegistration(adminRegistration);
  }

  @Post('admin/login')
  @UsePipes(new ValidationPipe)
  adminLogin(@Body() AdminLoginDto: AdminLoginDto) {
    console.log('Login Info:', AdminLoginDto);
    return this.adminService.login(AdminLoginDto);
  }

  @Post('admin/logout')
  adminLogout() {
    return this.adminService.logoutUsers();
  }
  
  @Get('admin/get-all-user')
  getAllUser() {
    return this.adminService.getAllUser();
  }

  @Get('admin/:usrId')
  getUserById(@Param('userId') userId: string) {
    return this.adminService.getUserById(userId);
  }

  @Post('admin/createUser')
  createUser(@Body() createUser : CreateUserDto) {
    return this.adminService.createUser(createUser);
  }

  @Patch('admin/edit-user/:userId')
  editUser(@Param('userId') userId: string, @Body() editUserDto: object) {
    return this.adminService.editUser(userId, editUserDto);
  }

  @Delete(':userId')
  deleteUser(@Param('userId') userId: string) {
    return this.adminService.deleteUser(userId);
  }

  @Put(':userId')
  putUser(@Param('userId') userId: string) {
    return this.adminService.putUser(userId);
  }
}
