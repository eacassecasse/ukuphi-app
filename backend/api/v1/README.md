# Ukuphi API (backend/api/v1)

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Fastify](https://img.shields.io/badge/Fastify-000000?style=for-the-badge&logo=fastify&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)

Welcome to the Ukuphi API! This API is the heart of our platform, designed to help you build, connect, and innovate with ease. Whether you're a developer, a business owner, or simply curious, this guide will help you understand what our API offers and how it can benefit you.kuphi API (backend/api/v1)

Welcome to the Ukuphi API! This API is the heart of our platform, designed to help you build, connect, and innovate with ease. Whether you’re a developer, a business owner, or simply curious, this guide will help you understand what our API offers and how it can benefit you.

## What is the Ukuphi API?
The Ukuphi API is a set of tools and services that allow you to interact with our platform programmatically. It powers features like user authentication, event management, notifications, bookings, and more. Our goal is to make your experience smooth, secure, and reliable.

## Who is it for?
- **Developers:** Easily integrate Ukuphi’s features into your apps or websites.
- **Businesses & Organizers:** Manage events, bookings, and users efficiently.
- **Curious Minds:** Explore how modern platforms work behind the scenes.

## Key Features
- **User Authentication:** Secure login and registration.
- **Event Management:** Create, update, and manage events.
- **Booking System:** Handle reservations and ticketing.
- **Notifications:** Keep users informed in real-time.
- **Reviews & Ratings:** Collect feedback and improve experiences.
- **Search & Discovery:** Find events, venues, and more.

## Friendly Technology Stack

### Core Technologies
- ![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white) **Node.js & TypeScript:** For a reliable and maintainable codebase.
- ![Fastify](https://img.shields.io/badge/Fastify-000000?style=flat&logo=fastify&logoColor=white) **Fastify:** A web framework that makes everything run quickly and efficiently.
- ![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=flat&logo=Prisma&logoColor=white) **Prisma:** Simplifies database interactions and keeps your data safe.

### Data & Storage
- ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat&logo=postgresql&logoColor=white) **PostgreSQL:** Robust database for reliable data storage.
- ![Redis](https://img.shields.io/badge/Redis-DC382D?style=flat&logo=redis&logoColor=white) **Redis:** Helps deliver notifications and manage sessions instantly.

### Communication & Services
- ![Nodemailer](https://img.shields.io/badge/Nodemailer-22B5BF?style=flat&logo=gmail&logoColor=white) **Nodemailer:** Ensures emails reach users promptly.
- ![Twilio](https://img.shields.io/badge/Twilio-F22F46?style=flat&logo=twilio&logoColor=white) **Twilio:** SMS notifications and communication.
- ![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=flat&logo=firebase&logoColor=black) **Firebase Admin:** User authentication and management.

### DevOps & Deployment
- ![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white) **Docker:** Makes deployment and scaling a breeze.
- ![PM2](https://img.shields.io/badge/PM2-2B037A?style=flat&logo=pm2&logoColor=white) **PM2:** Process management for production.

### Development Tools
- ![Zod](https://img.shields.io/badge/Zod-3E67B1?style=flat&logo=zod&logoColor=white) **Zod:** Schema validation and type safety.
- ![Biome](https://img.shields.io/badge/Biome-60A5FA?style=flat&logo=biome&logoColor=white) **Biome:** Code formatting and linting.
- ![Sentry](https://img.shields.io/badge/Sentry-362D59?style=flat&logo=sentry&logoColor=white) **Sentry:** Error monitoring and performance tracking.

## 📁 Project Structure

```
backend/api/v1/
├── 📁 src/
│   ├── 📄 index.ts                 # Main application entry point
│   ├── 📁 @types/                  # TypeScript type definitions
│   ├── 📁 config/                  # Configuration files
│   │   ├── firebase.ts             # Firebase configuration
│   │   └── 📁 templates/           # Email templates
│   ├── 📁 lib/                     # Shared libraries and utilities
│   │   ├── nodemailer.ts          # Email service configuration
│   │   ├── redis.ts               # Redis client setup
│   │   ├── 📁 errors/             # Error handling
│   │   ├── 📁 pagination/         # Pagination utilities
│   │   ├── 📁 prisma/             # Database client
│   │   └── 📁 schemas/            # Shared schemas
│   ├── 📁 modules/                # Feature modules
│   │   ├── 📁 auth/               # Authentication & authorization
│   │   ├── 📁 users/              # User management
│   │   ├── 📁 events/             # Event management
│   │   ├── 📁 venues/             # Venue management
│   │   ├── 📁 tickets/            # Ticketing system
│   │   ├── 📁 orders/             # Order processing
│   │   ├── 📁 payments/           # Payment handling
│   │   ├── 📁 notifications/      # Notification service
│   │   ├── 📁 reviews/            # Reviews & ratings
│   │   ├── 📁 posts/              # Content management
│   │   ├── 📁 categories/         # Category management
│   │   └── 📁 search/             # Search functionality
│   ├── 📁 plugins/                # Fastify plugins
│   │   ├── authenticate.ts        # JWT authentication
│   │   ├── errorHandler.ts        # Global error handling
│   │   ├── verifyOwnership.ts     # Resource ownership verification
│   │   └── verifyRole.ts          # Role-based access control
│   └── 📁 utils/                  # Utility functions
├── 📁 prisma/                     # Database schema and migrations
│   ├── schema.prisma              # Database schema
│   ├── seed.ts                    # Database seeding
│   └── 📁 migrations/             # Database migrations
├── 📁 test/                       # Test files
├── 📁 docker/                     # Docker configuration
├── 📄 package.json                # Dependencies and scripts
├── 📄 tsconfig.json               # TypeScript configuration
├── 📄 Dockerfile                  # Docker image configuration
├── 📄 docker-compose.yml          # Multi-container setup
└── 📄 ecosystem.config.js         # PM2 process configuration
```

## Performance & Reliability
- **Speed:** Our API responds quickly, thanks to Fastify and Redis.
- **Security:** We use JWT (JSON Web Tokens) and robust validation to protect your data.
- **Scalability:** Docker and Prisma help us grow with your needs.
- **Testing:** Automated tests keep everything working smoothly.

## 🚀 How to Get Started

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database
- Redis server
- Docker (optional, for containerized setup)

### Quick Start
1. **Clone the Repository:**
   ```bash
   git clone https://github.com/eacassecasse/ukuphi-app.git
   ```

2. **Navigate to the API Folder:**
   ```bash
   cd ukuphi-app/backend/api/v1
   ```

3. **Install Dependencies:**
   ```bash
   npm install
   ```

4. **Set Up Environment Variables:**
   Create a `.env` file based on the example and configure your database and services.

5. **Run Database Migrations:**
   ```bash
   npx prisma migrate dev
   ```

6. **Seed the Database (Optional):**
   ```bash
   npx prisma db seed
   ```

7. **Start the Development Server:**
   ```bash
   npm run start:dev
   ```

### Available Scripts
- `npm run start:dev` - Start development server with hot reload
- `npm run build` - Build the TypeScript project
- `npm start` - Run the built application
- `npm run start:prod` - Run in production mode
- `npm run serve` - Deploy with PM2 process manager

### Docker Setup
For a containerized environment:
```bash
docker-compose up -d
```

## 🛣️ API Routes Overview

### Authentication Routes (`/auth`)
- `POST /auth/login` - User login with credentials
- `POST /auth/register` - New user registration
- `DELETE /auth/logout` - User logout

### User Management (`/users`)
- `POST /users` - Create new user
- `GET /users/me` - Get current user profile
- `PATCH /users/:id` - Update user information
- `PATCH /users/:id/verify` - Verify user account (Admin only)

### Event Management (`/events`)
- `GET /events` - List all events with pagination
- `POST /events` - Create new event (Organizers only)
- `GET /events/:id` - Get event details
- `PUT /events/:id` - Update event (Owner/Admin only)
- `DELETE /events/:id` - Delete event (Owner/Admin only)

### Venue Management (`/venues`)
- `GET /venues` - List all venues
- `POST /venues` - Create new venue
- `GET /venues/:id` - Get venue details
- `PUT /venues/:id` - Update venue information

### Ticketing (`/tickets`)
- `GET /tickets` - List available tickets
- `POST /tickets` - Create ticket type
- `GET /tickets/:id` - Get ticket details
- `PATCH /tickets/:id` - Update ticket information

### Order Processing (`/orders`)
- `GET /orders` - List user orders
- `POST /orders` - Create new order
- `GET /orders/:id` - Get order details
- `PATCH /orders/:id/status` - Update order status

### Payment Processing (`/payments`)
- `POST /payments/process` - Process payment
- `GET /payments/:id/status` - Check payment status
- `POST /payments/webhook` - Payment provider webhook

### Notifications (`/notifications`)
- `GET /notifications` - Get user notifications
- `POST /notifications/send` - Send notification (Admin only)
- `PATCH /notifications/:id/read` - Mark as read

### Reviews & Ratings (`/reviews`)
- `GET /reviews` - Get reviews for events/venues
- `POST /reviews` - Create new review
- `PUT /reviews/:id` - Update review
- `DELETE /reviews/:id` - Delete review

### Search & Discovery (`/search`)
- `GET /search/events` - Search events by criteria
- `GET /search/venues` - Search venues
- `GET /search/suggestions` - Get search suggestions

## 📖 Usage Guide

### Authentication
Most endpoints require authentication. Include the JWT token in your requests:
```bash
curl -H "Authorization: Bearer <your-jwt-token>" \
     https://api.ukuphi.com/users/me
```

### Pagination
List endpoints support pagination:
```bash
GET /events?page=1&limit=10&sortBy=createdAt&sortOrder=desc
```

### Error Handling
The API returns structured error responses:
```json
{
  "error": "Validation failed",
  "message": "Email is required",
  "statusCode": 400
}
```

### Rate Limiting
API endpoints are rate-limited to ensure fair usage and system stability.

## 🔧 Configuration

### Environment Variables
Create a `.env` file with the following variables:
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/ukuphi_db"

# Redis
REDIS_URL="redis://localhost:6379"

# JWT
JWT_SECRET="your-secret-key"

# Email Service
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-password"

# Twilio (SMS)
TWILIO_ACCOUNT_SID="your-twilio-sid"
TWILIO_AUTH_TOKEN="your-twilio-token"

# Firebase
FIREBASE_PROJECT_ID="your-firebase-project"
FIREBASE_PRIVATE_KEY="your-firebase-key"

# Sentry (Error Monitoring)
SENTRY_DSN="your-sentry-dsn"
```

## 🤝 Contributing
We welcome everyone! If you have ideas, suggestions, or want to help improve the API, feel free to join us. Respect, collaboration, and professionalism are at the core of our community.

### Development Workflow
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and test them
4. Commit your changes: `git commit -m 'Add amazing feature'`
5. Push to your branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

### Code Style
We use Biome for code formatting and linting. Run `npx biome check` before committing.

## 📊 Monitoring & Analytics
- **Error Tracking:** Sentry integration for real-time error monitoring
- **Performance:** Built-in performance profiling with Sentry
- **Logging:** Structured logging with Pino
- **Health Checks:** Built-in health check endpoints

## 🔒 Security Features
- JWT-based authentication
- Role-based access control (RBAC)
- Input validation with Zod schemas
- Rate limiting to prevent abuse
- CORS protection
- Helmet.js security headers
- Bcrypt password hashing

## 📈 Performance Optimizations
- **Fast Framework:** Fastify provides superior performance over Express
- **Caching:** Redis caching for frequently accessed data
- **Database:** Prisma ORM with connection pooling
- **Compression:** Response compression for faster data transfer
- **Validation:** Efficient schema validation with TypeBox and Zod

## 📞 Support & Contact
If you need help or have questions, reach out via our GitHub issues page or contact the team directly. We’re here to help you succeed!

---

Thank you for choosing Ukuphi. Together, we’re building something amazing!
