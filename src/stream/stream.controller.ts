import { BadRequestException, Controller, Get, Query, Req, Res } from "@nestjs/common";
import { StreamService } from "./stream.service";
import { join } from "path";
import { createReadStream, statSync } from "fs";
import { PrismaService } from "../utils/prisma.service";

@Controller("stream")
export class StreamController {
  constructor(
    private readonly streamService: StreamService,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  async startStream(@Req() request: any, @Res() response: any, @Query("video") id: number) {
    const range = request.headers.range ?? "5";
    if (!range) {
      throw new BadRequestException({
        code: 299,
        message: "Bad range header or does not exist.",
      });
    }
    const query = await this.prisma.video.findFirst({
      where: {
        id
      },
      select:{
      url: true
      }
    })
    const video = query.url 
    const total_length = statSync(video).size;
    const CHUNK_SIZE = 10 ** 6;
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + CHUNK_SIZE, total_length - 1);
    const content_length = end - start + 1;
    const headers = {
      "Content-Range": `bytes ${start}-${end}/${total_length}`,
      "Accept-Ranges": "bytes",
      "Content-Length": content_length,
      "Content-Type": "video/mp4",
    };
    const stream = createReadStream(video, { start, end });
    response.writeHead(206, headers);
    stream.pipe(response);
  }
}
