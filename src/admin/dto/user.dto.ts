import { IsString, IsEmail, Matches, IsDateString, IsUrl, IsNotEmpty, MaxLength, IsIn, } from 'class-validator';
import { AdminRegEntity } from '../entities/admin.entity';
export class UserDto {

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

    @IsString()
    @IsIn(['seller', 'buyer', 'moderator'], { message: 'Invalid role. Must be one of:seller, buyer, moderator' })
    role: string;

    admin:AdminRegEntity

}