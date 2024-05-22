const { join } = require("path");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // Create some users
  const users = await prisma.user.createMany({
    data: [
      { name: "Alice", password: "alicepassword", email: "alice@example.com", isActive: true },
      { name: "Bob", password: "bobpassword", email: "bob@example.com", isActive: true },
    ],
  });

  const createdUsers = await prisma.user.findMany();
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
      poster: "https://static.wikia.nocookie.net/3410c868-a3a9-4741-a6c8-eb279992d028",
      url: join(process.cwd(), "public", "videos", "prince_of_darkness.mp4"),
      userId: user1.id,
    },
    {
      title: "Luka Luka Night Fever",
      description: "Let's dance with Luka!",
      poster: "https://static.wikia.nocookie.net/3410c868-a3a9-4741-a6c8-eb279992d028",
      url: join(process.cwd(), "public", "videos", "lukaluka.mp4"),
      userId: user2.id,
    },
    {
      title: "Triple Baka",
      description: "BakaBakaBaka!",
      poster: "https://static.wikia.nocookie.net/3410c868-a3a9-4741-a6c8-eb279992d028",
      url: join(process.cwd(), "public", "videos", "triple_baka.mp4"),
      userId: user2.id,
    },
    {
      title: "Eternal Youth",
      description: "Eternal Youth By Rude",
      poster: "https://static.wikia.nocookie.net/3410c868-a3a9-4741-a6c8-eb279992d028",
      url: join(process.cwd(), "public", "videos", "eternal_youth.mp4"),
      userId: user1.id,
    },
  ];

  await prisma.video.createMany({ data: videos });

  const videoRecords = await prisma.video.findMany();

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

  await prisma.comment.createMany({ data: comments });

  const commentRecords = await prisma.comment.findMany();

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

  await prisma.commentRating.createMany({ data: commentRatings });

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

  await prisma.videoLike.createMany({ data: videoLikes });

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

  await prisma.views.createMany({ data: videoViews });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
