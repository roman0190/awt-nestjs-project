import { PartialType } from '@nestjs/mapped-types';
import {
  IsAlphanumeric,
  IsEmail,
  IsEmpty,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SellerSignUpDto {
  @IsString({ message: 'username must be a string.' })
  @IsAlphanumeric(undefined, { message: 'username must be a string.' })
  @MaxLength(20, { message: 'username cannot exceed 20 characters' })
  @IsNotEmpty({ message: 'username must not be empty.' })
  username: string;

  @IsEmail({}, { message: 'invalid email address' })
  @IsNotEmpty({ message: 'email must not be empty.' })
  email: string;

  @IsStrongPassword(
    { minLength: 8 },
    {
      message:
        'password must contain at least one upper case, one lower case, one number, one special character',
    },
  )
  @MinLength(8)
  @IsNotEmpty()
  password: string;
}
export class SellerSignInDto extends PartialType(SellerSignUpDto) {
  username: string;
  password: string;
}
export class UpdateSellerDto extends PartialType(SellerSignUpDto) {}
