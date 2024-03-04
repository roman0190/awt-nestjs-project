import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { AdminAuthDto } from 'src/admin/dto/admin.dto';
import { AdminAuthService } from './admin-auth.service';


@Controller('')
export class AdminAuthController {
    constructor(private readonly AdminAuthService: AdminAuthService) {}
    
    @Post('admin/auth')
    @UsePipes(new ValidationPipe())
    AdminAuth(@Body() AdminAuthdto: AdminAuthDto) {
      console.log('Admin Information:', AdminAuthdto);
      return this.AdminAuthService.AdminAuth(AdminAuthdto);
    }
}
