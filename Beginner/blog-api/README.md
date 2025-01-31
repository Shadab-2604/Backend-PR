# Blog API

## Setup
1. Clone this repository
2. Run `npm install`
3. Add your MongoDB connection string in `.env`
4. Start the server:
   ```sh
   npm run dev
   ```

## API Endpoints
- **Create Blog Post:** `POST /api/posts`
- **Get All Posts:** `GET /api/posts`
- **Get Post by ID:** `GET /api/posts/:id`
- **Update Post:** `PUT /api/posts/:id`
- **Delete Post:** `DELETE /api/posts/:id`
- **Search Posts:** `GET /api/posts?term=tech`
