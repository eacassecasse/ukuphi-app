-- Exported from QuickDBD: https://www.quickdatabasediagrams.com/
-- Link to schema: https://app.quickdatabasediagrams.com/#/d/kG8jli
-- NOTE! If you have used non-SQL datatypes in your design, you will have to change these here.

-- Modify this code to update the DB schema diagram.
-- To reset the sample schema, replace everything with
-- two dots ('..' - without quotes).

CREATE TYPE roles AS ENUM ('ORGANIZER', 'ATTENDEE', 'ADMIN');
CREATE TYPE payment_methods AS ENUM ('DEBIT_CARD', 'CREDIT_CARD', 'MOBILE_WALLET');
CREATE TYPE status AS ENUM ('PENDING', 'CONFIRMED');


CREATE TABLE "users" (
    "id" VARCHAR(255)   NOT NULL,
    "name" VARCHAR(105)   NOT NULL,
    "email" VARCHAR(150)   NOT NULL,
    "phone" VARCHAR(14)   NOT NULL,
    "password" VARCHAR(255)   NOT NULL,
    -- Can be ORGANIZER, ATTENDEE, ADMIN
    "role" ROLES   NOT NULL,
    CONSTRAINT "pk_users" PRIMARY KEY (
        "id"
     ),
    CONSTRAINT "uc_users_email" UNIQUE (
        "email"
    )
);

CREATE TABLE "events" (
    "id" VARCHAR(255)   NOT NULL,
    "organizer_id" VARCHAR(255)   NOT NULL,
    "title" VARCHAR(150)   NOT NULL,
    "description" VARCHAR(255)   NOT NULL,
    "location" VARCHAR(190)   NOT NULL,
    -- Event image, mainly to display on our posts
    "image_url" VARCHAR(255)   NOT NULL,
    -- ON CREATE 0, controls the amount of persons that want to attend the event
    "tickets_sold" INT   NULL,
    "date" timestamp   NOT NULL,
    CONSTRAINT "pk_events" PRIMARY KEY (
        "id"
     )
);

CREATE TABLE "tickets" (
    "id" VARCHAR(255)   NOT NULL,
    "event_id" VARCHAR(255)   NOT NULL,
    "type" VARCHAR(35)   NOT NULL,
    "price" float   NOT NULL,
    CONSTRAINT "pk_tickets" PRIMARY KEY (
        "id"
     )
);

CREATE TABLE "payments" (
    "id" VARCHAR(255)   NOT NULL,
    "ticket_id" VARCHAR(255)   NOT NULL,
    "amount" float   NOT NULL,
    -- Can be DEBIT_CARD, CREDIT_CARD or MOBILE_WALLET
    "method" PAYMENT_METHODS   NOT NULL,
    -- Can be PENDING, CONFIRMED
    "status" STATUS  NOT NULL,
    "qr_code" VARCHAR(255)   NOT NULL,
    "created_at" timestamp   NOT NULL,
    CONSTRAINT "pk_payments" PRIMARY KEY (
        "id"
     ),
    CONSTRAINT "uc_payments_qr_code" UNIQUE (
        "qr_code"
    )
);

CREATE TABLE "notifications" (
    "id" VARCHAR(255)   NOT NULL,
    "user_id" VARCHAR(255)   NOT NULL,
    "message" VARCHAR(150)   NOT NULL,
    "type" VARCHAR(65)   NOT NULL,
    "sent_at" timestamp   NOT NULL,
    CONSTRAINT "pk_notifications" PRIMARY KEY (
        "id"
     )
);

-- Table that saves blog posts information about an event
CREATE TABLE "posts" (
    "id" VARCHAR(255)   NOT NULL,
    "author_id" VARCHAR(255)   NOT NULL,
    "title" VARCHAR(150)   NOT NULL,
    "content" TEXT   NOT NULL,
    "location" VARCHAR(190)   NOT NULL,
    -- Image of the blog post to display on Search Engines
    "featured_image" VARCHAR(255)   NOT NULL,
    "published_at" timestamp   NOT NULL,
    CONSTRAINT "pk_posts" PRIMARY KEY (
        "id"
     )
);

-- Table that saves tags for blog posts
CREATE TABLE "tags" (
    "id" VARCHAR(255)   NOT NULL,
    "content" VARCHAR(150)   NOT NULL,
    "post_id" VARCHAR(255)   NOT NULL,
    CONSTRAINT "pk_tags" PRIMARY KEY (
        "id"
     )
);

-- Table that saves comments for an event or for a blog post
CREATE TABLE "comments" (
    "id" VARCHAR(255)   NOT NULL,
    "user_id" VARCHAR(255)   NOT NULL,
    "title" VARCHAR(150)   NOT NULL,
    "content" VARCHAR(255)   NOT NULL,
    "commented_at" timestamp   NOT NULL,
    CONSTRAINT "pk_comments" PRIMARY KEY (
        "id"
     )
);

-- Table that saves comments for an event
CREATE TABLE "event_comments" (
    "event_id" VARCHAR(255)   NOT NULL,
    "comment_id" VARCHAR(255)   NOT NULL,
    CONSTRAINT "pk_event_comments" PRIMARY KEY (
        "event_id","comment_id"
     )
);

-- Table that saves comments for a blog post
CREATE TABLE "post_comments" (
    "post_id" VARCHAR(255)   NOT NULL,
    "comment_id" VARCHAR(255)   NOT NULL,
    CONSTRAINT "pk_post_comments" PRIMARY KEY (
        "post_id","comment_id"
     )
);

ALTER TABLE "events" ADD CONSTRAINT "fk_events_organizer_id" FOREIGN KEY("organizer_id")
REFERENCES "users" ("id");

ALTER TABLE "tickets" ADD CONSTRAINT "fk_tickets_event_id" FOREIGN KEY("event_id")
REFERENCES "events" ("id");

ALTER TABLE "payments" ADD CONSTRAINT "fk_payments_ticket_id" FOREIGN KEY("ticket_id")
REFERENCES "tickets" ("id");

ALTER TABLE "notifications" ADD CONSTRAINT "fk_notifications_user_id" FOREIGN KEY("user_id")
REFERENCES "users" ("id");

ALTER TABLE "posts" ADD CONSTRAINT "fk_posts_author_id" FOREIGN KEY("author_id")
REFERENCES "users" ("id");

ALTER TABLE "tags" ADD CONSTRAINT "fk_tags_post_id" FOREIGN KEY("post_id")
REFERENCES "posts" ("id");

ALTER TABLE "comments" ADD CONSTRAINT "fk_comments_user_id" FOREIGN KEY("user_id")
REFERENCES "users" ("id");

ALTER TABLE "event_comments" ADD CONSTRAINT "fk_event_comments_event_id" FOREIGN KEY("event_id")
REFERENCES "events" ("id");

ALTER TABLE "event_comments" ADD CONSTRAINT "fk_event_comments_comment_id" FOREIGN KEY("comment_id")
REFERENCES "comments" ("id");

ALTER TABLE "post_comments" ADD CONSTRAINT "fk_post_comments_post_id" FOREIGN KEY("post_id")
REFERENCES "posts" ("id");

ALTER TABLE "post_comments" ADD CONSTRAINT "fk_post_comments_comment_id" FOREIGN KEY("comment_id")
REFERENCES "comments" ("id");

