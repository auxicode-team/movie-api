import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";

import { ResponseBody } from "../utils/ResponseBody";
import { Movie } from "./movie.model";
import { MoviesService } from "./movies.service";
import { CategoriesService } from "../categories/categories.service";
import { CloudinaryService } from "../cloudinary/cloudinary.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { MultipleImageUploadInterceptor } from "../interceptors/MultipleImageUploadInterceptor";
import { CreateMovieDto } from "./dtos/create-movie.dto";
import { UpdateMovieDto } from "./dtos/update-movie.dto";

@Controller("movies")
export class MoviesController {
  constructor(
    private readonly moviesService: MoviesService,
    private readonly categoriesService: CategoriesService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Get("/getAll")
  async getAllMovies(): Promise<ResponseBody<Movie[]>> {
    const allMovies = await this.moviesService.getAll();

    return {
      message: "All Movies",
      data: allMovies,
    };
  }

  @Get("/get/:id")
  async getSingleMovie(@Param("id") id: string): Promise<ResponseBody<Movie>> {
    const movie = await this.moviesService.findById(id);

    if (!movie) {
      throw new NotFoundException("Movie Not Found");
    }

    return {
      message: "Movie details",
      data: movie,
    };
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(MultipleImageUploadInterceptor(3 * 1024 * 1024, 3))
  @Post("/create")
  async createMovie(
    @Body() body: CreateMovieDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ): Promise<ResponseBody<Movie>> {
    if (!files) {
      throw new BadRequestException("Please provide movie image");
    }
    const isValidCategory = await this.categoriesService.isExists(
      body.category,
    );
    if (!isValidCategory) {
      throw new BadRequestException("This category doesnot exists");
    }

    const fileUploadedResult = await this.cloudinaryService.uploadImages(
      "Movie",
      files,
    );

    const imageUrls: string[] = [];
    for (let i = 0; i < fileUploadedResult.length; i++) {
      imageUrls.push(fileUploadedResult[i].url);
    }
    const movie = await this.moviesService.create({
      ...body,
      images: imageUrls,
    });

    return {
      message: "Movie Created Successfully",
      data: movie,
    };
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(MultipleImageUploadInterceptor(3 * 1024 * 1024, 3))
  @Patch("/update/:id")
  async updateMovie(
    @Param("id") id: string,
    @Body() body: UpdateMovieDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ): Promise<ResponseBody<Movie>> {
    const dataToUpdate = { ...body };

    if (body.category) {
      const isValidCategory = await this.categoriesService.isExists(
        body.category,
      );
      if (!isValidCategory) {
        throw new BadRequestException("This category doesnot exists");
      }
    }
    if (files && files.length > 0) {
      const fileUploadedResult = await this.cloudinaryService.uploadImages(
        "Movie",
        files,
      );
      const imageUrls: string[] = [];
      for (let i = 0; i < fileUploadedResult.length; i++) {
        imageUrls.push(fileUploadedResult[i].url);
      }

      dataToUpdate.images = imageUrls;
    }

    const movie = await this.moviesService.update(id, dataToUpdate);

    return {
      message: "Movie Updated Successfully",
      data: movie,
    };
  }

  @Delete("/:id")
  async delete(@Param("id") id: string): Promise<any> {
    return this.moviesService.delete(id);
  }
}
