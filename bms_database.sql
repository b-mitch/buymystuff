
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
  "id" integer PRIMARY KEY,
  "name" varchar(100) NOT NULL,
  "category" varchar(100) NOT NULL,
  "price" money NOT NULL,
  "inventory" int NOT NULL
);

CREATE TABLE "orders" (
  "user_id" int references users (id) NOT NULL,
  "date" date NOT NULL,
  "product_id" int references products(id) NOT NULL,
  "product_price" money NOT NULL,
  "product_amount" int NOT NULL
);

CREATE TABLE "carts" (
  "user_id" int references users (id) NOT NULL,
  "product_id" int references products(id) NOT NULL,
  "product_price" money NOT NULL,
  "product_amount" int NOT NULL
);
