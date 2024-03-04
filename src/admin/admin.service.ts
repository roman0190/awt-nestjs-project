import { Injectable } from '@nestjs/common';
import { AdminLoginDto, AdminRegistrationDto } from './dto/admin.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from './entities/admin.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
  ) {}

  async adminRegistration(adminRegistration: AdminRegistrationDto):Promise<Admin>  {
    return await this.adminRepository.save(adminRegistration);
  }

  async getAllUsers(): Promise<Admin[]> {
    return await this.adminRepository.find();
  }

  async getUserById(id: number): Promise<Admin> {
    return await this.adminRepository.findOneBy({id:id});
  }
  
  async deleteUser(id: number): Promise<void> {
     await this.adminRepository.delete(id);

  }
  
  async updateUser(id: number,updatedUser: AdminRegistrationDto):Promise<Admin>{
    await this.adminRepository.update(id, updatedUser);
    return this.adminRepository.findOneBy({id:id});
  }

  login(AdminLoginDto: AdminLoginDto) {
    return { message: `Dear, ${AdminLoginDto.username} Login Successful` };
  }
  logoutUsers(): object {
    return { message: 'Logout Successfully' };
  }

  createUser(createUser: object) {
    return { message: 'User created successfully' };
  }

  editUser(userId: string, editUser: object) {
    return { message: `User with ID ${userId} edited successfully` };
  }


}
