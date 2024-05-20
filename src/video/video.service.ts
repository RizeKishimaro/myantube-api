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
    const video = await this.prismaService.video.findMany({
    include: {
      author: true, 
      oauthAuthor: true,
        comment: {
        include: {
          author: true, // Includes the user who made the comment
          oauthAuthor: true, // Includes the OAuth user who made the comment
          CommentRating: true, // Includes the ratings for the comment
        },
      },
      likes: true, 
      dislikes: true, 
      views: true,
    },
  });
    return video;
  }

  async findOne(id: number) {
    const videoData = await this.prismaService.video.findFirst({
      where:{ id},
      include:{
        author: {
          select: {
            name: true,
            id: true,
            picture:true,
          }
        },
        oauthAuthor: {
          select:{
            name: true,
            id: true,
            picture: true,
          }
        },
        comment:{
          include:{
            author: {
              select: {
                name: true,
                id:true
              }
            },
            oauthAuthor:{
              select:{
                name: true,
                id: true,
                comments: true
              }
            },
            CommentRating: true,
          }
        }
      }
    })
    const responseData = {
      uploader:{
        name: videoData.author,

      }
    }
  }

  update(id: number, updateVideoDto: UpdateVideoDto) {
    return `This action updates a #${id} video`;
  }

  remove(id: number) {
    return `This action removes a #${id} video`;
  }
}
