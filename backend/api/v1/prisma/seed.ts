import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";
import {
  UserRole,
  VerificationStatus,
  EventStatus,
  OrderStatus,
  PaymentMethod,
  TicketStatus,
  NotificationType,
  RefundReason,
  RefundStatus,
  PostStatus,
} from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seeding...");

  // Clear existing data (optional - be careful in production!)
  await prisma.$transaction([
    prisma.refund.deleteMany(),
    prisma.ticket.deleteMany(),
    prisma.order.deleteMany(),
    prisma.ticketInventory.deleteMany(),
    prisma.ticketType.deleteMany(),
    prisma.eventReview.deleteMany(),
    prisma.savedEvent.deleteMany(),
    prisma.event.deleteMany(),
    prisma.venue.deleteMany(),
    prisma.eventCategory.deleteMany(),
    prisma.notification.deleteMany(),
    prisma.postComment.deleteMany(),
    prisma.postLike.deleteMany(),
    prisma.postTagRelation.deleteMany(),
    prisma.postTag.deleteMany(),
    prisma.post.deleteMany(),
    prisma.user.deleteMany(),
  ]);

  // 1. Create Users (150 records)
  console.log("Creating users...");
  const users: any[] = [];
  for (let i = 0; i < 150; i++) {
    const user = await prisma.user.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        phone: faker.phone.number(),
        password: faker.internet.password(),
        role: faker.helpers.arrayElement(Object.values(UserRole)),
        verificationStatus: faker.helpers.arrayElement(
          Object.values(VerificationStatus)
        ),
        preferredLanguage: faker.helpers.arrayElement([
          "pt-MZ",
          "en-US",
          "fr-FR",
        ]),
        accountCredit: faker.number.float({
          min: 0,
          max: 1000,
          fractionDigits: 2,
        }),
        marketingOptIn: faker.datatype.boolean(),
        lastLogin: faker.date.recent(),
      },
    });
    users.push(user);
  }

  // 2. Create Venues (30 records)
  console.log("Creating venues...");
  const venues: any[] = [];
  for (let i = 0; i < 30; i++) {
    const venue = await prisma.venue.create({
      data: {
        name:
          faker.company.name() +
          " " +
          faker.helpers.arrayElement(["Hall", "Center", "Arena", "Theater"]),
        address: faker.location.streetAddress(),
        city: faker.location.city(),
        capacity: faker.number.int({ min: 50, max: 5000 }),
        contactPhone: faker.phone.number(),
        contactEmail: faker.internet.email(),
        geoPoint: `${faker.location.latitude()},${faker.location.longitude()}`,
        amenities: faker.helpers.arrayElements(
          [
            "WiFi",
            "Parking",
            "Wheelchair Access",
            "Catering",
            "Audio/Visual",
            "Outdoor Space",
            "Bar",
          ],
          { min: 2, max: 5 }
        ),
        images: Array.from({ length: 3 }, () =>
          faker.image.urlLoremFlickr({ category: "building" })
        ),
      },
    });
    venues.push(venue);
  }

  // 3. Create Event Categories (20 records with hierarchy)
  console.log("Creating event categories...");
  const categories: any[] = [];
  const primaryCategories: any[] = [];
  const usedSlugs = new Set(); // Track used slugs

  // First create 5 primary categories
  for (let i = 0; i < 5; i++) {
    let slug;
    do {
      slug = faker.helpers.slugify(
        faker.lorem.word() + "-" + faker.number.int({ min: 100, max: 999 })
      );
    } while (usedSlugs.has(slug));

    usedSlugs.add(slug);

    const category = await prisma.eventCategory.create({
      data: {
        name: faker.helpers.arrayElement([
          "Music",
          "Sports",
          "Arts",
          "Business",
          "Food",
        ]),
        slug: slug,
        iconUrl: faker.image.urlLoremFlickr({ category: "icon" }),
        isPrimary: true,
      },
    });
    primaryCategories.push(category);
  }

  // Then create 15 subcategories
  for (let i = 0; i < 15; i++) {
    let slug;
    do {
      slug = faker.helpers.slugify(
        faker.music.genre() + "-" + faker.number.int({ min: 100, max: 999 })
      );
    } while (usedSlugs.has(slug));

    usedSlugs.add(slug);

    const category = await prisma.eventCategory.create({
      data: {
        name:
          faker.music.genre() +
          " " +
          faker.helpers.arrayElement([
            "Festival",
            "Conference",
            "Expo",
            "Show",
          ]),
        slug: slug,
        iconUrl: faker.image.urlLoremFlickr({ category: "icon" }),
        parentId: faker.helpers.arrayElement(primaryCategories).id,
        isPrimary: false,
      },
    });
    categories.push(category);
  }

  // Combine all categories
  const allCategories = [...primaryCategories, ...categories];

  // 4. Create Events (120 records - mix of online and physical)
  console.log("Creating events...");
  const events: any[] = [];
  for (let i = 0; i < 120; i++) {
    const isOnline = faker.datatype.boolean({ probability: 0.3 });
    const eventData: any = {
      title: faker.helpers.arrayElement([
        faker.lorem.words(3) +
          " " +
          faker.helpers.arrayElement([
            "Festival",
            "Conference",
            "Expo",
            "Concert",
          ]),
        faker.company.name() +
          " " +
          faker.helpers.arrayElement(["Presents", "Presents", "Live"]),
      ]),
      description: faker.lorem.paragraphs(3),
      status: faker.helpers.arrayElement(Object.values(EventStatus)),
      isOnline,
      imageURL: faker.image.urlLoremFlickr({ category: "event" }),
      date: faker.date.soon({ days: 90 }),
      timezone: "Africa/Maputo",
      ageRestriction: faker.helpers.arrayElement([
        null,
        "18+",
        "21+",
        "All Ages",
      ]),
      organizerId: faker.helpers.arrayElement(users).id,
      categoryId: faker.helpers.arrayElement(allCategories).id,
    };

    if (isOnline) {
      eventData.onlineURL = faker.internet.url();
    } else {
      eventData.venueId = faker.helpers.arrayElement(venues).id;
    }

    const event = await prisma.event.create({
      data: eventData,
    });
    events.push(event);
  }

  // 5. Create Ticket Types (3-5 per event)
  console.log("Creating ticket types...");
  const ticketTypes: any[] = [];
  for (const event of events) {
    const typeCount = faker.number.int({ min: 3, max: 5 });
    for (let i = 0; i < typeCount; i++) {
      const ticketType = await prisma.ticketType.create({
        data: {
          name: faker.helpers.arrayElement([
            "General Admission",
            "VIP",
            "Early Bird",
            "Premium",
            "Student",
          ]),
          description: faker.lorem.sentence(),
          price: faker.number.float({ min: 10, max: 500, fractionDigits: 2 }),
          currency: "MZN",
          bookingFee: faker.number.float({
            min: 0,
            max: 50,
            fractionDigits: 2,
          }),
          isTransferable: faker.datatype.boolean(),
          minPerOrder: faker.number.int({ min: 1, max: 4 }),
          maxPerOrder: faker.number.int({ min: 2, max: 8 }),
          salesStart: faker.date.past(),
          salesEnd: faker.date.future(),
          eventId: event.id,
        },
      });
      ticketTypes.push(ticketType);

      // Create inventory for each ticket type
      await prisma.ticketInventory.create({
        data: {
          ticketTypeId: ticketType.id,
          initialQuantity: faker.number.int({ min: 50, max: 1000 }),
          availableQuantity: faker.number.int({ min: 0, max: 500 }),
          holdQuantity: faker.number.int({ min: 0, max: 50 }),
        },
      });
    }
  }

  // 6. Create Orders (300 records)
  console.log("Creating orders...");
  const orders: any[] = [];
  for (let i = 0; i < 300; i++) {
    const user = faker.helpers.arrayElement(users);
    const event = faker.helpers.arrayElement(events);
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        eventId: event.id,
        status: faker.helpers.arrayElement(Object.values(OrderStatus)),
        totalAmount: faker.number.float({
          min: 50,
          max: 2000,
          fractionDigits: 2,
        }),
        currency: "MZN",
        paymentMethod: faker.helpers.arrayElement(Object.values(PaymentMethod)),
        paymentGatewayId: faker.string.uuid(),
        paymentData: {
          transactionId: faker.string.uuid(),
          methodDetails: faker.finance.transactionDescription(),
        },
        paymentQrCode: faker.image.urlLoremFlickr({ category: "abstract" }),
        completedAt: faker.datatype.boolean() ? faker.date.recent() : null,
      },
    });
    orders.push(order);
  }

  // 7. Create Tickets (2-6 per order)
  console.log("Creating tickets...");
  for (const order of orders) {
    const eventTicketTypes = ticketTypes.filter(
      (tt) => tt.eventId === order.eventId
    );
    if (eventTicketTypes.length === 0) continue;

    const ticketCount = faker.number.int({ min: 2, max: 6 });
    for (let i = 0; i < ticketCount; i++) {
      const ticketType = faker.helpers.arrayElement(eventTicketTypes);
      await prisma.ticket.create({
        data: {
          orderId: order.id,
          ticketTypeId: ticketType.id,
          attendeeName: faker.person.fullName(),
          attendeeEmail: faker.internet.email(),
          qrCode: faker.string.uuid(),
          status: faker.helpers.arrayElement(Object.values(TicketStatus)),
          checkInTime: faker.datatype.boolean({ probability: 0.2 })
            ? faker.date.recent()
            : null,
          transferToken: faker.datatype.boolean({ probability: 0.1 })
            ? faker.string.uuid()
            : null,
          eventId: ticketType.eventId,
        },
      });
    }
  }

  // 8. Create Event Reviews (2-10 per event)
  console.log("Creating event reviews...");
  const reviewPairs = new Set(); // Track user-event pairs

  for (const event of events) {
    const reviewCount = faker.number.int({ min: 2, max: 10 });
    const potentialReviewers = faker.helpers.arrayElements(
      users,
      Math.min(reviewCount * 2, users.length)
    );

    let createdReviews = 0;

    for (const user of potentialReviewers) {
      if (createdReviews >= reviewCount) break;

      const pairKey = `${event.id}-${user.id}`;
      if (reviewPairs.has(pairKey)) continue;

      await prisma.eventReview.create({
        data: {
          eventId: event.id,
          userId: user.id,
          rating: faker.number.int({ min: 1, max: 5 }),
          comment: faker.lorem.paragraph(),
          isVerified: faker.datatype.boolean(),
        },
      });

      reviewPairs.add(pairKey);
      createdReviews++;
    }
  }

  // 9. Create Saved Events (5-20 per user)
  console.log("Creating saved events...");
  for (const user of users) {
    const savedCount = faker.number.int({ min: 5, max: 20 });
    const eventsToSave = faker.helpers.arrayElements(events, savedCount);
    for (const event of eventsToSave) {
      await prisma.savedEvent.create({
        data: {
          userId: user.id,
          eventId: event.id,
        },
      });
    }
  }

  // 10. Create Notifications (5-15 per user)
  console.log("Creating notifications...");
  for (const user of users) {
    const notificationCount = faker.number.int({ min: 5, max: 15 });
    for (let i = 0; i < notificationCount; i++) {
      await prisma.notification.create({
        data: {
          userId: user.id,
          title: faker.lorem.words(3),
          message: faker.lorem.sentence(),
          type: faker.helpers.arrayElement(Object.values(NotificationType)),
          isRead: faker.datatype.boolean(),
          metadata: {
            relatedEntity: faker.helpers.arrayElement([
              "event",
              "order",
              "system",
            ]),
            entityId: faker.string.uuid(),
          },
        },
      });
    }
  }

  // 11. Create Posts (50 records)
  console.log("Creating posts...");
  const posts: any[] = [];
  for (let i = 0; i < 50; i++) {
    const post = await prisma.post.create({
      data: {
        authorId: faker.helpers.arrayElement(users).id,
        title: faker.lorem.words(5),
        content: faker.lorem.paragraphs(5),
        excerpt: faker.lorem.sentence(),
        slug: faker.helpers.slugify(faker.lorem.words(3)),
        featuredImage: faker.image.urlLoremFlickr({ category: "nature" }),
        status: faker.helpers.arrayElement(Object.values(PostStatus)),
        publishedAt: faker.date.past(),
      },
    });
    posts.push(post);
  }

  // 12. Create Post Tags (20 records)
  console.log("Creating post tags...");
  const postTags: any[] = [];
  for (let i = 0; i < 20; i++) {
    const tag = await prisma.postTag.create({
      data: {
        name: faker.lorem.word(),
        slug: faker.helpers.slugify(faker.lorem.word()),
      },
    });
    postTags.push(tag);
  }

  // 13. Create Post-Tag Relations (2-5 tags per post)
  console.log("Creating post-tag relations...");
  for (const post of posts) {
    const tagsToAdd = faker.helpers.arrayElements(
      postTags,
      faker.number.int({ min: 2, max: 5 })
    );
    for (const tag of tagsToAdd) {
      await prisma.postTagRelation.create({
        data: {
          postId: post.id,
          tagId: tag.id,
        },
      });
    }
  }

  // 14. Create Post Likes (10-50 per post)
  console.log("Creating post likes...");
  for (const post of posts) {
    const likeCount = faker.number.int({ min: 10, max: 50 });
    const usersToLike = faker.helpers.arrayElements(users, likeCount);
    for (const user of usersToLike) {
      await prisma.postLike.create({
        data: {
          postId: post.id,
          userId: user.id,
        },
      });
    }
  }

  // 15. Create Post Comments (5-20 per post)
  console.log("Creating post comments...");
  for (const post of posts) {
    const commentCount = faker.number.int({ min: 5, max: 20 });
    for (let i = 0; i < commentCount; i++) {
      await prisma.postComment.create({
        data: {
          userId: faker.helpers.arrayElement(users).id,
          postId: post.id,
          title: faker.lorem.words(3),
          content: faker.lorem.paragraph(),
        },
      });
    }
  }

  // 16. Create Refunds (10% of orders)
  console.log("Creating refunds...");
  const ordersToRefund = faker.helpers.arrayElements(
    orders,
    Math.floor(orders.length * 0.1)
  );
  for (const order of ordersToRefund) {
    await prisma.refund.create({
      data: {
        orderId: order.id,
        processedById: faker.helpers.arrayElement(users).id,
        amount: faker.number.float({
          min: 10,
          max: order.totalAmount,
          fractionDigits: 2,
        }),
        reason: faker.helpers.arrayElement(Object.values(RefundReason)),
        status: faker.helpers.arrayElement(Object.values(RefundStatus)),
        gatewayId: faker.string.uuid(),
        completedAt: faker.datatype.boolean() ? faker.date.recent() : null,
      },
    });
  }

  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
