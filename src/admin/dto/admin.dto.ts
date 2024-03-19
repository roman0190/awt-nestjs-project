import { IsString, IsEmail, Matches, IsDateString, IsUrl, IsNotEmpty, MaxLength, IsIn, } from 'class-validator';
import { UserEntity } from '../entities/user.entity';
import { AdminRegEntity } from '../entities/admin.entity';
import { AnnouncementEntity } from '../entities/announcement.entity';

export class AdminRegDto {

    id:number

    @IsString()
    @Matches(/^[^\d]+$/, { message: 'Name field should not contain any numbers' })
    name: string;

    @IsEmail()
    @MaxLength(30, { message: 'Email Address field must be at most 30 characters long' })
    email: string;

    @IsString()
    @Matches(/[#@\$&]/, { message: 'Password field must contain one of the special characters (@, #, $, or &)' })
    password:string

    @IsDateString() 
    date: string

    @MaxLength(11, { message: 'Number field must be at most 11 characters long' })
    @Matches(/^[0-9]+$/, { message: 'Phone number field must contain only digits' })
    number: string;

    role?: string

    users: UserEntity[];

    announcements:AnnouncementEntity[]

   
}

export class AdditionalInfoDto{

    id:number

    @MaxLength(10, { message: 'NID no field must be at most 30 characters long' })
    nid_no:string

    @MaxLength(15, { message: 'Passport no field must be at most 30 characters long' })
    passport_no:string

    admin: AdminRegEntity


} 

export class logDto {
    @IsEmail()
    @IsNotEmpty({message:"Enter Email first."})
    @MaxLength(30, { message: 'Email Address field must be at most 30 characters long' })
    email: string;

    @IsString()
    @IsNotEmpty({message:"Enter passoword first."})
    password:string

    id:number

}

export class AnnouncementDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    title: string;
  
    @IsNotEmpty()
    @IsString()
    content: string;

    admin : AnnouncementEntity
  }