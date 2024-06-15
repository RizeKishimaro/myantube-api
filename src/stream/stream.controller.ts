import {
  BadRequestException,
  Controller,
  Get,
  Query,
  Req,
  Res,
  ParseIntPipe
} from "@nestjs/common";
import axios from "axios";
import { StreamService } from "./stream.service";
import { PrismaService } from "../utils/prisma.service";
import { FactoryService } from "../factory/factory.service";

@Controller("stream")
export class StreamController {
  constructor(
    private readonly streamService: StreamService,
    private readonly prisma: PrismaService,
    private readonly factoryService: FactoryService,
  ) {}

  @Get()
  async startStream(
    @Req() request: any,
    @Res() response: any,
    @Query("video",ParseIntPipe) id: number,
  ) {
    const range = request.headers.range || "1";
  if (!range) {
    throw new BadRequestException({
      code: 299,
      message: 'Bad range header or does not exist.',
    });
  }
  // Fetch the video URL from the database
  const query = await this.prisma.video.findFirst({
    where: {
      id: +id,
    },
    select: {
      urlHd: true,
      urlSd: true,
    },
  });

  if (!query) {
    throw new BadRequestException({
      code: 404,
      message: 'Video not found.',
    });
  }

  const videoUrl = query.urlHd || query.urlSd;

  try {
    // Get video metadata to determine its size
    const headResponse = await axios.head(videoUrl);
    const videoSize = headResponse.headers['content-length'];
    const videoType = headResponse.headers['content-type'] || 'video/mp4';

    const CHUNK_SIZE = 10 ** 6; // 1MB
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

    const headers = {
      'Content-Range': `bytes ${start}-${end}/${videoSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': end - start + 1,
      'Content-Type': videoType,
    };

    const videoResponse = await axios.get(videoUrl, {
      responseType: 'stream',
      headers: {
        Range: `bytes=${start}-${end}`,
      },
    });

       } catch (error) {
      if (error.response.status === 403) {
        const { originalUrl } = await this.prisma.video.findUnique({
          where: { id },
        });
        const { duration_ms, hd, sd, url } =
          await this.factoryService.scrapFacebookURL(originalUrl);
        console.log(url);
        await this.prisma.video.update({
          where: { id },
          data: {
            duration: duration_ms,
            originalUrl: url,
            urlHd: hd,
            urlSd: sd,
          },
        });
      }
      console.error("Error streaming video:", error.response);
      response.status(500).send("Error streaming video");
    }
  }
}
