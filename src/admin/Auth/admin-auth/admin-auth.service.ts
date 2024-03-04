import { Injectable } from '@nestjs/common';
import { AdminAuthDto } from 'src/admin/dto/admin.dto';

@Injectable()
export class AdminAuthService {
    
    AdminAuth(AdminAuthdto: AdminAuthDto) {
        return { message: ' Data Updated successfully' };
      }
}
