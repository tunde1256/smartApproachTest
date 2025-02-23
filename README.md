URL Shortener API

A simple URL Shortener API built using Node.js, Express.js, MongoDB, and TypeScript. Users can shorten long URLs, retrieve the original URLs, and track analytics.

 Features

Shorten long URLs into unique short URLs.

Redirect users to the original URL.

Track the number of times a short URL has been accessed.

Basic URL validation and error handling.

 Project Structure

url-shortener/
│── src/
│   ├── config/
│   │   ├── db.ts          # Database configuration
│   │   ├── env.ts         # Environment variables setup
│   ├── controllers/
│   │   ├── url.controller.ts  # Business logic for URL shortening & retrieval
│   ├── models/
│   │   ├── url.model.ts   # Mongoose schema for URLs
│   ├── routes/
│   │   ├── url.routes.ts  # API routes
│   ├── utils/
│   │   ├── generateShortCode.ts # Short URL generator
│   ├── app.ts             # Express app configuration
│   ├── server.ts          # Server entry point
│── .env                   # Environment variables
│── .gitignore             # Git ignore file
│── package.json           # Dependencies
│── tsconfig.json          # TypeScript configuration
│── README.md              # Project documentation
│── postman_collection.json # API collection (optional)

 Installation & Setup

Clone the Repository

git clone https://github.com/yourusername/url-shortener.git
cd url-shortener

Install Dependencies

npm install

Setup Environment Variables
Create a .env file in the root directory and add:

PORT=5000
MONGO_URI=mongodb://localhost:27017/urlshortener
BASE_URL=http://localhost:5000

Run the Application

npx ts-node src/server.ts

 API Endpoints

 Shorten a URL

POST /shorten

Request Body:

{
    "longUrl": "https://example.com/some-long-url"
}

Response:

{
    "shortUrl": "http://localhost:5000/abc123"
}

Retrieve the Original URL

GET /:shortCode
Redirects to the original long URL.

3Get URL Analytics

GET /analytics/:shortCode

Response:

{
    "shortCode": "abc123",
    "longUrl": "https://example.com/some-long-url",
    "visitCount": 5
}

Tech Stack

Node.js - Backend runtime

Express.js - Web framework

MongoDB - Database

TypeScript - Type safety

ShortID - Unique URL generation

Deployment

You can deploy the API using Render, Railway, or Vercel.

To-Do / Improvements

Add custom short URLs

Implement user authentication

Optimize with Redis caching

Add Rate limiting

License

This project is licensed under the MIT License.

 Contact

For any issues or contributions, feel free to open an issue or submit a pull request!

