SmartApproachTest - URL Shortener API

A simple and robust URL Shortener API built using Node.js, Express.js, MongoDB, and TypeScript. The API allows users to shorten long URLs, retrieve the original URLs, track URL analytics, and more.
Table of Contents

    Features
    Project Structure
    Installation & Setup
    API Endpoints
        Shorten a URL
        Retrieve the Original URL
        Get URL Analytics
    Tech Stack
    Deployment
    To-Do / Improvements
    License
    Contact

Features

    URL Shortening: Convert long URLs into unique, short URLs for easier sharing and tracking.
    Redirection: Redirect users to the original long URL when accessing the short URL.
    URL Analytics: Track the number of visits to each short URL.
    Basic URL Validation: Ensure the provided URL is valid and well-formed.
    Error Handling: Provide detailed error messages with appropriate HTTP status codes.
    Rate-Limiting: Protect the API from abuse by limiting excessive requests using rate-limiting.

Project Structure

The project is structured as follows:

url-shortener/
│── src/
│   ├── config/
│   │   ├── db.ts
│   │   ├── env.ts
│   ├── controllers/
│   │   ├── url.controller.ts
│   ├── models/
│   │   ├── url.model.ts
│   ├── routes/
│   │   ├── url.routes.ts
│   ├── services/
│   │   ├── url.service.ts
│   ├── utils/
│   │   ├── generateShortCode.ts
│   │   ├── logger.ts
│   │   ├── httpError.ts
│   ├── middleware/
│   │   ├── rateLimiter.ts
│   ├── app.ts
│   ├── server.ts
│── .env
│── .gitignore
│── package.json
│── tsconfig.json
│── README.md
│── postman_collection.json

Installation & Setup

    Clone the Repository

git clone https://github.com/tunde1256/url-shortener.git
cd url-shortener

    Install Dependencies

npm install

    Setup Environment Variables

Create a .env file in the root directory and add the following environment variables:

PORT=5000
MONGO_URI=mongodb://localhost:27017/urlshortener
BASE_URL=http://localhost:5002

    PORT: The port the server will listen on.
    MONGO_URI: The connection string to MongoDB for storing URLs and analytics.
    BASE_URL: The base URL of the application for generating shortened URLs.

    Run the Application

To start the application, run the following command:

npx ts-node src/server.ts

API Endpoints
1. Shorten a URL

POST /shorten

Request Body:

{
  "longUrl": "https://www.goal.com"
}

Response:

{
  "shortUrl": "http://localhost:5002/ada73f"
}

2. Retrieve the Original URL

GET /:shortCode

Redirects the user to the original long URL associated with the short code.

Example Request:

GET http://localhost:5002/M0Jlc0

Response:

    Redirects to the original long URL: https://example.com/some-long-url

3. Get URL Analytics

GET /analytics/:shortCode

Response:

{
  "shortCode": "abc123",
  "longUrl": "https://goal.com/some-long-url",
  "visitCount": 5
}

Tech Stack

    Node.js: Backend runtime for building fast and scalable applications.
    Express.js: Web framework for handling HTTP requests and routing.
    MongoDB: NoSQL database for storing URLs and analytics data.
    Mongoose: ODM for interacting with MongoDB.
    TypeScript: Static typing for better development experience and fewer runtime errors.
    Winston: Logging library for tracking requests, errors, and server activities.
    express-rate-limit: Middleware for rate-limiting API requests.

Deployment

You can deploy the API on the following platforms:

    Render: Render Deployment Guide
    Railway: Railway Deployment Guide
    Vercel: Vercel Deployment Guide

To-Do / Improvements

    Custom Short URLs: Allow users to choose their custom short URLs (e.g., /short-url).
    User Authentication: Implement authentication for managing URLs and tracking analytics.
    Redis Caching: Cache popular URLs in Redis to reduce the number of database hits.
    Rate Limiting: Prevent abuse by limiting requests per IP.
    URL Validation: Ensure that provided URLs are well-formed and valid.
    Enhanced Analytics: Track additional data like geolocation, device types, and referral sources.

License

This project is licensed under the MIT License. See the LICENSE file for more details.
Contact

For any issues, improvements, or contributions, feel free to:

    Open an issue or submit a pull request on the GitHub repository.
    Reach out via ogunremitunde12@gmail.com.

