<div align="center">
  <h1>Buy My Stuff</h1>
  <strong>Basic e-commerce web app built to test full-stack engineering fundamentals using the PERN stack (Postgres + Express + React + Bun)</strong><br>
</div>
<br>

## What is Buy My Stuff??
Buy My Stuff is an e-commerce web app I built during the Codecademy Full-Stack Engineer course. Unlike other projects in the course, this one consists entirely of code I personally wrote (with help from stackoverflow and other sites, of course). Codecademy simply provided the prompt - "build an e-commerce web app using a RESTful API" - and a very general project outline. The purpose of the site is to test and showcase my capabilities as a full-stack engineer. However, it can easily be implemented as the backbone of a production e-commerce web app.

**Note**: This application has been migrated for improved performance and developer experience:
- Runtime: Node.js → **Bun**
- Bundler: Webpack → **Vite**
- Backend Framework: Express → **Elysia.js** (while maintaining full API compatibility)

## Setup
Please follow these steps to set up the app locally.
<br>1. Clone the repo locally or download all files from the Buy My Stuff repository on github.
<br> ![Download Repository](./readme_images/download.png)
<br>
<br>2. Make sure your local [Postgres](https://www.postgresql.org/) server is running.
<br> ![Run Postres](./readme_images/postgres.png)
<br>
<br>3. Open your favorite Postgres client and create a new database for your e-commerce app. Import bms.sql from the db folder of the BMS repository.
<br> ![Set Up Client](./readme_images/client.png)
<br>
<br>4. Open the BMS main folder in your favorite code editor and create a .env file with the following format: 
<br>DB_USER=YOUR DATABASE USERNAME
<br>DB_PASSWORD=YOUR DATABASE PASSWORD
<br>DB_HOST=localhost (make sure this matches your database)
<br>DB_POST=5432 (make sure this matches your database)
<br>DB_DATABASE=YOUR DATABASE NAME
<br>PORT=4000
<br>TOKEN_SECRET=ANYTHING
<br>STRIPE_KEY=YOUR STRIPE KEY(see step 5)
<br> ![Set Up .env](./readme_images/env.png)
<br>
<br>5. Create a Stripe account and add the <strong>publishable</strong> test key to your .env file. To locate, simply navigate to "API Keys" in the "Developers" tab. Then <strong>switch to test mode</strong>. Lastly, copy the test key and paste it to your .env file.
<br> ![Connect Stripe](./readme_images/stripe.png)
<br>
<br>6. Make sure [Bun](https://bun.sh) is installed. To install Bun:
```bash
curl -fsSL https://bun.sh/install | bash
```
<br>
<br>7. Navigate to the BMS directory in your terminal and run `bun install` to install all dependencies from package.json.
```bash
cd buymystuff
bun install
```
<br>
<br>8. Run the back-end locally with Bun:
```bash
bun start
# Or for production mode: bun start:prod
```
<br>
<br>9. Open a new terminal window or tab and navigate to the view folder of the BMS repository. Install dependencies (`bun install` again) and run the front-end locally with Vite:
```bash
cd view
bun install
bun start
```
<br>
<br>10. And that's it! You should now see the Buy My Stuff e-commerce app open in your browser at localhost:3000.
<br> ![Enjoy!](./readme_images/bms.png)

### Requirements
The following packages and programs are required for the app to work:
- **PostgreSQL** - download from the Postgres site [here](https://www.postgresql.org/)
- **Bun v1.0+** - download from [bun.sh](https://bun.sh) or install via:
  ```bash
  curl -fsSL https://bun.sh/install | bash
  ```

Remember to install all package.json dependencies with `bun install` in both the main folder and the view folder (See steps 7-9 in Setup).

### Technology Stack
- **Runtime**: Bun (migrated from Node.js)
- **Backend**: Elysia.js + TypeScript + PostgreSQL (migrated from Express)
- **Frontend**: React + TypeScript
- **Bundler**: Vite (migrated from Webpack/react-scripts)

### Available Scripts

#### Backend (Root Directory)
- `bun start` - Start the development server with hot reload
- `bun build` - Build TypeScript to JavaScript
- `bun start:prod` - Run the production build

#### Frontend (view/ Directory)
- `bun start` - Start the Vite development server (port 3000)
- `bun build` - Build the production bundle
- `bun preview` - Preview the production build

## Migration to Elysia.js

The backend has been migrated from Express to Elysia.js, a modern web framework optimized for Bun. This migration provides:

### Benefits
- **Better Performance**: Elysia is built specifically for Bun's runtime, providing faster request handling
- **Type Safety**: Enhanced TypeScript support with automatic type inference
- **Modern API**: Cleaner, more intuitive routing and middleware system
- **Full Compatibility**: All existing API endpoints work identically - same paths, methods, request/response formats

### What Changed
- Framework: Express → Elysia.js
- Route handlers in `routes/` directory migrated to Elysia
- Middleware updated to use Elysia plugins: `@elysiajs/cors`, `@elysiajs/cookie`, `@elysiajs/jwt`
- Session management reimplemented with in-memory store maintaining same behavior

### What Stayed the Same
- All API endpoints (paths, methods, request/response formats)
- PostgreSQL database and queries
- Frontend code (React + Vite)
- Environment variables
- Authentication flow (JWT tokens)
- Stripe payment integration
- All business logic and validation rules

### API Compatibility
The REST API is 100% backward compatible. No changes are needed in:
- Frontend API calls
- Request payloads
- Response formats
- Status codes
- Error messages

## Additional Notes

If you have any questions/concerns or just want to discuss the app, please reach out anytime: bmitchum.dev@gmail.com.
