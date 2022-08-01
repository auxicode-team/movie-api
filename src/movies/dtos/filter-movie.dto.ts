import { IsArray, IsNumber, IsOptional, IsString } from "class-validator";

export class FilterMovieDto {
  @IsOptional()
  @IsNumber()
  page: number;

  @IsOptional()
  @IsNumber()
  limit: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  category: string[];

  @IsOptional()
  @IsString()
  searchTerm: string;
}
