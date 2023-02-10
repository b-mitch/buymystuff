CREATE TABLE "orders" (
  "id" int PRIMARY KEY,
  "user_id" int,
  "date" date NOT NULL
);

CREATE TABLE "users" (
  "id" int PRIMARY KEY,
  "first_name" varchar(100) NOT NULL,
  "last_name" varchar(100) NOT NULL,
  "username" varchar(20) NOT NULL,
  "email" varchar(20) UNIQUE NOT NULL
);

CREATE TABLE "products" (
  "id" int PRIMARY KEY,
  "name" varchar(100) NOT NULL,
  "category" varchar(100) NOT NULL,
  "price" money NOT NULL,
  "inventory" int NOT NULL
);

CREATE TABLE "carts" (
  "id" int PRIMARY KEY,
  "user_id" int
);

ALTER TABLE "orders" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "carts" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

CREATE TABLE "products_orders" (
  "products_id" int,
  "orders_id" int,
  PRIMARY KEY ("products_id", "orders_id")
);

ALTER TABLE "products_orders" ADD FOREIGN KEY ("products_id") REFERENCES "products" ("id");

ALTER TABLE "products_orders" ADD FOREIGN KEY ("orders_id") REFERENCES "orders" ("id");


CREATE TABLE "products_carts" (
  "products_id" int,
  "carts_id" int,
  PRIMARY KEY ("products_id", "carts_id")
);

ALTER TABLE "products_carts" ADD FOREIGN KEY ("products_id") REFERENCES "products" ("id");

ALTER TABLE "products_carts" ADD FOREIGN KEY ("carts_id") REFERENCES "carts" ("id");

