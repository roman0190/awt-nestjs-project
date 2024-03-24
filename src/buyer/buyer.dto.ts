// buyer.dto.ts
import { Optional } from '@nestjs/common';
import { IsString, IsEmail, MinLength, Matches, IsIn, IsPhoneNumber, Contains, IsNotEmpty } from 'class-validator';


export class BuyerDto {

  @Optional()
  Id:number;

  @IsString()
  @MinLength(4)
  name: string;

  @IsEmail()
  @Contains('')
  email: string;

  @IsString()
  @MinLength(6)
  @Matches(/^(?=.*[A-Z]).*$/)
  password: string;

  @IsIn(['male', 'female'])
  gender: string;

  @IsString()
  @Matches(/^[0-9]+$/)
  phone: string;

  // @Contains('')
  // profilePicture:string;

  filename: string;

  @Optional()
  orders:any;

  @Optional()
  address:any;
}

export class loginDTO{
  @IsEmail() 
  email: string;
  @IsNotEmpty() 
  password: string;    
}


export class addressDto{
// Address related properties

@Optional()
id:number;

@IsString()
street: string;

@IsString()
city: string;

@Optional()
buyer:any;

}


export class orderDto{
// Order related properties

@Optional()
id:number;

@IsString()
product: string;

@Optional()
buyer:any;

}

































// export class ProfilePictureDto {
//   base64Image: string;
// }

// export class ValidateFilePipe implements PipeTransform {
//   transform(value: any) {
//     const allowedExtensions = ['jpg'];
//     const fileExtension = value.originalname.split('.').pop();
//     if (!allowedExtensions.includes(fileExtension)) {
//       throw new BadRequestException('Invalid file format. Only JPG files are allowed.');
//     }
//     return value;
//   }
// }


// export class BuyerDto {
//     name: string;
//     email: string;
//     password: string;
//     gender: string;
//     phoneNumber:string;
//     }