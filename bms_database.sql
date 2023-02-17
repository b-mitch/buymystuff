CREATE TABLE "orders" (
  "id" serial PRIMARY KEY,
  "user_id" int,
  "date" date NOT NULL
);

CREATE TABLE "users" (
  "id" serial PRIMARY KEY,
  "first_name" varchar(100) NOT NULL,
  "last_name" varchar(100) NOT NULL,
  "email" varchar(100) UNIQUE NOT NULL,
  "username" varchar(100) NOT NULL,
  "password" varchar(100) NOT NULL
);

CREATE TABLE "products" (
  "id" serial PRIMARY KEY,
  "name" varchar(100) NOT NULL,
  "category" varchar(100) NOT NULL,
  "price" money NOT NULL,
  "inventory" int NOT NULL
);

CREATE TABLE "carts" (
  "id" serial PRIMARY KEY,
  "user_id" int
);

ALTER TABLE "orders" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "carts" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

CREATE TABLE "products_orders" (
  "product_id" int,
  "order_id" int,
  "amount" int,
  PRIMARY KEY ("product_id", "order_id")
);

ALTER TABLE "products_orders" ADD FOREIGN KEY ("product_id") REFERENCES "products" ("id");

ALTER TABLE "products_orders" ADD FOREIGN KEY ("order_id") REFERENCES "orders" ("id");


CREATE TABLE "products_carts" (
  "product_id" int,
  "cart_id" int,
  "amount" int,
  PRIMARY KEY ("product_id", "cart_id")
);

ALTER TABLE "products_carts" ADD FOREIGN KEY ("product_id") REFERENCES "products" ("id");

ALTER TABLE "products_carts" ADD FOREIGN KEY ("cart_id") REFERENCES "carts" ("id");

