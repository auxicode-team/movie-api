import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { FilterQuery, Model } from "mongoose";
import { DeleteResult } from "mongodb";

import { Movie } from "./movie.model";
import { CloudinaryService } from "../cloudinary/cloudinary.service";
import { CreateMovieDto } from "./dtos/create-movie.dto";
import { UpdateMovieDto } from "./dtos/update-movie.dto";
import { getPublicIdsFromImageUrl } from "../utils/getPublicIdsFromImageUrl";

@Injectable()
export class MoviesService {
  constructor(
    @InjectModel("Movie") private readonly movieModel: Model<Movie>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  create(data: CreateMovieDto): Promise<Movie> {
    const {
      title,
      description,
      category,
      images,
      casts,
      rating,
      release_date,
    } = data;

    const newMovie = new this.movieModel({
      title,
      description,
      category,
      images,
      casts,
      rating,
      release_date,
    });

    return newMovie.save();
  }

  async findById(id: string): Promise<Movie | null> {
    return this.movieModel.findById(id);
  }

  async findOne(criteria: FilterQuery<Movie>): Promise<Movie | null> {
    return this.movieModel.findOne(criteria);
  }

  async getAll(): Promise<Movie[]> {
    return this.movieModel.find({});
  }

  async update(id: string, data: UpdateMovieDto): Promise<Movie> {
    const movie = await this.findById(id);

    if (!movie) {
      throw new NotFoundException("Movie Not Found");
    }
    const previousImages = movie.images;

    movie.set(data);
    const result = await movie.save();

    // delete previous images
    if (data.images && data.images.length > 0) {
      this.cloudinaryService.deleteImages(
        getPublicIdsFromImageUrl(previousImages),
      );
    }
    return result;
  }

  async delete(id: string): Promise<DeleteResult> {
    const movie = await this.findById(id);

    if (!movie) {
      throw new NotFoundException("Movie Not Found");
    }

    // remove image from cloudinary
    this.cloudinaryService.deleteImages(getPublicIdsFromImageUrl(movie.images));

    return this.movieModel.deleteOne({ _id: id });
  }
}
