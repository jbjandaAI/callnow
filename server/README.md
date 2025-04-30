# CallNow Server

This is the backend server for the CallNow application, built with Node.js, Express, and TypeScript.

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=3001
   NODE_ENV=development
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=callnow
   DB_USER=postgres
   DB_PASSWORD=postgres
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRES_IN=24h
   CLIENT_URL=http://localhost:3000
   ```

4. Create the database:
   ```bash
   createdb callnow
   ```

5. Run database migrations (to be implemented)

## Development

Start the development server:
```bash
npm run dev
```

The server will start on port 3001 by default.

## Available Scripts

- `npm run dev`: Start the development server with hot reload
- `npm run build`: Build the TypeScript code
- `npm start`: Start the production server
- `npm test`: Run tests
- `npm run lint`: Run ESLint
- `npm run format`: Format code with Prettier

## API Documentation

The API documentation will be available at `/api-docs` once implemented.

## Project Structure

```
src/
├── config/         # Configuration files
├── controllers/    # Route controllers
├── middleware/     # Custom middleware
├── models/         # Database models
├── routes/         # API routes
├── services/       # Business logic
└── index.ts        # Application entry point
```

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Run tests and linting
4. Submit a pull request

## License

ISC 