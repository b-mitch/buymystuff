
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

CREATE TABLE "products" (
  "id" varchar PRIMARY KEY,
  "name" varchar(100) NOT NULL,
  "category" varchar(100) NOT NULL,
  "price" money NOT NULL,
  "inventory" integer NOT NULL
);

CREATE TABLE "orders" (
  "id" integer PRIMARY KEY,
  "user_id" integer references users (id) NOT NULL,
  "date" date NOT NULL,
  "product_id" varchar references products(id) NOT NULL,
  "product_amount" integer NOT NULL
);

CREATE TABLE "carts" (
  "id" varchar PRIMARY KEY,
  "user_id" integer references users (id) NOT NULL,
  "product_id" varchar references products(id) NOT NULL,
  "product_amount" integer NOT NULL
);
