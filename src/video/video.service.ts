import { Injectable } from "@nestjs/common";
import { CreateVideoDto } from "./dto/create-video.dto";
import { UpdateVideoDto } from "./dto/update-video.dto";
import { PrismaService } from "../utils/prisma.service";
import { join } from "path";

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
      poster,
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
        poster,
        comment: comments.map((el) => {
          return {
            id: el.id,
            by: el?.userId || el?.oauthUserId,
            profile: el.author?.picture || el.oauthAuthor?.picture,
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
  async seedVideos(){
    // Create some users
  const users = await this.prismaService.user.createMany({
    data: [
      { name: "Alice",picture: join("public","profiles",'default-fischl.jpg'), password: "alicepassword", email: "alice@example.com", isActive: true },
      { name: "Rize Kishimaro",picture: join( "public","profiles",'anime-default-pfp-5.jpg'), password: "bobpassword", email: "bob@example.com", isActive: true },
    ],
  });

  const createdUsers = await this.prismaService.user.findMany();
  const user1 = createdUsers[0];
  const user2 = createdUsers[1];

  // Create some videos
  const videos = [
    {
      title: "QiQi- I'm willing to be normal",
      description: "Support Me On twitter.",
      poster: "https://static.wikia.nocookie.net/3410c868-a3a9-4741-a6c8-eb279992d028",
      url: join(process.cwd(), "public", "videos", "willing-to-be-normal.mp4"),
      userId: user1.id,
    },
    {
      title: "Amanamaguchi Miku",
      description: "Forever Hatsunemiku",
      poster: "https://i.ytimg.com/vi/2oa5WCUpwD8/oar2.jpg?sqp=-oaymwEYCJUDENAFSFqQAgHyq4qpAwcIARUAAIhC&rs=AOn4CLCNXgI7nBuHtMphb94nIKEiy-230Q",
      url: join(process.cwd(), "public", "videos", "mikumiku.mp4"),
      userId: user2.id,
    },
    {
      title: "Prince Of Darkness",
      description: "Phonk video is wild :D",
      poster: "https://i1.sndcdn.com/artworks-jf62qRcVM2pbCEWp-HFf2XQ-t500x500.jpg",
      url: join(process.cwd(), "public", "videos", "prince_of_darkness.mp4"),
      userId: user1.id,
    },
    {
      title: "Luka Luka Night Fever",
      description: "Let's dance with Luka!",
      poster: "https://i.ytimg.com/vi/ScSW9C3DF18/maxresdefault.jpg",
      url: join(process.cwd(), "public", "videos", "lukaluka.mp4"),
      userId: user2.id,
    },
    {
      title: "Triple Baka",
      description: "BakaBakaBaka!",
      poster: "https://i.ytimg.com/vi/HhN4wdpbPrg/hqdefault.jpg",
      url: join(process.cwd(), "public", "videos", "triple_baka.mp4"),
      userId: user2.id,
    },
    {
      title: "Eternal Youth",
      description: "Eternal Youth By Rude",
      poster: "https://i.scdn.co/image/ab67616d0000b273097f3d06dd8726a91f526e21",
      url: join(process.cwd(), "public", "videos", "eternal_youth.mp4"),
      userId: user1.id,
    },
  ];

  await this.prismaService.video.createMany({ data: videos });

  const videoRecords = await this.prismaService.video.findMany();

  // Create comments for the videos
  const comments = [
    { content: "I like this song",userId: user1.id, videoId: videoRecords[0].id },
    { content: "Miku Forever!!!!", userId: user2.id, videoId: videoRecords[0].id },
    { content: "QiQi is Good at singing", userId: user1.id, videoId: videoRecords[1].id },
    { content: "What about kikuo", userId: user2.id, videoId: videoRecords[1].id },
    { content: "This video is amazing!", userId: user1.id, videoId: videoRecords[2].id },
    { content: "I love this!", userId: user2.id, videoId: videoRecords[2].id },
    { content: "Luka Luka Night Fever is the best!", userId: user1.id, videoId: videoRecords[3].id },
    { content: "Triple Baka is so funny!", userId: user2.id, videoId: videoRecords[4].id },
    { content: "Eternal Youth forever!", userId: user1.id, videoId: videoRecords[5].id },
  ];

  await this.prismaService.comment.createMany({ data: comments });

  const commentRecords = await this.prismaService.comment.findMany();

  // Create comment ratings
  const commentRatings = [
    { likes: 5, dislikes: 1, commentId: commentRecords[0].id, userId: user2.id },
    { likes: 3, dislikes: 0, commentId: commentRecords[1].id, userId: user1.id },
    { likes: 8, dislikes: 2, commentId: commentRecords[2].id, userId: user2.id },
    { likes: 6, dislikes: 1, commentId: commentRecords[3].id, userId: user1.id },
    { likes: 10, dislikes: 0, commentId: commentRecords[4].id, userId: user2.id },
    { likes: 7, dislikes: 2, commentId: commentRecords[5].id, userId: user1.id },
    { likes: 4, dislikes: 1, commentId: commentRecords[6].id, userId: user2.id },
    { likes: 9, dislikes: 0, commentId: commentRecords[7].id, userId: user1.id },
    { likes: 6, dislikes: 3, commentId: commentRecords[8].id, userId: user2.id },
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
