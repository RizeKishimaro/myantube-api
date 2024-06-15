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
import { DoHResolver } from 'dohjs';

@Controller("stream")
export class StreamController {
  private dohResolver: DoHResolver;

  constructor(
    private readonly streamService: StreamService,
    private readonly prisma: PrismaService,
  ) {
    this.dohResolver = new DoHResolver({
      baseUrl: 'https://cloudflare-dns.com/dns-query', // Cloudflare DoH endpoint
    });
  }

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

    const videoUrl = query.urlHd || query.urlSd;

    try {
      // Resolve the hostname using DoH
      const url = new URL(videoUrl);
      const resolvedIp = await this.resolveHostname(url.hostname);
      const resolvedUrl = `${url.protocol}//${resolvedIp}${url.pathname}${url.search}`;

      // Stream the video
      const videoResponse = await axios.get(resolvedUrl, {
        responseType: "stream",
        headers: {
          'Range': range,
        },
      });

      const total = videoResponse.headers['content-length'];
      const contentRange = videoResponse.headers['content-range'];

      const headers = {
        'Content-Range': contentRange,
        'Accept-Ranges': 'bytes',
        'Content-Length': total,
        'Content-Type': 'video/mp4',
      };

      response.writeHead(206, headers);
      videoResponse.data.pipe(response);
    } catch (error) {
      console.error('Error streaming video:', error);
      response.status(500).send('Error streaming video');
    }
  }

  private async resolveHostname(hostname: string): Promise<string> {
    try {
      const result = await this.dohResolver.query(hostname, 'A');
      if (result.answers.length > 0) {
        return result.answers[0].data;
      }
      throw new Error('No DNS records found');
    } catch (error) {
      console.error('Error resolving DNS:', error);
      throw new Error('DNS resolution failed');
    }
  }
}
