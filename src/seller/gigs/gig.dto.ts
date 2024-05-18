import { PartialType } from '@nestjs/mapped-types';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateGigDto {
  @IsString()
  @MaxLength(20)
  @MinLength(5)
  @IsNotEmpty()
  title: string;

  @IsString()
  @MaxLength(1000)
  @MinLength(10)
  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  price: number;

  // @IsNotEmpty()
  gigImage?: any;

  gigThumbnail?: any;
}

export class UpdateGigDto extends PartialType(CreateGigDto) {}
