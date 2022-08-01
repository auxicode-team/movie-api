import { ArrayMinSize, IsArray, IsOptional, IsString } from "class-validator";

export class CreateMovieDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  category: string;

  @IsArray()
  @IsOptional()
  images: any[];

  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  casts: string[];

  @IsString()
  @IsOptional()
  rating: string;

  @IsString()
  release_date: string;
}
