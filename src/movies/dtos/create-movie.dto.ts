import { IsArray, IsOptional, IsString } from "class-validator";

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
}
