import {
  IsAlpha,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
} from 'class-validator';

export class CreateSellerDto {
  @IsString()
  @IsAlpha(undefined, { message: 'Name cannot contain a number' })
  name?: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'Invalid email format' })
  @Matches(/\.xyz$/, { message: `Email must be from .xyz domain` })
  @Matches(/.*@.*/, { message: 'Invalid email format' }) //
  email: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/.*[0-9].*/, {
    message: 'Password must contain at least one numeric character',
  })
  password: string;

  @Matches(/^\d{10}$/, {
    message: 'NID must be a number and be of length 10',
  })
  nid?: string;

  nidImage?: string;

  @IsString()
  @Matches(/^018-\d{7}$/, {
    message: 'Invalid phone number',
  })
  phone?: string;
}

export class SellerAuthLoginDto {
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
