import { ArrayMinSize, IsArray, IsOptional, IsString } from "class-validator";

export class UpdateMovieDto {
  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  category: string;

  @IsArray()
  @IsOptional()
  images: any[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  casts: string[];

  @IsString()
  @IsOptional()
  rating: string;

  @IsString()
  @IsOptional()
  release_date: string;
}
