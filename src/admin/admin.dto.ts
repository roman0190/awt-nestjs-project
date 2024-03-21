import { IsString, IsEmail, Matches, IsDateString, IsUrl, IsNotEmpty, MaxLength } from 'class-validator';

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


export class AdminAuthDto {

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

    @IsNotEmpty({message: "At least 1 platform link needed"})
    @IsUrl({}, { message: 'Invalid URL format for social media link' })
    social_link:string
    
    @MaxLength(11, { message: 'Number field must be at most 11 characters long' })
    @Matches(/^[0-9]+$/, { message: 'Phone number field must contain only digits' })
    number: string;

   
}