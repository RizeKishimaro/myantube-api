import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { VideoService } from "./video.service";
import { CreateVideoDto } from "./dto/create-video.dto";
import { UpdateVideoDto } from "./dto/update-video.dto";
import { ResponseHelper } from "../utils/responseHelper.service";

@Controller("video")
export class VideoController {
  constructor(
    private readonly videoService: VideoService,
    private readonly responseHelper: ResponseHelper
  ) {}

  @Post()
  create(@Body() createVideoDto: CreateVideoDto) {
    return this.videoService.create(createVideoDto);
  }

  @Get()
  findAll() {
    return this.videoService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    const data = this.videoService.findOne(+id);
    return this.responseHelper.sendSuccessMessage("Successfully Searched",200, data)
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateVideoDto: UpdateVideoDto) {
    return this.videoService.update(+id, updateVideoDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.videoService.remove(+id);
  }
}
