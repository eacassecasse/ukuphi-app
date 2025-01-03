import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding...');

  // Seed data for users
  await prisma.user.createMany({
    data: [
      { id: '1', name: 'Alice Johnson', email: 'alice@example.com', phone: '1234567890', password: 'password1', role: 'ORGANIZER' },
      { id: '2', name: 'Bob Smith', email: 'bob@example.com', phone: '2345678901', password: 'password2', role: 'ATTENDEE' },
      { id: '3', name: 'Catherine Davis', email: 'catherine@example.com', phone: '3456789012', password: 'password3', role: 'ADMIN' },
      { id: '4', name: 'David Lee', email: 'david@example.com', phone: '4567890123', password: 'password4', role: 'ATTENDEE' },
      { id: '5', name: 'Eva White', email: 'eva@example.com', phone: '5678901234', password: 'password5', role: 'ORGANIZER' },
    ],
  });

  // Seed data for events
  await prisma.event.createMany({
    data: [
      { id: '1', organizerId: '1', title: 'Tech Conference 2024', description: 'A conference about tech trends.', location: 'San Francisco', image_url: 'http://example.com/img1.jpg', tickets_sold: 150, date: new Date('2024-08-01 09:00:00') },
      { id: '2', organizerId: '1', title: 'AI Summit', description: 'Exploring the future of AI.', location: 'New York', image_url: 'http://example.com/img2.jpg', tickets_sold: 200, date: new Date('2024-09-15 10:00:00') },
      { id: '3', organizerId: '5', title: 'Startup Workshop', description: 'Learn how to launch startups.', location: 'Los Angeles', image_url: 'http://example.com/img3.jpg', tickets_sold: 50, date: new Date('2024-10-20 14:00:00') },
      { id: '4', organizerId: '5', title: 'Design Expo', description: 'Showcasing modern designs.', location: 'Seattle', image_url: 'http://example.com/img4.jpg', tickets_sold: 100, date: new Date('2024-11-05 16:00:00') },
      { id: '5', organizerId: '1', title: 'Coding Bootcamp', description: 'Intensive programming training.', location: 'Austin', image_url: 'http://example.com/img5.jpg', tickets_sold: 300, date: new Date('2024-12-01 08:00:00') },
    ],
  });

  // Seed data for tickets
  await prisma.ticket.createMany({
    data: [
      { id: '1', existentQuantity: 750, eventId: '1', type: 'Standard', price: 50.0 },
      { id: '2', existentQuantity: 200, eventId: '1', type: 'VIP', price: 100.0 },
      { id: '3', existentQuantity: 500, eventId: '2', type: 'Standard', price: 75.0 },
      { id: '4', existentQuantity: 1200, eventId: '3', type: 'Standard', price: 30.0 },
      { id: '5', existentQuantity: 120, eventId: '4', type: 'VIP', price: 120.0 },
    ],
  });

  // Seed data for payments
  await prisma.payment.createMany({
    data: [
      { id: '1', userId: '1', ticketId: '1', amount: 50.0, method: 'DEBIT_CARD', status: 'CONFIRMED', qr_code: 'QR1', created_at: new Date('2024-07-01 12:00:00') },
      { id: '2', userId: '2',ticketId: '2', amount: 100.0, method: 'CREDIT_CARD', status: 'CONFIRMED', qr_code: 'QR2', created_at: new Date('2024-07-02 14:30:00') },
      { id: '3', userId: '1', ticketId: '3', amount: 75.0, method: 'MOBILE_WALLET', status: 'PENDING', qr_code: 'QR3', created_at: new Date('2024-07-03 16:45:00') },
      { id: '4', userId: '3', ticketId: '4', amount: 30.0, method: 'DEBIT_CARD', status: 'CONFIRMED', qr_code: 'QR4', created_at: new Date('2024-07-04 18:00:00') },
      { id: '5', userId: '5', ticketId: '5', amount: 120.0, method: 'CREDIT_CARD', status: 'CONFIRMED', qr_code: 'QR5', created_at: new Date('2024-07-05 20:15:00') },
    ],
  });

  // Seed data for notifications
  await prisma.notification.createMany({
    data: [
      { id: '1', userId: '1', message: 'Event Tech Conference 2024 is near.', type: 'Event Reminder', sentAt: new Date('2024-07-30 08:00:00') },
      { id: '2', userId: '2', message: 'Your ticket for AI Summit is confirmed.', type: 'Payment Confirmation', sentAt: new Date('2024-07-15 09:00:00') },
      { id: '3', userId: '3', message: 'Admin meeting scheduled.', type: 'Admin Alert', sentAt: new Date('2024-07-20 10:30:00') },
      { id: '4', userId: '4', message: 'Welcome to the platform!', type: 'Welcome Message', sentAt: new Date('2024-07-10 15:00:00') },
      { id: '5', userId: '5', message: 'Startup Workshop registration ends soon.', type: 'Registration Reminder', sentAt: new Date('2024-07-25 17:00:00') },
    ],
  });

  // Seed data for posts
  await prisma.post.createMany({
    data: [
      { id: '1', authorId: '1', title: 'Tech Revolution', content: 'A deep dive into technology.', location: 'San Francisco', featured_image: 'http://example.com/post1.jpg', publishedAt: new Date('2024-06-01 10:00:00') },
      { id: '2', authorId: '2', title: 'AI Ethics', content: 'Ethical considerations of AI.', location: 'New York', featured_image: 'http://example.com/post2.jpg', publishedAt: new Date('2024-06-05 11:30:00') },
      { id: '3', authorId: '3', title: 'Startup Growth', content: 'Tips for scaling startups.', location: 'Los Angeles', featured_image: 'http://example.com/post3.jpg', publishedAt: new Date('2024-06-10 14:00:00') },
      { id: '4', authorId: '4', title: 'Design Patterns', content: 'Modern UI/UX patterns.', location: 'Seattle', featured_image: 'http://example.com/post4.jpg', publishedAt: new Date('2024-06-15 16:00:00') },
      { id: '5', authorId: '5', title: 'Code Optimization', content: 'Writing efficient code.', location: 'Austin', featured_image: 'http://example.com/post5.jpg', publishedAt: new Date('2024-06-20 18:30:00') },
    ],
  });

  // Seed data for tags
  await prisma.tag.createMany({
    data: [
      { id: '1', content: 'Technology', postId: '1' },
      { id: '2', content: 'AI', postId: '2' },
      { id: '3', content: 'Startup', postId: '3' },
      { id: '4', content: 'Design', postId: '4' },
      { id: '5', content: 'Coding', postId: '5' },
    ],
  });

  // Seed data for comments
  await prisma.comment.createMany({
    data: [
      { id: '1', userId: '2', title: 'Great Event!', content: 'I loved the AI Summit.', commentedAt: new Date('2024-07-01 13:00:00') },
      { id: '2', userId: '3', title: 'Helpful Post', content: 'Thanks for the startup tips.', commentedAt: new Date('2024-07-05 14:30:00') },
      { id: '3', userId: '4', title: 'Well Organized', content: 'The Tech Conference was amazing.', commentedAt: new Date('2024-07-10 16:00:00') },
      { id: '4', userId: '5', title: 'Exciting!', content: 'Looking forward to Design Expo.', commentedAt: new Date('2024-07-15 18:30:00') },
      { id: '5', userId: '1', title: 'Good Read', content: 'The post on AI Ethics is thought-provoking.', commentedAt: new Date('2024-07-20 20:00:00') },
    ],
  });

  console.log('Seeding completed.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
