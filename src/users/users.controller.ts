import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { DeleteResult } from "mongodb";

import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user-dto";
import { ResponseBody } from "../utils/ResponseBody";
import { Role, User } from "./user.model";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post("/create")
  async createUser(@Body() createUserDto: CreateUserDto) {
    if (await this.usersService.doesUserExists(createUserDto.email)) {
      return {
        message: "User already exists",
      };
    }

    const user = await this.usersService.insertUser(createUserDto);
    return {
      message: "User has been created successfully",
      user,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard(Role.ADMIN))
  @Get("/getAll")
  async getAllUser(@Query() query: any): Promise<ResponseBody<User[]>> {
    const { page = 1, limit = 40 } = query;

    const allUsers = await this.usersService.findAll(page, limit);

    return {
      message: "All User data",
      data: allUsers,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard(Role.ADMIN))
  @Delete("/delete/:id")
  async deleteUser(
    @Param("id") id: string,
  ): Promise<ResponseBody<DeleteResult>> {
    const result = await this.usersService.delete(id);

    return {
      message: "User Deleted Successfully",
      data: result,
    };
  }
}
