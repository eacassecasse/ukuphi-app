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
  // User 1
  const user1 = await prisma.user.create({
    data: {
      name: "Edmilson de Azevedo",
      email: "edmilsoncassecasse25@gmail.com",
      password: "$2y$10$XSBqlDvWAmX.0pPrQITxyeNLH5yicITnWoCG8ktKCMj8JBZMHg576", // 33645766
      role: Role.ADMIN,
      verified: true,
      phone: "+258870616620",
    },
  });

  // User 2
  const user2 = await prisma.user.create({
    data: {
      name: "Linson DMT",
      email: "yonnival0.8@gmail.com",
      password: "$2y$10$erlf5M4mS26SNq9ysGzmsuwUYcR.Kf8mZMTIpsHnXkJt4RqNFRRuC", // 96664825
      role: Role.ADMIN,
      verified: true,
    },
  });

  // User 3
  const user3 = await prisma.user.create({
    data: {
      name: "Nkeiru Lois",
      email: "nkeirulois8@gmail.com",
      password: "$2y$10$g8.uQt3/5t9UHab7yZ6c8.pF73bsA.fTPhH57zQh4fuNRjaQhj7E6", // 6534785647
      role: Role.ORGANIZER,
      verified: true,
    },
  });

  // User 4
  const user4 = await prisma.user.create({
    data: {
      name: "Kessiena Arhata-Obehi",
      email: "kess4obehi@gmail.com",
      password: "$2y$10$UJn2OtgnWRtVUtlP0syuNeAdGoeuwx0oqzuJ812XlaPQ9XKtRh812", // 53774362
      role: Role.ORGANIZER,
      verified: true,
    },
  });

  // User 5
  const user5 = await prisma.user.create({
    data: {
      name: "Attendee User 1",
      email: "attendee1@example.com",
      password: "$2y$10$nUQn6XxKhpCZGzyaxl7Xs.AQRG7qO1TlkdEv0tuDaAqW8y/MMTltS", // hashed-password1
      role: Role.ATTENDEE,
      verified: false,
    },
  });

  // User 6
  const user6 = await prisma.user.create({
    data: {
      name: "Attendee User 2",
      email: "attendee2@example.com",
      password: "$2y$10$I8EzGfnw4X3zr4L/kTd4huPit/qVChGoosVABWYHjXZF3alGX.OCu", // hashed-password2
      role: Role.ATTENDEE,
      verified: false,
    },
  });

  // User 7
  const user7 = await prisma.user.create({
    data: {
      name: "Attendee User 3",
      email: "attendee3@example.com",
      password: "$2y$10$WFJXPOTAyYFPkHOvfM2wA.pbwwu8oIzahLWxPZArNKd0csFQxxFjy", // hashed-password3
      role: Role.ATTENDEE,
      verified: false,
    },
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
        organizerId: user1.id,
        tickets: {
          create: [
            {
              type: "Ticket Type 1",
              price: 50,
              existingQuantity: 100,
              payments: {
                create: [
                  {
                    userId: user6.id,
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
                    userId: user7.id,
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
        organizerId: user3.id,
        tickets: {
          create: [
            {
              type: "Ticket Type 1",
              price: 50,
              existingQuantity: 100,
              payments: {
                create: [
                  {
                    userId: user5.id,
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
        userId: user1.id,
        message: "Event 1 Created",
        type: Notification_Type.INFO,
        status: Notification_Status.UNREAD,
        sentAt: new Date(),
      },
      {
        userId: user2.id,
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
        id: "6ab40ae8-35ad-4923-81ff-d5ccfb1a6895",
        authorId: user1.id,
        title: "Blog Post 1",
        content: "Content for Blog Post 1.",
        featured_image: "https://via.placeholder.com/150",
        publishedAt: new Date(),
      },
      {
        id: "9a275482-6ca3-47f9-ba97-4221748a54fb",
        authorId: user2.id,
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
      { postId: "6ab40ae8-35ad-4923-81ff-d5ccfb1a6895", content: "Tag 1" },
      { postId: "6ab40ae8-35ad-4923-81ff-d5ccfb1a6895", content: "Tag 2" },
      { postId: "9a275482-6ca3-47f9-ba97-4221748a54fb", content: "Tag 3" },
    ],
  });

  // Create Comments for Posts
  const comments = await prisma.comment.createMany({
    data: [
      {
        id: "862d4120-193f-4fa8-bac2-940375f69611",
        userId: "3d55066f-bb97-49b3-83e0-026df8546c91",
        title: "Comment 1 for Post",
        content: "Content for Comment 1.",
        commentedAt: new Date(),
      },
      {
        id: "7cfbf55e-3cda-4057-ba67-18bd1709acf5",
        userId: "6edaf43a-a5a5-4b4f-8302-9e92186226d6",
        title: "Comment 2 for Post",
        content: "Content for Comment 2.",
        commentedAt: new Date(),
      },
    ],
  });

  // Link Comments to Posts
  const postComments = await prisma.post_Comment.createMany({
    data: [
      { postId: "6ab40ae8-35ad-4923-81ff-d5ccfb1a6895", commentId: "862d4120-193f-4fa8-bac2-940375f69611" },
      { postId: "9a275482-6ca3-47f9-ba97-4221748a54fb", commentId: "7cfbf55e-3cda-4057-ba67-18bd1709acf5" },
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
