import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query
} from "@nestjs/common";
import { VideoService } from "./video.service";
import { CreateVideoDto } from "./dto/create-video.dto";
import { UpdateVideoDto } from "./dto/update-video.dto";
import { ResponseHelper } from "../utils/responseHelper.service";
import { PrismaClient } from "@prisma/client";

@Controller("video")
export class VideoController {
  constructor(
    private readonly videoService: VideoService,
    private readonly responseHelper: ResponseHelper,
  ) {}

  @Post()
  create(@Body() createVideoDto: CreateVideoDto) {
    return this.videoService.create(createVideoDto);
  }

  @Get()
  findAll() {
    return this.videoService.findAll();
  }
  @Get("seed")
  async seedVideo() {
    await this.videoService.seedVideos();
    return "Success!";
  }
  @Get("search")
  async searchVideos(@Query("q") text:string){
    const videos = this.videoService.searchVideos(text);
    return videos;
  }
  @Get(":id")
  async findOne(@Param("id",ParseIntPipe) id: number) {
    const data = await this.videoService.findOne(+id);
    return this.responseHelper.sendSuccessMessage(
      "Successfully Searched",
      200,
      data,
    );
  }

  @Patch(":id")
  async update(@Param("id",ParseIntPipe) id: string, @Body() updateVideoDto: UpdateVideoDto) {
    return await this.videoService.update(+id, updateVideoDto);
  }

  @Delete(":id")
  remove(@Param("id",ParseIntPipe) id: number) {
    return this.videoService.remove(+id);
  }
}
