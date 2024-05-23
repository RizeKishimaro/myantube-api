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
      const data = await this.prismaService.video.findMany({
        include: {
          _count:{
            select:{
              likes:true,
              dislikes: true,
              views: true
            }
          },
          author: {
            select: {
              id: true,
              name: true,
              picture: true,
            },
          },
          oauthAuthor: {
            select: {
              id: true,
              name: true,
              picture: true,
            },
          },
        },
      })
    const videoData = data.map(({title,poster,author,oauthAuthor,_count,url,id,description})=>{
      return {
        author: {
          id:author?.id || oauthAuthor?.id,
          name: author?.name || oauthAuthor?.name,
          picture: author?.picture || oauthAuthor?.picture
        },
        video:{
          id,
          title,
          url,
          description,
          poster,
          status:{
            likes: _count.likes,
            dislikes: _count.dislikes,
            views: _count.views
          }

        }
      }
    })
    return videoData;
  }

  async findOne(videoId: number) {
    const {
      author,
      oauthAuthor,
      id,
      url,
      description,
      title,
      uploadedAt,
      comments,
      _count
    } = await this.prismaService.video.findFirst({
      where: { id: videoId },
      include: {
          _count: {
            select:{
              likes: true,
              dislikes: true,
              views: true
            }
          },
        author: {
          select: {
            name: true,
            id: true,
            picture: true,
          },
        },
        oauthAuthor: {
          select: {
            name: true,
            id: true,
            picture: true,
          },
        },
        comments: {
          include: {
            author: {
              select: {
                name: true,
                id: true,
                  picture: true,
                comments: true,
                createdAt: true,
              },
            },
            oauthAuthor: {
              select: {
                name: true,
                picture: true,
                id: true,
                comments: true,
              },
            },
          },
        },
      },
    });
    const responseData = {
      uploader: {
        name: oauthAuthor?.name || author?.name,
        picture: oauthAuthor?.picture || author?.picture,
        id: oauthAuthor?.id || author?.id,
      },
      video: {
        id,
        url,
        description,
        title,
        comment: comments.map((el) => {
          return {
            id: el.id,
            by: el?.userId || el?.oauthUserId,
            profile: el.author.picture || el.oauthAuthor.picture,
            text: el.content,
            at: el.createdAt,
          };
        }),
        status:{
          likes: _count.likes,
          dislikes: _count.dislikes,
          views: _count.views,
        }
      },
    };
    return responseData;
  }

  async update(id: number, updateVideoDto: UpdateVideoDto) {
    await this.prismaService.videoLike.create({
      data: {
        videoId: updateVideoDto.videoId,
        userId: updateVideoDto.userId,
      },
    });
  }

  remove(id: number) {
    return `This action removes a #${id} video`;
  }
}
