import { Injectable } from "@nestjs/common";
import { CreateVideoDto } from "./dto/create-video.dto";
import { UpdateVideoDto } from "./dto/update-video.dto";
import { PrismaService } from "../utils/prisma.service";
import { join } from "path";
import { CreateLikeDTO } from "./dto/create-like.dto";
import { CreateCommentDTO } from "./dto/create-comment.dto";
import { CreateViewDTO } from "./dto/create-view.dto";
import { FactoryService } from "../factory/factory.service";

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
        urlHd,
        urlSd,
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
            urlHd,
            urlSd,
            description,
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
    const videos = [
      {
        title: "Tsukimichi: Moonlit Fantasy Highlights",
        description: "Support Me On twitter.",
        originalUrl: "https://www.facebook.com",duration: 20000,
        poster:
          "https://scontent-sin6-3.xx.fbcdn.net/v/t15.5256-10/438141844_479459757996962_6375966931292809910_n.jpg?stp=dst-jpg_p180x540&_nc_cat=104&ccb=1-7&_nc_sid=5f2048&_nc_ohc=cyF6JlwhcI8Q7kNvgGZCYLP&_nc_ht=scontent-sin6-3.xx&oh=00_AYD2KGXM_XNcn-xcwTJnKU9CmumcOoCdeqw6YukvGlUUXQ&oe=6671C921",
        urlHd:
          "https://video-sin6-4.xx.fbcdn.net/o1/v/t2/f2/m69/An_S8L6QfSysbV14Gk5pDeiFwS3RdebZbH_GgBbp01UcqxVcyFUHujpxIl2MU1Zu3aD91Xte8Qguixgiv1Rlc7Y.mp4?efg=eyJ2ZW5jb2RlX3RhZyI6Im9lcF9oZCJ9&_nc_ht=video-sin6-4.xx.fbcdn.net&_nc_cat=110&strext=1&vs=ab6ee1c255560500&_nc_vs=HBksFQIYOnBhc3N0aHJvdWdoX2V2ZXJzdG9yZS9HQk5ac2hvYW9MUlU3NG9FQU1GdVVEdl9EclZTYm1kakFBQUYVAALIAQAVAhg6cGFzc3Rocm91Z2hfZXZlcnN0b3JlL0dIU0VzQnFuV3VzeXVsQURBRWtQai16Z0Q3VUNickZxQUFBRhUCAsgBAEsHiBJwcm9ncmVzc2l2ZV9yZWNpcGUBMQ1zdWJzYW1wbGVfZnBzABB2bWFmX2VuYWJsZV9uc3ViACBtZWFzdXJlX29yaWdpbmFsX3Jlc29sdXRpb25fc3NpbQAoY29tcHV0ZV9zc2ltX29ubHlfYXRfb3JpZ2luYWxfcmVzb2x1dGlvbgAddXNlX2xhbmN6b3NfZm9yX3ZxbV91cHNjYWxpbmcAEWRpc2FibGVfcG9zdF9wdnFzABUAJQAcjBdAAAAAAAAAABERAAAAJvaJ%2FLiLsckDFQIoAkMzGAt2dHNfcHJldmlldxwXQHC6p%2B%2Bdsi0YGWRhc2hfaDI2NC1iYXNpYy1nZW4yXzcyMHASABgYdmlkZW9zLnZ0cy5jYWxsYmFjay5wcm9kOBJWSURFT19WSUVXX1JFUVVFU1QbCogVb2VtX3RhcmdldF9lbmNvZGVfdGFnBm9lcF9oZBNvZW1fcmVxdWVzdF90aW1lX21zATAMb2VtX2NmZ19ydWxlB3VubXV0ZWQTb2VtX3JvaV9yZWFjaF9jb3VudAQ4NTM0EW9lbV9pc19leHBlcmltZW50AAxvZW1fdmlkZW9faWQPNDY0MzUzMzM2MDA1NTA2Em9lbV92aWRlb19hc3NldF9pZA80OTA5MjU3MzMyNzI3MTcVb2VtX3ZpZGVvX3Jlc291cmNlX2lkEDEwMDU3OTY5Nzc1MDg5ODccb2VtX3NvdXJjZV92aWRlb19lbmNvZGluZ19pZA80MjQzNzA2MDcxODQwNTkOdnRzX3JlcXVlc3RfaWQAJQIcACXEARsHiAFzATcCY2QKMjAyNC0wNi0wNQNyY2IEODUwMANhcHAURmFjZWJvb2sgZm9yIEFuZHJvaWQCY3QZQ09OVEFJTkVEX1BPU1RfQVRUQUNITUVOVBNvcmlnaW5hbF9kdXJhdGlvbl9zCjI2Ny42NTY5MzkCdHMVcHJvZ3Jlc3NpdmVfZW5jb2RpbmdzAA%3D%3D&ccb=9-4&oh=00_AYAqbKyLhpRRehsJZg09K4gIXfeM1sRoqeE8sF2cQOyktg&oe=666DD84F&_nc_sid=1d576d&_nc_rid=135805114667822&_nc_store_type=1",
        urlSd:
          "https://video-sin6-3.xx.fbcdn.net/v/t42.1790-2/447777904_1258230878486014_3585155342317377837_n.mp4?_nc_cat=106&ccb=1-7&_nc_sid=55d0d3&efg=eyJybHIiOjgxOSwicmxhIjoyMjgzLCJ2ZW5jb2RlX3RhZyI6InN2ZV9zZCIsInZpZGVvX2lkIjo0NjQzNTMzMzYwMDU1MDZ9&_nc_ohc=BIUONMUse_0Q7kNvgFtNu0U&rl=819&vabr=455&_nc_ht=video-sin6-3.xx&oh=00_AYD9nEIxZtjpFqmfvpdd9-0iIsFSA9e2BarxMUyPkWQDfA&oe=6671CFE5",
        userId: user1.id,
      },
      {
        title: "Amanamaguchi Miku",
        description: "Forever Hatsunemiku",
        originalUrl: "https://www.facebook.com",duration: 20000,
        poster:
          "https://scontent-sin6-1.xx.fbcdn.net/v/t15.5256-10/13432756_10157147430735637_423925904_n.jpg?stp=dst-jpg_p180x540&_nc_cat=111&ccb=1-7&_nc_sid=5f2048&_nc_ohc=HJ52hrvk0SEQ7kNvgF5UhYh&_nc_ht=scontent-sin6-1.xx&oh=00_AYBMhnw0_sSUqrg3g_ysipjE3KcdbpwZ88XgaqXma88f_w&oe=6671CC6D",
        urlSd:
          "https://video-sin6-4.xx.fbcdn.net/v/t42.1790-2/13465111_146255065792575_529150826_n.mp4?_nc_cat=101&ccb=1-7&_nc_sid=55d0d3&efg=eyJybHIiOjMwMCwicmxhIjo1MTIsInZlbmNvZGVfdGFnIjoic3ZlX3NkIiwidmlkZW9faWQiOjEwMTU3MTQ3NDI3MzkwNjM3fQ%3D%3D&_nc_ohc=bCREVBvD46MQ7kNvgGmBNvP&rl=300&vabr=85&_nc_ht=video-sin6-4.xx&oh=00_AYBHkduGZROoYe5pINok7jFGRtYIcAAmwJkafaK2Ips--g&oe=6671C2A3",
        urlHd:
          "https://video-sin6-4.xx.fbcdn.net/o1/v/t2/f2/m69/An_BcGSLcbuute90EusszmQkBFOVEDBpz5JlvYmJuvpsPAgdxKPHN-NAyFvWf5xIP14rIyHPe-qf6b5XT7_ukw.mp4?efg=eyJ2ZW5jb2RlX3RhZyI6Im9lcF9oZCJ9&_nc_ht=video-sin6-4.xx.fbcdn.net&_nc_cat=111&strext=1&vs=a75f3e0182806d10&_nc_vs=HBksFQIYOnBhc3N0aHJvdWdoX2V2ZXJzdG9yZS9HTHBaaFJwZFhRSmFBWGdEQUJFem5fREdjdXNpYm1kakFBQUYVAALIAQAVAhg6cGFzc3Rocm91Z2hfZXZlcnN0b3JlL0dHeUp6UUNOaDZjczN4VWtBR2ZqQ0ZRQUFBQUFidjRHQUFBRhUCAsgBAEsHiBJwcm9ncmVzc2l2ZV9yZWNpcGUBMQ1zdWJzYW1wbGVfZnBzABB2bWFmX2VuYWJsZV9uc3ViACBtZWFzdXJlX29yaWdpbmFsX3Jlc29sdXRpb25fc3NpbQAoY29tcHV0ZV9zc2ltX29ubHlfYXRfb3JpZ2luYWxfcmVzb2x1dGlvbgAddXNlX2xhbmN6b3NfZm9yX3ZxbV91cHNjYWxpbmcAEWRpc2FibGVfcG9zdF9wdnFzABUAJQAcjBdAAAAAAAAAABERAAAAJoqMt8Xl94okFQIoAkMzGAt2dHNfcHJldmlldxwXQG3RT987ZFoYGWRhc2hfaDI2NC1iYXNpYy1nZW4yXzcyMHASABgYdmlkZW9zLnZ0cy5jYWxsYmFjay5wcm9kOBJWSURFT19WSUVXX1JFUVVFU1QbCogVb2VtX3RhcmdldF9lbmNvZGVfdGFnBm9lcF9oZBNvZW1fcmVxdWVzdF90aW1lX21zATAMb2VtX2NmZ19ydWxlB3VubXV0ZWQTb2VtX3JvaV9yZWFjaF9jb3VudAcyNDg1OTI0EW9lbV9pc19leHBlcmltZW50AAxvZW1fdmlkZW9faWQRMTAxNTcxNDc0MjczOTA2MzcSb2VtX3ZpZGVvX2Fzc2V0X2lkETEwMTU3MTQ3NDI3MzgwNjM3FW9lbV92aWRlb19yZXNvdXJjZV9pZBExMDE1NzE0NzQyNzM2NTYzNxxvZW1fc291cmNlX3ZpZGVvX2VuY29kaW5nX2lkDzc2MzgxMzkxMjUwNTA2MA52dHNfcmVxdWVzdF9pZAAlAhwAJb4BGweIAXMDNTUxAmNkCjIwMTYtMDYtMTQDcmNiBzI0ODU5MDADYXBwBVZpZGVvAmN0BkxFR0FDWRNvcmlnaW5hbF9kdXJhdGlvbl9zCjIzOC41NDE2NjcCdHMVcHJvZ3Jlc3NpdmVfZW5jb2RpbmdzAA%3D%3D&ccb=9-4&oh=00_AYDRO9sB2c-5IO7FbOhOdpPnZTm6KbyrUTbOJyAmFwELkA&oe=666DDF11&_nc_sid=1d576d&_nc_rid=171552881675966&_nc_store_type=1",
        userId: user2.id,
      },
      {
        title: "Prince Of Darkness",
        description: "Phonk video is wild :D",
        originalUrl: "https://www.facebook.com",duration: 20000,
        poster:
          "https://scontent-sin6-3.xx.fbcdn.net/v/t15.5256-10/278383274_553827366076802_1632686837597950104_n.jpg?stp=dst-jpg_p180x540&_nc_cat=104&ccb=1-7&_nc_sid=5f2048&_nc_ohc=V4VWvZZUWHYQ7kNvgEf7EHP&_nc_ht=scontent-sin6-3.xx&oh=00_AYCnSmNler0yyz4rHeij5SEXrUmIaalaBIDDmP7t35NDhA&oe=6671DE16",
        urlSd:
          "https://video-sin6-1.xx.fbcdn.net/v/t42.1790-2/405508637_1412313526163720_7658628682063707903_n.mp4?_nc_cat=111&ccb=1-7&_nc_sid=55d0d3&efg=eyJybHIiOjQ3OCwicmxhIjo2MTgsInZlbmNvZGVfdGFnIjoic3ZlX3NkIiwidmlkZW9faWQiOjE0ODczNDAzMTUwMDE1NjJ9&_nc_ohc=2wNm5kukeVYQ7kNvgG-dvCT&rl=478&vabr=266&_nc_ht=video-sin6-1.xx&oh=00_AYAA0wpGPBP7kW1Pb-_BkJx5GSC8QddBlg0BmT6xOy2Bcw&oe=6671CB21",
        urlHd:
          "https://video-sin6-4.xx.fbcdn.net/o1/v/t2/f2/m69/An834JkmYosVxW3ZLz_nGBVkn3odhrd1D-XRzNfSA-Vr7e_7Vt4uo0F5GoNufevRlB-QDsZJlMn7owAS6kqYqQ.mp4?efg=eyJ2ZW5jb2RlX3RhZyI6Im9lcF9oZCJ9&_nc_ht=video-sin6-4.xx.fbcdn.net&_nc_cat=110&strext=1&vs=d9aae95596c7630a&_nc_vs=HBksFQIYOnBhc3N0aHJvdWdoX2V2ZXJzdG9yZS9HQzZQNHhsU3dvVmhzeEVCQUtVVGRlSGxKZG9zYm1kakFBQUYVAALIAQAVAhg6cGFzc3Rocm91Z2hfZXZlcnN0b3JlL0dMeFZvUkJTdUVqdld1RVNBS1hpR1VGd3pOUVlidjRHQUFBRhUCAsgBAEsHiBJwcm9ncmVzc2l2ZV9yZWNpcGUBMQ1zdWJzYW1wbGVfZnBzABB2bWFmX2VuYWJsZV9uc3ViACBtZWFzdXJlX29yaWdpbmFsX3Jlc29sdXRpb25fc3NpbQAoY29tcHV0ZV9zc2ltX29ubHlfYXRfb3JpZ2luYWxfcmVzb2x1dGlvbgAddXNlX2xhbmN6b3NfZm9yX3ZxbV91cHNjYWxpbmcAEWRpc2FibGVfcG9zdF9wdnFzABUAJQAcjBdAAAAAAAAAABERAAAAJq7ayu7rp6kCFQIoAkMzGAt2dHNfcHJldmlldxwXQF8CHKwIMScYIWRhc2hfZ2VuMmh3YmFzaWNfaHEyX2ZyYWdfMl92aWRlbxIAGBh2aWRlb3MudnRzLmNhbGxiYWNrLnByb2Q4ElZJREVPX1ZJRVdfUkVRVUVTVBsKiBVvZW1fdGFyZ2V0X2VuY29kZV90YWcGb2VwX2hkE29lbV9yZXF1ZXN0X3RpbWVfbXMBMAxvZW1fY2ZnX3J1bGUHdW5tdXRlZBNvZW1fcm9pX3JlYWNoX2NvdW50BDE5ODERb2VtX2lzX2V4cGVyaW1lbnQADG9lbV92aWRlb19pZBAxNDg3MzQwMzE1MDAxNTYyEm9lbV92aWRlb19hc3NldF9pZA85ODMzNDM4NTU2NzMyODgVb2VtX3ZpZGVvX3Jlc291cmNlX2lkDzY1Mzc5NDM5OTA0OTM2NxxvZW1fc291cmNlX3ZpZGVvX2VuY29kaW5nX2lkDzM4NjQ1OTMxNzU3ODI0NQ52dHNfcmVxdWVzdF9pZAAlAhwAJcQBGweIAXMEMjA5OAJjZAoyMDIyLTA0LTIzA3JjYgQxOTAwA2FwcBRGYWNlYm9vayBmb3IgQW5kcm9pZAJjdBlDT05UQUlORURfUE9TVF9BVFRBQ0hNRU5UE29yaWdpbmFsX2R1cmF0aW9uX3MHMTI0LjAxOQJ0cxVwcm9ncmVzc2l2ZV9lbmNvZGluZ3MA&ccb=9-4&oh=00_AYBtMBvx6X3AOpHmqP-Lr_t9g9Y1yN7dhE-Mlp5MNAlVZw&oe=666DEF3B&_nc_sid=1d576d&_nc_rid=011415343352630&_nc_store_type=1",
        userId: user1.id,
      },
      {
        title: "Luka Luka Night Fever",
        description: "Let's dance with Luka!",
        originalUrl: "https://www.facebook.com",duration: 20000,
        poster: "https://i.ytimg.com/vi/ScSW9C3DF18/maxresdefault.jpg",
        urlSd:
          "https://video-sin6-4.xx.fbcdn.net/o1/v/t2/f2/m69/An_WGmNclLHqLinj_UfOD4thuaAIyVXePNw4fxl_5qfaPHVjO71paI8y7IjIbuN8iTv9uBua312qckPJziwkl6A.mp4?efg=eyJ2ZW5jb2RlX3RhZyI6Im9lcF9zZCJ9&_nc_ht=video-sin6-4.xx.fbcdn.net&_nc_cat=103&strext=1&vs=a9f389734c7776b9&_nc_vs=HBksFQIYOnBhc3N0aHJvdWdoX2V2ZXJzdG9yZS9HRU9Ia2hyaGtmLXVsUndFQUx6N3dLTy16bEVyYm1kakFBQUYVAALIAQAVAhg6cGFzc3Rocm91Z2hfZXZlcnN0b3JlL0dGVEN3Z0F2T2RTZ3JXNERBQU5RVUNvQUFBQUFidjRHQUFBRhUCAsgBAEsHiBJwcm9ncmVzc2l2ZV9yZWNpcGUBMQ1zdWJzYW1wbGVfZnBzABB2bWFmX2VuYWJsZV9uc3ViACBtZWFzdXJlX29yaWdpbmFsX3Jlc29sdXRpb25fc3NpbQAoY29tcHV0ZV9zc2ltX29ubHlfYXRfb3JpZ2luYWxfcmVzb2x1dGlvbgAddXNlX2xhbmN6b3NfZm9yX3ZxbV91cHNjYWxpbmcAEWRpc2FibGVfcG9zdF9wdnFzABUAJQAcjBdAAAAAAAAAABERAAAAJvqowPS07d0BFQIoAkMzGAt2dHNfcHJldmlldxwXQG31iTdLxqgYGWRhc2hfaDI2NC1iYXNpYy1nZW4yXzM2MHASABgYdmlkZW9zLnZ0cy5jYWxsYmFjay5wcm9kOBJWSURFT19WSUVXX1JFUVVFU1QbCogVb2VtX3RhcmdldF9lbmNvZGVfdGFnBm9lcF9zZBNvZW1fcmVxdWVzdF90aW1lX21zATAMb2VtX2NmZ19ydWxlCnNkX3VubXV0ZWQTb2VtX3JvaV9yZWFjaF9jb3VudAUyNTExMhFvZW1faXNfZXhwZXJpbWVudAAMb2VtX3ZpZGVvX2lkEDEwNjg2MDU4MjY0OTUyMTQSb2VtX3ZpZGVvX2Fzc2V0X2lkEDEzMzM4Mjk2MDc0MDI2MjEVb2VtX3ZpZGVvX3Jlc291cmNlX2lkDzQ4Nzg2Mzg0NjcwMTYyORxvZW1fc291cmNlX3ZpZGVvX2VuY29kaW5nX2lkDzI5ODY2NjYwOTg4MDg2MA52dHNfcmVxdWVzdF9pZAAlAhwAJcQBGweIAXMENDM0MAJjZAoyMDE2LTAyLTE2A3JjYgUyNTEwMANhcHAFVmlkZW8CY3QGTEVHQUNZE29yaWdpbmFsX2R1cmF0aW9uX3MHMjM5LjY3NQJ0cxRwcm9ncmVzc2l2ZV9vcmRlcmluZwA%3D&ccb=9-4&oh=00_AYBuF10zwxAklO_iFagAukWMMTJnM7eyeI3Y9rskXJK1Lg&oe=666DDECB&_nc_sid=1d576d&_nc_rid=852132599130931&_nc_store_type=1",
        urlHd:
          "https://video-sin6-4.xx.fbcdn.net/o1/v/t2/f2/m69/An9bkq5jXyFYBCkWYzws-eQGfNIAb9tVXkx75RWRTsiijLKlNSQEKBeRls555zvIF8teOBX9eBafvRWmxYwLx-Q.mp4?efg=eyJ2ZW5jb2RlX3RhZyI6Im9lcF9oZCJ9&_nc_ht=video-sin6-4.xx.fbcdn.net&_nc_cat=101&strext=1&vs=9ee7b51815bc0c35&_nc_vs=HBksFQIYOnBhc3N0aHJvdWdoX2V2ZXJzdG9yZS9HSUNXbUFBWUhrbVhBbmNFQUhEd1pUZFdGa2NpYm1kakFBQUYVAALIAQAVAhg6cGFzc3Rocm91Z2hfZXZlcnN0b3JlL0dGVEN3Z0F2T2RTZ3JXNERBQU5RVUNvQUFBQUFidjRHQUFBRhUCAsgBAEsHiBJwcm9ncmVzc2l2ZV9yZWNpcGUBMQ1zdWJzYW1wbGVfZnBzABB2bWFmX2VuYWJsZV9uc3ViACBtZWFzdXJlX29yaWdpbmFsX3Jlc29sdXRpb25fc3NpbQAoY29tcHV0ZV9zc2ltX29ubHlfYXRfb3JpZ2luYWxfcmVzb2x1dGlvbgAddXNlX2xhbmN6b3NfZm9yX3ZxbV91cHNjYWxpbmcAEWRpc2FibGVfcG9zdF9wdnFzABUAJQAcjBdAAAAAAAAAABERAAAAJvqowPS07d0BFQIoAkMzGAt2dHNfcHJldmlldxwXQG31iTdLxqgYGWRhc2hfaDI2NC1iYXNpYy1nZW4yXzcyMHASABgYdmlkZW9zLnZ0cy5jYWxsYmFjay5wcm9kOBJWSURFT19WSUVXX1JFUVVFU1QbCogVb2VtX3RhcmdldF9lbmNvZGVfdGFnBm9lcF9oZBNvZW1fcmVxdWVzdF90aW1lX21zATAMb2VtX2NmZ19ydWxlB3VubXV0ZWQTb2VtX3JvaV9yZWFjaF9jb3VudAUyNTExMhFvZW1faXNfZXhwZXJpbWVudAAMb2VtX3ZpZGVvX2lkEDEwNjg2MDU4MjY0OTUyMTQSb2VtX3ZpZGVvX2Fzc2V0X2lkEDEzMzM4Mjk2MDc0MDI2MjEVb2VtX3ZpZGVvX3Jlc291cmNlX2lkDzQ4Nzg2Mzg0NjcwMTYyORxvZW1fc291cmNlX3ZpZGVvX2VuY29kaW5nX2lkDzQ4NDY0NjYyMzk5NzIwOA52dHNfcmVxdWVzdF9pZAAlAhwAJcQBGweIAXMENDM0MAJjZAoyMDE2LTAyLTE2A3JjYgUyNTEwMANhcHAFVmlkZW8CY3QGTEVHQUNZE29yaWdpbmFsX2R1cmF0aW9uX3MHMjM5LjY3NQJ0cxVwcm9ncmVzc2l2ZV9lbmNvZGluZ3MA&ccb=9-4&oh=00_AYAMgRYnCUFEkghOESdjryo0u2qqng-Xcjs4GYppBD-C3Q&oe=666DD7E5&_nc_sid=1d576d&_nc_rid=481659491260503&_nc_store_type=1",
        userId: user2.id,
      },
      {
        title: "Triple Baka",
        description: "BakaBakaBaka!",
        originalUrl: "https://www.facebook.com/backtothclassics/videos/628785137471833/?mibextid=rS40aB7S9Ucbxw6v",duration: 20000,
        poster:
          "https://scontent-sin6-1.xx.fbcdn.net/v/t15.5256-10/30842988_628796570804023_8143904368614178816_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=5f2048&_nc_ohc=-3dDP1eCR9EQ7kNvgEbx-6z&_nc_ht=scontent-sin6-1.xx&oh=00_AYAn7tpb9vQWNmpcAFn2w9S_2RsYvGxqLW5T6qwh7llN-w&oe=6671E266",
        urlSd:
          "https://video-sin6-3.xx.fbcdn.net/v/t42.9040-2/33020718_1053234228149299_5317218917456805888_n.mp4?_nc_cat=110&ccb=1-7&_nc_sid=55d0d3&efg=eyJybHIiOjQ0NiwicmxhIjoxMTAwLCJ2ZW5jb2RlX3RhZyI6InN2ZV9zZCIsInZpZGVvX2lkIjo2Mjg3ODUxMzc0NzE4MzN9&_nc_ohc=HtTWvtSWFGMQ7kNvgG2P2vU&rl=446&vabr=248&_nc_ht=video-sin6-3.xx&oh=00_AYB2tM5fG1knJcay-5sdFNujz1Xu-D6T7Lin-xPIykmNhQ&oe=666C2A80",
        urlHd: null,
        userId: user2.id,
      },
      {
        title: "Eternal Youth",
        description: "Eternal Youth By Rude",
        originalUrl: "https://www.facebook.com",duration: 20000,
        poster:
          "https://scontent-sin6-2.xx.fbcdn.net/v/t15.5256-10/49335063_308548016443076_8994911860113276928_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=5f2048&_nc_ohc=ZtPReM7Xa1sQ7kNvgH6fcXU&_nc_ht=scontent-sin6-2.xx&oh=00_AYAxZ9TXaUVtXPHysCVpG1JAJyof-fe7RuzKsj-DUv5RMQ&oe=6671F19F",
        urlSd:
          "https://video-sin6-4.xx.fbcdn.net/v/t42.9040-2/50002393_353791672105991_1357321699757916160_n.mp4?_nc_cat=100&ccb=1-7&_nc_sid=55d0d3&efg=eyJybHIiOjMwMCwicmxhIjo1MTIsInZlbmNvZGVfdGFnIjoic3ZlX3NkIiwidmlkZW9faWQiOjMwODU0NzQ5MzEwOTc5NX0%3D&_nc_ohc=2rE_GiD3rJAQ7kNvgFQ6Gd1&rl=300&vabr=146&_nc_ht=video-sin6-4.xx&oh=00_AYDbyDqgyIVSaZsXJAprqz4p2kinRyLxn4Aym5Le_V0tIQ&oe=666C3118",
        urlHd:
          "https://video-sin6-4.xx.fbcdn.net/o1/v/t2/f2/m69/An9VItFtZ1S5s6o9fOrE2CRWKW9N1AF6iSDYAMDoghu4AMEU6ufzaGdnSD4fjjGMqr-_Pw_RCuCCDTevgNrywgQG.mp4?efg=eyJ2ZW5jb2RlX3RhZyI6Im9lcF9oZCJ9&_nc_ht=video-sin6-4.xx.fbcdn.net&_nc_cat=101&strext=1&vs=7726a0a72fd57fdb&_nc_vs=HBksFQIYOnBhc3N0aHJvdWdoX2V2ZXJzdG9yZS9HS3FfNHhrcXMwQU56S1VDQUdja1p4RFJDNHBIYm1kakFBQUYVAALIAQAVAhg6cGFzc3Rocm91Z2hfZXZlcnN0b3JlL0dOcEEtQUtVenpMcGdUb0NBQUFBQUFBUDYyc1BidjRHQUFBRhUCAsgBAEsHiBJwcm9ncmVzc2l2ZV9yZWNpcGUBMQ1zdWJzYW1wbGVfZnBzABB2bWFmX2VuYWJsZV9uc3ViACBtZWFzdXJlX29yaWdpbmFsX3Jlc29sdXRpb25fc3NpbQAoY29tcHV0ZV9zc2ltX29ubHlfYXRfb3JpZ2luYWxfcmVzb2x1dGlvbgAddXNlX2xhbmN6b3NfZm9yX3ZxbV91cHNjYWxpbmcAEWRpc2FibGVfcG9zdF9wdnFzABUAJQAcjBdAAAAAAAAAABERAAAAJvKZm%2FXpp4wBFQIoAkMzGAt2dHNfcHJldmlldxwXQFSA9cKPXCkYIWRhc2hfZ2VuMmh3YmFzaWNfaHEyX2ZyYWdfMl92aWRlbxIAGBh2aWRlb3MudnRzLmNhbGxiYWNrLnByb2Q4ElZJREVPX1ZJRVdfUkVRVUVTVBsKiBVvZW1fdGFyZ2V0X2VuY29kZV90YWcGb2VwX2hkE29lbV9yZXF1ZXN0X3RpbWVfbXMBMAxvZW1fY2ZnX3J1bGUHdW5tdXRlZBNvZW1fcm9pX3JlYWNoX2NvdW50BDU5MzURb2VtX2lzX2V4cGVyaW1lbnQADG9lbV92aWRlb19pZA8zMDg1NDc0OTMxMDk3OTUSb2VtX3ZpZGVvX2Fzc2V0X2lkDzMwODU0NzQ4OTc3NjQ2MhVvZW1fdmlkZW9fcmVzb3VyY2VfaWQPMzA4NTQ3NDg2NDQzMTI5HG9lbV9zb3VyY2VfdmlkZW9fZW5jb2RpbmdfaWQPOTM1NTk5Mjc3OTMxMjYxDnZ0c19yZXF1ZXN0X2lkACUCHAAlxAEbB4gBcwQ2ODg4AmNkCjIwMTktMDEtMDMDcmNiBDU5MDADYXBwBVZpZGVvAmN0GUNPTlRBSU5FRF9QT1NUX0FUVEFDSE1FTlQTb3JpZ2luYWxfZHVyYXRpb25fcwY4Mi4wMjcCdHMVcHJvZ3Jlc3NpdmVfZW5jb2RpbmdzAA%3D%3D&ccb=9-4&oh=00_AYC0jiz612LJBYLqPWr1SQiJiJTy6lNB02-sC9F3gy-DSw&oe=666DE155&_nc_sid=1d576d&_nc_rid=829123516753820&_nc_store_type=1",
        userId: user1.id,
      },
    ];

    await this.prismaService.video.createMany({ data: videos });

    const videoRecords = await this.prismaService.video.findMany();

    // Create comments for the videos
    const comments = [
      {
        content: "I like this song",
        userId: user1.id,
        videoId: videoRecords[0].id,
      },
      {
        content: "Miku Forever!!!!",
        userId: user2.id,
        videoId: videoRecords[0].id,
      },
      {
        content: "QiQi is Good at singing",
        userId: user1.id,
        videoId: videoRecords[1].id,
      },
      {
        content: "What about kikuo",
        userId: user2.id,
        videoId: videoRecords[1].id,
      },
      {
        content: "This video is amazing!",
        userId: user1.id,
        videoId: videoRecords[2].id,
      },
      {
        content: "I love this!",
        userId: user2.id,
        videoId: videoRecords[2].id,
      },
      {
        content: "Luka Luka Night Fever is the best!",
        userId: user1.id,
        videoId: videoRecords[3].id,
      },
      {
        content: "Triple Baka is so funny!",
        userId: user2.id,
        videoId: videoRecords[4].id,
      },
      {
        content: "Eternal Youth forever!",
        userId: user1.id,
        videoId: videoRecords[5].id,
      },
    ];

    await this.prismaService.comment.createMany({ data: comments });

    const commentRecords = await this.prismaService.comment.findMany();

    // Create comment ratings
    const commentRatings = [
      {
        likes: 5,
        dislikes: 1,
        commentId: commentRecords[0].id,
        userId: user2.id,
      },
      {
        likes: 3,
        dislikes: 0,
        commentId: commentRecords[1].id,
        userId: user1.id,
      },
      {
        likes: 8,
        dislikes: 2,
        commentId: commentRecords[2].id,
        userId: user2.id,
      },
      {
        likes: 6,
        dislikes: 1,
        commentId: commentRecords[3].id,
        userId: user1.id,
      },
      {
        likes: 10,
        dislikes: 0,
        commentId: commentRecords[4].id,
        userId: user2.id,
      },
      {
        likes: 7,
        dislikes: 2,
        commentId: commentRecords[5].id,
        userId: user1.id,
      },
      {
        likes: 4,
        dislikes: 1,
        commentId: commentRecords[6].id,
        userId: user2.id,
      },
      {
        likes: 9,
        dislikes: 0,
        commentId: commentRecords[7].id,
        userId: user1.id,
      },
      {
        likes: 6,
        dislikes: 3,
        commentId: commentRecords[8].id,
        userId: user2.id,
      },
    ];

    await this.prismaService.commentRating.createMany({ data: commentRatings });

    // Create video likes
    const videoLikes = [
      { userId: user1.id, videoId: videoRecords[0].id },
      { userId: user2.id, videoId: videoRecords[0].id },
      { userId: user1.id, videoId: videoRecords[1].id },
      { userId: user2.id, videoId: videoRecords[1].id },
      { userId: user1.id, videoId: videoRecords[2].id },
      { userId: user2.id, videoId: videoRecords[2].id },
      { userId: user1.id, videoId: videoRecords[3].id },
      { userId: user2.id, videoId: videoRecords[3].id },
      { userId: user1.id, videoId: videoRecords[4].id },
      { userId: user2.id, videoId: videoRecords[4].id },
      { userId: user1.id, videoId: videoRecords[5].id },
      { userId: user2.id, videoId: videoRecords[5].id },
    ];

    await this.prismaService.videoLike.createMany({ data: videoLikes });

    // Create video views
    const videoViews = [
      { userId: user1.id, videoId: videoRecords[0].id },
      { userId: user2.id, videoId: videoRecords[0].id },
      { userId: user1.id, videoId: videoRecords[1].id },
      { userId: user2.id, videoId: videoRecords[1].id },
      { userId: user1.id, videoId: videoRecords[2].id },
      { userId: user2.id, videoId: videoRecords[2].id },
      { userId: user1.id, videoId: videoRecords[3].id },
      { userId: user2.id, videoId: videoRecords[3].id },
      { userId: user1.id, videoId: videoRecords[4].id },
      { userId: user2.id, videoId: videoRecords[4].id },
      { userId: user1.id, videoId: videoRecords[5].id },
      { userId: user2.id, videoId: videoRecords[5].id },
    ];

    await this.prismaService.views.createMany({ data: videoViews });
  }
}
