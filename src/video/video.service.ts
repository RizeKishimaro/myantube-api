import { Injectable } from "@nestjs/common";
import { CreateVideoDto } from "./dto/create-video.dto";
import { UpdateVideoDto } from "./dto/update-video.dto";
import { PrismaService } from "../utils/prisma.service";

@Injectable()
export class VideoService {
  constructor(
    private readonly prismaService: PrismaService,
  ) {}
  create(createVideoDto: CreateVideoDto) {
    return "goffy ahhhh";
  }

  async findAll() {
    const video = await this.prismaService.video.findMany({
    include: {
      author: true, 
      oauthAuthor: true,
        comments: {
        include: {
          author: true, // Includes the user who made the comment
          oauthAuthor: true, // Includes the OAuth user who made the comment
          CommentRating: true, // Includes the ratings for the comment
        },
      },
      likes: true, 
      dislikes: true, 
      
    },
  });
    return video;
  }

  async findOne(videoId: number) {
    const { author, oauthAuthor, id,url,description,title, uploadedAt,comments } = await this.prismaService.video.findFirst({
      where:{ id: videoId},
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
        comments:{
          include:{
            author: {
              select: {
                name: true,
                id:true,
                comments: true,
                createdAt: true,
                
              }
            },
            oauthAuthor:{
              select:{
                name: true,
                id: true,
                comments: true
              }
            },
          }
        }
      }
    })
    const responseData = {
      uploader:{
        name: oauthAuthor?.name|| author?.name ,
        picture: oauthAuthor?.picture || author?.picture,
        id: oauthAuthor?.id || author?.id
      },
      video:{
        id,
        url,
        description,
        title,
        comment: 
          comments.map((el)=>{
            return {
              id: el.id,
              by: el?.userId || el?.oauthUserId,
              text: el.content,
              at: el.createdAt,
            }
          })
        
      }
    }
    return responseData;
  }

  update(id: number, updateVideoDto: UpdateVideoDto) {
    return `This action updates a #${id} video`;
  }

  remove(id: number) {
    return `This action removes a #${id} video`;
  }
}
