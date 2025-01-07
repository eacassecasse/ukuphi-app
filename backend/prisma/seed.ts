import {
  PrismaClient,
  Role,
  Payment_Method,
  Payment_Status,
  Notification_Type,
  Notification_Status,
} from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create Admin, Organizer, and Attendee users
  const users = await prisma.user.createMany({
    data: [
      {
        name: "Edmilson de Azevedo",
        email: "edmilsoncassecasse25@gmail.com",
        password: "33645766",
        role: Role.ADMIN,
        verified: false,
        phone: "+258870616620",
      },
      {
        name: "Linson DMT",
        email: "yonnival0.8@gmail.com",
        password: "96664825",
        role: Role.ADMIN,
        verified: true,
      },
      {
        name: "Nkeiru Lois",
        email: "nkeirulois8@gmail.com",
        password: "6534785647",
        role: Role.ORGANIZER,
        verified: true,
      },
      {
        name: "Kessiena Arhata-Obehi",
        email: "organizer2@example.com",
        password: "53774362",
        role: Role.ORGANIZER,
        verified: true,
      },
      {
        name: "Attendee User 1",
        email: "attendee1@example.com",
        password: "hashed-password",
        role: Role.ATTENDEE,
        verified: false,
      },
      {
        name: "Attendee User 2",
        email: "attendee2@example.com",
        password: "hashed-password",
        role: Role.ATTENDEE,
        verified: false,
      },
      {
        name: "Attendee User 3",
        email: "attendee3@example.com",
        password: "hashed-password",
        role: Role.ATTENDEE,
        verified: false,
      },
    ],
  });

  // Create Events with embedded Tickets and Payments
  const events = await Promise.all([
    prisma.event.create({
      data: {
        title: "Sample Event 1",
        description: "Sample description for event 1",
        location: "Location 1",
        image_url: "https://via.placeholder.com/150",
        date: new Date("2025-12-01T10:00:00Z"),
        organizerId: users[0].id,
        tickets: {
          create: [
            {
              type: "Ticket Type 1",
              price: 50,
              existingQuantity: 100,
              payments: {
                create: [
                  {
                    userId: users[5].id,
                    amount: 50,
                    method: Payment_Method.CREDIT_CARD,
                    status: Payment_Status.CONFIRMED,
                    qr_code: "sample-qr-code-1",
                  },
                ],
              },
            },
            {
              type: "Ticket Type 2",
              price: 60,
              existingQuantity: 100,
              payments: {
                create: [
                  {
                    userId: users[6].id,
                    amount: 60,
                    method: Payment_Method.DEBIT_CARD,
                    status: Payment_Status.PENDING,
                    qr_code: "sample-qr-code-2",
                  },
                ],
              },
            },
          ],
        },
      },
    }),
    prisma.event.create({
      data: {
        title: "Sample Event 2",
        description: "Sample description for event 2",
        location: "Location 2",
        image_url: "https://via.placeholder.com/150",
        date: new Date("2025-12-05T14:00:00Z"),
        organizerId: users[2].id,
        tickets: {
          create: [
            {
              type: "Ticket Type 1",
              price: 50,
              existingQuantity: 100,
              payments: {
                create: [
                  {
                    userId: users[4].id,
                    amount: 50,
                    method: Payment_Method.CREDIT_CARD,
                    status: Payment_Status.CONFIRMED,
                    qr_code: "sample-qr-code-3",
                  },
                ],
              },
            },
            { type: "Ticket Type 2", price: 60, existingQuantity: 100 },
          ],
        },
      },
    }),
  ]);

  // Create Notifications
  const notifications = await prisma.notification.createMany({
    data: [
      {
        userId: users[0].id,
        message: "Event 1 Created",
        type: Notification_Type.INFO,
        status: Notification_Status.UNREAD,
        sentAt: new Date(),
      },
      {
        userId: users[1].id,
        message: "Event 2 Created",
        type: Notification_Type.INFO,
        status: Notification_Status.UNREAD,
        sentAt: new Date(),
      },
    ],
  });

  // Create Posts with Tags and Comments
  const posts = await prisma.post.createMany({
    data: [
      {
        authorId: users[0].id,
        title: "Blog Post 1",
        content: "Content for Blog Post 1.",
        featured_image: "https://via.placeholder.com/150",
        publishedAt: new Date(),
      },
      {
        authorId: users[1].id,
        title: "Blog Post 2",
        content: "Content for Blog Post 2.",
        featured_image: "https://via.placeholder.com/150",
        publishedAt: new Date(),
      },
    ],
  });

  // Add Tags to Posts
  const tags = await prisma.tag.createMany({
    data: [
      { postId: posts[0].id, content: "Tag 1" },
      { postId: posts[0].id, content: "Tag 2" },
      { postId: posts[1].id, content: "Tag 3" },
    ],
  });

  // Create Comments for Posts
  const comments = await prisma.comment.createMany({
    data: [
      {
        userId: users[5].id,
        title: "Comment 1 for Post",
        content: "Content for Comment 1.",
        commentedAt: new Date(),
      },
      {
        userId: users[6].id,
        title: "Comment 2 for Post",
        content: "Content for Comment 2.",
        commentedAt: new Date(),
      },
    ],
  });

  // Link Comments to Posts
  const postComments = await prisma.post_Comment.createMany({
    data: [
      { postId: posts[0].id, commentId: comments[0].id },
      { postId: posts[1].id, commentId: comments[1].id },
    ],
  });

  console.log("Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
