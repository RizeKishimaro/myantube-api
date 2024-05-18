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
      url: 'http://127.0.0.1:3000/videos/willing-to-be-normal.mp4',
      author: { connect: { id: user1.id } },
    },
  });

  const video2 = await prisma.video.create({
    data: {
      title: 'Second Video',
      description: 'This is the second video.',
      url: 'http://example.com/second-video',
      author: { connect: { id: user2.id } },
    },
  });

  // Create some comments for the videos
  await prisma.comment.createMany({
    data: [
      {
        content: 'Great video!',
        userId: user1.id,
        videoId: video1.id,
      },
      {
        content: 'Nice explanation!',
        userId: user2.id,
        videoId: video1.id,
      },
      {
        content: 'I learned a lot.',
        userId: user1.id,
        videoId: video2.id,
      },
      {
        content: 'Very informative.',
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
