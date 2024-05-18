const {join} = require("path")

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Create some users
  const user1 = await prisma.user.create({
    data: {
      name: 'Alice',
      password: 'alicepassword',
      email: 'alice@example.com',
      isActive: true,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: 'Bob',
      password: 'bobpassword',
      email: 'bob@example.com',
      isActive: true,
    },
  });

  // Create some videos
  const video1 = await prisma.video.create({
    data: {
      title: 'QiQi- I\'m willing to be normal',
      description: 'Support Me On twitter.',
      url: join(process.cwd(),"public","videos","willing-to-be-normal.mp4"),
      author: { connect: { id: user1.id } },
    },
  });

  const video2 = await prisma.video.create({
    data: {
      title: 'Amanaguchi Miku',
      description: 'Forever Hatsunemiku',
      url: join(process.cwd(),"public","videos","mikumiku.mp4"),
      author: { connect: { id: user2.id } },
    },
  });

  // Create comments for the videos
  const comment1 = await prisma.comment.create({
    data: {
      content: 'I like this song',
      author: { connect: { id: user1.id } },
      video: { connect: { id: video1.id } },
    },
  });

  const comment2 = await prisma.comment.create({
    data: {
      content: 'Miku Forever!!!!',
      author: { connect: { id: user2.id } },
      video: { connect: { id: video1.id } },
    },
  });

  const comment3 = await prisma.comment.create({
    data: {
      content: 'QiQi is Good at singing',
      author: { connect: { id: user1.id } },
      video: { connect: { id: video2.id } },
    },
  });

  const comment4 = await prisma.comment.create({
    data: {
      content: 'What about kikuo',
      author: { connect: { id: user2.id } },
      video: { connect: { id: video2.id } },
    },
  });

  // Create comment ratings
  await prisma.commentRating.createMany({
    data: [
      {
        likes: 5,
        dislikes: 1,
        commentId: comment1.id,
        userId: user2.id,
      },
      {
        likes: 3,
        dislikes: 0,
        commentId: comment2.id,
        userId: user1.id,
      },
      {
        likes: 8,
        dislikes: 2,
        commentId: comment3.id,
        userId: user2.id,
      },
      {
        likes: 6,
        dislikes: 1,
        commentId: comment4.id,
        userId: user1.id,
      },
    ],
  });

  // Create video likes
  await prisma.like.createMany({
    data: [
      {
        userId: user1.id,
        videoId: video1.id,
      },
      {
        userId: user2.id,
        videoId: video1.id,
      },
      {
        userId: user1.id,
        videoId: video2.id,
      },
      {
        userId: user2.id,
        videoId: video2.id,
      },
    ],
  });

  await prisma.view.createMany({
    data: [
      {
        userId: user1.id,
        videoId: video1.id,
      },
      {
        userId: user2.id,
        videoId: video1.id,
      },
      {
        userId: user1.id,
        videoId: video2.id,
      },
      {
        userId: user2.id,
        videoId: video2.id,
      },
    ],
  });
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
