import {
  BadRequestException,
  Controller,
  Get,
  Query,
  Req,
  Res,
} from "@nestjs/common";
import axios from 'axios';
import { StreamService } from "./stream.service";
import { PrismaService } from "../utils/prisma.service";

@Controller("stream")
export class StreamController {
  constructor(
    private readonly streamService: StreamService,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  async startStream(
    @Req() request: any,
    @Res() response: any,
    @Query("video") id: number,
  ) {
    const range = request.headers.range ?? '0';
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

    const videoUrl = query.urlHd || query.urlSd 

    try {
      const videoResponse = await axios.get(videoUrl, {
        responseType: 'stream',
        headers: {
          Range: range,
        },
      });

      const headers = {
        'Content-Range': videoResponse.headers['content-range'],
        'Accept-Ranges': 'bytes',
        'Content-Length': videoResponse.headers['content-length'],
        'Content-Type': 'video/mp4',
      };

      response.writeHead(206, headers);

      videoResponse.data.pipe(response);
    } catch (error) {
      console.error('Error streaming video:', error.message);
      response.status(500).send('Error streaming video');
    }
  }
}
