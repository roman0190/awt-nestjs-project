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

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsString()
  @IsNotEmpty()
  gigImage: string;

  @IsString()
  @IsNotEmpty()
  gigThumbnail: string;
}

export class UpdateGigDto extends PartialType(CreateGigDto) {}
