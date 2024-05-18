import { Injectable } from "@nestjs/common";
import { CreateVideoDto } from "./dto/create-video.dto";
import { UpdateVideoDto } from "./dto/update-video.dto";
import { PrismaService } from "../utils/prisma.service";

@Injectable()
export class VideoService {
  constructor(private readonly prismaService: PrismaService) {}
  create(createVideoDto: CreateVideoDto) {
    return "goffy ahhhh";
  }

  async findAll() {
    const video = await prisma.video.findMany({
    include: {
      author: true, 
      oauthAuthor: true, 
      comments: {
        include: {
          author: true, 
          oauthAuthor: true, 
          CommentRating: true, 
        },
      },
      likes: true, 
      dislikes: true, 
      views: true,
    },
  });
    return video;
  }

  findOne(id: number) {
    return `This action returns a #${id} video`;
  }

  update(id: number, updateVideoDto: UpdateVideoDto) {
    return `This action updates a #${id} video`;
  }

  remove(id: number) {
    return `This action removes a #${id} video`;
  }
}
