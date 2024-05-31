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
import { CreateCommentDTO } from "./dto/create-comment.dto";
import { CreateLikeDTO } from "./dto/create-like.dto";
import { CreateViewDTO } from "./dto/create-view.dto";

@Controller("video")
export class VideoController {
  constructor(
    private readonly videoService: VideoService,
    private readonly responseHelper: ResponseHelper,
  ) {}

  @Post()
  createComment(createCommentDTO: CreateCommentDTO){
    return this.videoService.createComment(createCommentDTO);
  }
  @Post()
  addOrRemoveLike(@Body() createLikeDTO: CreateLikeDTO){
    return this.videoService.addOrRemoveLike(createLikeDTO);
  }
  @Post()
  create(@Body() createVideoDto: CreateVideoDto) {
    return this.videoService.create(createVideoDto);
  }
  @Post()
  addOrRemoveDislike(createLikeDTO: CreateLikeDTO){
    return this.videoService.addOrRemoveDislike(createLikeDTO);
  }

  @Post()
  createView(createViewDTO:CreateViewDTO){
    return this.videoService.createView(createViewDTO)
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
<<<<<<< Updated upstream
=======
  @Get("search")
  async searchVideos(@Query("q") text:string){
    const videos = this.videoService.searchVideos(text);
    return videos;
  }
>>>>>>> Stashed changes

  @Patch(":id")
  async update(@Param("id",ParseIntPipe) id: string, @Body() updateVideoDto: UpdateVideoDto) {
    return await this.videoService.update(+id, updateVideoDto);
  }

  @Delete(":id")
  remove(@Param("id",ParseIntPipe) id: number) {
    return this.videoService.remove(+id);
  }
}
