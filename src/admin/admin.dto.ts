import { IsString, IsEmail } from 'class-validator';

export class AdminRegistrationDto {
    @IsString()
    username: string;

    @IsEmail()
    email: string;

   @IsString()
   password: string;
}

export class AdminLoginDto {

    @IsString()
    username: string;

   @IsString()
   password: string;
}

export class CreateUserDto {
    
    @IsString()
    username: string;

    @IsEmail()
    email: string;

   @IsString()
   password: string;

}