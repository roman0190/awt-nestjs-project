import {
  IsArray,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class addToPortfolioDto {
  @IsString()
  @MinLength(5)
  @MaxLength(20)
  title: string;

  @IsString()
  @MinLength(5)
  @MaxLength(1000)
  description: string;

  @IsNumber()
  gigId: string;

  @IsArray()
  relevantSkills: string[];

  @IsNumber()
  rating: number;

  @IsString()
  @MinLength(5)
  @MaxLength(20)
  reviewMessage: string;
}
