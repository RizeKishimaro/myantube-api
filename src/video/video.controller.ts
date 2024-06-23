import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
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
  @Get()
  findAll(
    @Query("page", ParseIntPipe) page: number,
    @Query("limit", ParseIntPipe) limit: number,
  ) {
    return this.videoService.findAll(page, limit);
  }
  @Get("seed")
  async seedVideo() {
    await this.videoService.seedVideos();
    return "Success!";
  }
  @Get("search")
  async searchVideos(@Query("q") text: string) {
    const videos = this.videoService.searchVideos(text);
    return videos;
  }
  @Get(":id")
  async findOne(@Param("id", ParseIntPipe) id: number) {
    const data = await this.videoService.findOne(+id);
    return this.responseHelper.sendSuccessMessage(
      "Successfully Searched",
      200,
      data,
    );
  }
  @Get(":id/comments")
  findComments(
    @Param("id", ParseIntPipe) videoId: number,
    @Query("page", ParseIntPipe) page: number,
    @Query("limit", ParseIntPipe) limit: number,
  ) {
    return this.videoService.getComments(videoId, page, limit);
  }

  @Post("createComment")
  createComment(@Body() createCommentDTO: CreateCommentDTO) {
    console.log(createCommentDTO);
    return this.videoService.createComment(createCommentDTO);
  }
  @Post("createLike")
  addOrRemoveLike(@Body() createLikeDTO: CreateLikeDTO) {
    return this.videoService.addOrRemoveLike(createLikeDTO);
  }
  @Post()
  create(@Body() createVideoDto: CreateVideoDto) {
    return this.videoService.create(createVideoDto);
  }
  @Post("createDislike")
  addOrRemoveDislike(@Body() createLikeDTO: CreateLikeDTO) {
    return this.videoService.addOrRemoveDislike(createLikeDTO);
  }

  @Post("addView")
  createView(@Body() createViewDTO: CreateViewDTO) {
    return this.videoService.createView(createViewDTO);
  }


  @Patch(":id")
  async update(
    @Param("id", ParseIntPipe) id: string,
    @Body() updateVideoDto: UpdateVideoDto,
  ) {
    return await this.videoService.update(+id, updateVideoDto);
  }

  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.videoService.remove(+id);
  }
}
