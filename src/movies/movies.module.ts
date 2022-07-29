import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { MoviesController } from "./movies.controller";
import { MoviesService } from "./movies.service";
import { MovieSchema } from "./movie.model";
import { CloudinaryModule } from "../cloudinary/cloudinary.module";
import { CategoriesModule } from "../categories/categories.module";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: "Movie", schema: MovieSchema }]),
    CloudinaryModule,
    CategoriesModule,
  ],
  controllers: [MoviesController],
  providers: [MoviesService],
  exports: [MoviesService],
})
export class MoviesModule {}
