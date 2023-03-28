
CREATE TABLE "users" (
  "id" integer PRIMARY KEY,
  "first_name" varchar(100) NOT NULL,
  "last_name" varchar(100) NOT NULL,
  "email" varchar(100) UNIQUE NOT NULL,
  "username" varchar(100) NOT NULL,
  "password" varchar(100) NOT NULL,
  "address" varchar,
  "city" varchar,
  "state" varchar,
  "zip" varchar
);

CREATE TABLE "carts" (
  "id" varchar PRIMARY KEY,
  "user_id" integer references users (id),
  "product_id" varchar references products(id) NOT NULL,
  "amount" integer NOT NULL
);

CREATE TABLE "products" (
  "id" varchar PRIMARY KEY,
  "name" varchar(100) NOT NULL,
  "category" varchar(100) NOT NULL,
  "price" money NOT NULL,
  "inventory" integer NOT NULL
);

CREATE TABLE "orders" (
  "id" varchar PRIMARY KEY,
  "user_id" integer references users (id),
  "date" date NOT NULL,
  "first_name" varchar,
  "last_name" varchar,
  "email" varchar,
  "address" varchar NOT NULL,
  "city" varchar NOT NULL,
  "state" varchar NOT NULL,
  "zip" varchar NOT NULL
);

CREATE TABLE "products-orders" (
  "order_id" varchar references orders(id) NOT NULL,
  "product_id" varchar references products(id) NOT NULL,
  "amount" integer NOT NULL,
  "price" money NOT NULL,
  PRIMARY KEY ("order_id", "product_id")
);
