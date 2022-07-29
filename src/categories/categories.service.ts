import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { FilterQuery, Model } from "mongoose";
import { DeleteResult } from "mongodb";

import { Category } from "./category.model";
import { CreateCategoryDto } from "./dtos/create-category-dto";
import { UpdateCategoryDto } from "./dtos/update-category-dto";

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel("Category") private readonly categoryModel: Model<Category>,
  ) {}

  async isNameAlreadyExist(criteria: {
    id?: string;
    name: string;
  }): Promise<boolean> {
    const { id, name } = criteria;
    let result;

    if (id) {
      result = await this.categoryModel.findOne({
        _id: { $nin: [id] },
        name,
      });
    } else {
      result = await this.categoryModel.findOne({ name });
    }

    if (result) {
      return true;
    }
    return false;
  }

  async isExists(id: string): Promise<boolean> {
    return this.categoryModel.exists({ _id: id });
  }

  create(data: CreateCategoryDto): Promise<Category> {
    const { name, description } = data;

    const newCategory = new this.categoryModel({
      name,
      description,
    });

    return newCategory.save();
  }

  async findById(id: string): Promise<Category | null> {
    return this.categoryModel.findById(id);
  }

  async findOne(criteria: FilterQuery<Category>): Promise<Category | null> {
    return this.categoryModel.findOne(criteria);
  }

  async getAll(): Promise<Category[]> {
    return this.categoryModel.find({});
  }

  async update(id: string, data: UpdateCategoryDto): Promise<Category> {
    const category = await this.findById(id);

    if (!category) {
      throw new NotFoundException("Category Not Found");
    }

    category.set(data);
    return category.save();
  }

  async delete(id: string): Promise<DeleteResult> {
    const category = await this.findById(id);

    if (!category) {
      throw new NotFoundException("Category Not Found");
    }

    return this.categoryModel.deleteOne({ _id: id });
  }
}
