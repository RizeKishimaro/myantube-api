import { Injectable, StreamableFile } from "@nestjs/common";
import { CreateVideoDto } from "./dto/create-video.dto";
import { UpdateVideoDto } from "./dto/update-video.dto";
import { PrismaService } from "../utils/prisma.service";
import { join } from "path";
import { CreateLikeDTO } from "./dto/create-like.dto";
import { CreateCommentDTO } from "./dto/create-comment.dto";
import { CreateViewDTO } from "./dto/create-view.dto";
import { FactoryService } from "../factory/factory.service";
import { Response } from "express"
import axios from "axios";

@Injectable()
export class VideoService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly factoryService: FactoryService
  ) {}
  async create(createVideoDto: CreateVideoDto) {
    const {title,description,userId} = createVideoDto;
    const urlData = await this.factoryService.scrapFacebookURL(createVideoDto.url)
    const {id} = await this.prismaService.user.findUnique({
      where: {id: userId},
      select:{ id: true}
    })
    await this.prismaService.video.create({
      data: { title,
      description,
      urlHd: urlData.hd,
      urlSd: urlData.sd,
      poster: urlData.thumbnail,
      userId: id,
        duration: urlData.duration_ms,
        originalUrl: urlData.url
      },
    });
  }
  async searchVideos(searchString: string) {
    const videos = await this.prismaService.video.findMany({
     where: {
        title: {
          contains: searchString,
        },
      },
    });
    return videos;
  }
  async findAll(page = 0, limit = 10) {
    const skip = page * limit;
    const data = await this.prismaService.video.findMany({
      include: {
        _count: {
          select: {
            likes: true,
            dislikes: true,
            views: true,
          },
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
      select: {
        id: true,
        duration: true,
        title: true,
        poster: true,
      },
      skip,
      take: limit,
    });
    const videoData = data.map(
      ({
        title,
        poster,
        author,
        oauthAuthor,
        _count,
        duration,
        id,
        description,
      }) => {
        return {
          author: {
            id: author?.id || oauthAuthor?.id,
            name: author?.name || oauthAuthor?.name,
            picture: author?.picture || oauthAuthor?.picture,
          },
          video: {
            id,
            title,
            description,
            duration,
            poster,
            status: {
              likes: _count.likes,
              dislikes: _count.dislikes,
              views: _count.views,
            },
          },
        };
      },
    );
    return videoData;
  }

  async findOne(videoId: number) {
    const {
      author,
      oauthAuthor,
      id,
      urlHd,
      urlSd,
      description,
      title,
      uploadedAt,
      poster,
      comments,
      _count,
    } = await this.prismaService.video.findFirst({
      where: { id: videoId },
      include: {
        _count: {
          select: {
            likes: true,
            dislikes: true,
            views: true,
          },
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
          take: 1,
          orderBy: {
            id: "desc",
          },
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
        profile: oauthAuthor?.picture || author?.picture,
        id: oauthAuthor?.id || author?.id,
      },
      video: {
        id,
        urlHd,
        urlSd,
        description,
        title,
        poster,
        uploadedAt,
        comment: comments.map((el) => {
          return {
            id: el.id,
            by: el?.userId || el?.oauthUserId,
            profile: el.author?.picture || el.oauthAuthor?.picture,
            text: el.content,
            at: el.createdAt,
          };
        }),
        status: {
          likes: _count.likes,
          dislikes: _count.dislikes,
          views: _count.views,
        },
      },
    };
    return responseData;
  }
async fetchImage(imageUrl: string, res: Response): Promise<StreamableFile> {
    const response = await axios.get(imageUrl, {
      responseType: 'arraybuffer',
      headers: {
        'User-Agent': 'User Agent: Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Mobile Safari/537.36'
      }
    });

    res.setHeader('Content-Type', response.headers['content-type']);
    return new StreamableFile(Buffer.from(response.data, 'binary'));
  }
  async update(id: number, updateVideoDto: UpdateVideoDto) {
    const videoData = await this.prismaService.video.findUnique({
      where: { id },
    });
    await this.prismaService.video.update({
      where: { id },
      data: {
        title: updateVideoDto.title || videoData.title,
        description: updateVideoDto.description || videoData.description,
        poster: updateVideoDto.poster || videoData.poster,
      },
    });
  }

  async remove(id: number) {
    await this.prismaService.video.delete({
      where: { id },
    });
  }
  async createComment(createCommentDTO: CreateCommentDTO) {
    await this.prismaService.comment.create({
      data: {
        userId: createCommentDTO.userId,
        videoId: +createCommentDTO.videoId,
        content: createCommentDTO.content,
      },
    });
  }
  async addOrRemoveLike(createLikeDTO: CreateLikeDTO) {
    const hasLike = await this.prismaService.videoLike.findFirst({
      where: { userId: createLikeDTO.userId },
      select: {
        id: true,
      },
    });
    if (!hasLike.id) {
      await this.prismaService.videoLike.create({
        data: {
          videoId: createLikeDTO.videoId,
          userId: createLikeDTO.userId,
        },
      });
    } else {
      await this.prismaService.videoLike.delete({
        where: {
          id: hasLike.id,
        },
      });
    }
  }
  async addOrRemoveDislike(createLikeDTO: CreateLikeDTO) {
    const hasDislike = await this.prismaService.videoLike.findFirst({
      where: { userId: createLikeDTO.userId },
      select: {
        id: true,
      },
    });
    if (!hasDislike.id) {
      await this.prismaService.videoLike.create({
        data: {
          videoId: createLikeDTO.videoId,
          userId: createLikeDTO.userId,
        },
      });
    } else {
      await this.prismaService.videoLike.delete({
        where: {
          id: hasDislike.id,
        },
      });
    }
  }
  async createView(createViewDTO: CreateViewDTO) {
    await this.prismaService.views.create({
      data: {
        userId: createViewDTO.userId,
        videoId: createViewDTO.videoId,
      },
    });
  }
  async getComments(videoId: number, page = 0, limit = 5) {
    const skip = page * limit;
    const comments = await this.prismaService.comment.findMany({
      where: {
        videoId,
      },
      orderBy: {
        id: "desc",
      },
      include: {
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
      take: limit,
      skip,
    });
    const mappedComments = comments.map((comment) => {
      return {
        id: comment.id,
        text: comment.content,
        by: comment.author.name || comment.oauthAuthor.name,
        author_id: comment.author.id || comment.oauthAuthor.id,
        author_profile: comment.author.picture || comment.oauthAuthor.picture,
        createdAt: comment.createdAt,
      };
    });
    return mappedComments;
  }
  async seedVideos() {
    // Create some users
    const users = await this.prismaService.user.createMany({
      data: [
        {
          name: "Alice",
          picture: join("public", "profiles", "default-fischl.jpg"),
          password: "alicepassword",
          email: "alice@example.com",
          isActive: true,
        },
        {
          name: "Rize Kishimaro",
          picture: join("public", "profiles", "anime-default-pfp-5.jpg"),
          password: "bobpassword",
          email: "bob@example.com",
          isActive: true,
        },
      ],
    });

    const createdUsers = await this.prismaService.user.findMany();
    const user1 = createdUsers[0];
    const user2 = createdUsers[1];

    // Create some videos
  }
}
