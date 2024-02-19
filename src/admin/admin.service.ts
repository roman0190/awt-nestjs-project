import { Injectable } from '@nestjs/common';
import { AdminLoginDto, AdminRegistrationDto, AdminAuthDto} from './admin.dto';

@Injectable()
export class AdminService {
  adminRegistration(adminRegistration: AdminRegistrationDto) {
    return {
      message: `User Registration Successful. Name: ${adminRegistration.username} and Email:${adminRegistration.email}`,
    };
  }

  login(AdminLoginDto: AdminLoginDto) {
    return { message: `Dear, ${AdminLoginDto.username} Login Successful` };
  }
  logoutUsers(): object {
    return { message: 'Logout Successfully' };
  }

  getAllUser(): object {
    return { message: 'All Users..' };
  }
  getUserById(userId: string): { message: string } {
    return { message: `Successfully retrieved user with ID ${userId}` };
  }

  createUser(createUser: object) {
    return { message: 'User created successfully' };
  }

  editUser(userId: string, editUser: object) {
    return { message: `User with ID ${userId} edited successfully` };
  }

  deleteUser(userId: string): { message: string } {
    return { message: `User with ID ${userId} deleted successfully` };
  }
  updateUser() {
    return { message: 'user updated Successfully' };
  }

  putUser(userId: string): { message: string } {
    return { message: `User with ID ${userId} updated successfully` };
  }

  AdminAuth(AdminAuthdto:AdminAuthDto){

    return {message:" Data Updated successfully"};

  }
}
