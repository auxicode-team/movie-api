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
  UseGuards,
} from "@nestjs/common";
import { DeleteResult } from "mongodb";

import { ResponseBody } from "../utils/ResponseBody";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { CategoriesService } from "./categories.service";
import { Category } from "./category.model";
import { CreateCategoryDto } from "./dtos/create-category-dto";
import { UpdateCategoryDto } from "./dtos/update-category-dto";

@Controller("categories")
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @UseGuards(JwtAuthGuard)
  @Post("/create")
  async createCategory(
    @Body() body: CreateCategoryDto,
  ): Promise<ResponseBody<Category>> {
    // check if already has a category with this name
    const duplicateCategoryName =
      await this.categoriesService.isNameAlreadyExist({
        name: body.name,
      });

    if (duplicateCategoryName) {
      throw new BadRequestException("A Category with this name already exists");
    }

    const category = await this.categoriesService.create(body);

    return {
      message: "Category Created Successfully",
      data: category,
    };
  }

  @Get("/getAll")
  async getAllCategories(): Promise<ResponseBody<Category[]>> {
    const allCategories = await this.categoriesService.getAll();

    return {
      message: "All categories",
      data: allCategories,
    };
  }

  @Get("/get/:id")
  async getSingleCategory(
    @Param("id") id: string,
  ): Promise<ResponseBody<Category>> {
    const category = await this.categoriesService.findById(id);

    if (!category) {
      throw new NotFoundException("Category Not Found");
    }

    return {
      message: "Category details",
      data: category,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Patch("/update/:id")
  async updateCategory(
    @Param("id") id: string,
    @Body() body: UpdateCategoryDto,
  ): Promise<ResponseBody<Category>> {
    // check if already has a category with this name
    const duplicateCategoryName =
      await this.categoriesService.isNameAlreadyExist({
        id,
        name: body.name,
      });

    if (duplicateCategoryName) {
      throw new BadRequestException("A Category with this name already exists");
    }

    const category = await this.categoriesService.update(id, body);

    return {
      message: "Category Updated Successfully",
      data: category,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete("/delete/:id")
  async deleteCategory(
    @Param("id") id: string,
  ): Promise<ResponseBody<DeleteResult>> {
    const result = await this.categoriesService.delete(id);

    return {
      message: "Category Deleted Successfully",
      data: result,
    };
  }
}
