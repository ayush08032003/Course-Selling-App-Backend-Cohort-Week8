# Course Selling App Backend

A comprehensive Course Selling App backend built using Node.js, Express, and MongoDB. This application provides user and admin functionalities to manage and purchase courses securely.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
  - [User Routes](#user-routes)
  - [Admin Routes](#admin-routes)
  - [Course Routes](#course-routes)
- [Authentication](#authentication)
- [Database Schema](#database-schema)
- [Contributing](#contributing)
- [Acknowledgements](#acknowledgements)

## Features

- User signup and login functionality.
- Admin capabilities to create, update, and delete courses.
- Users can purchase courses and track their purchases.
- JWT-based authentication for secure access.

## Technologies Used

- **Node.js**: JavaScript runtime for building server-side applications.
- **Express**: Web application framework for Node.js.
- **MongoDB**: NoSQL database for storing user and course data.
- **Mongoose**: ODM library for MongoDB and Node.js.
- **Zod**: Type-safe schema validation library.
- **Bcrypt**: Library for hashing passwords.
- **JSON Web Tokens (JWT)**: For user authentication.

## Getting Started

To get a local copy of this project up and running, follow these steps:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/ayush08032003/Course-Selling-App-Backend-Cohort-Week8.git
   ```

2. **Navigate to the project directory:**

   ```bash
   cd Course-Selling-App-Backend-Cohort-Week8
   ```

3. **Install dependencies:**

   ```bash
   npm install
   ```

4. **Create a `.env` file in the root directory and add your environment variables:**

   ```plaintext
   PORT=3000
   NO_OF_ROUNDS=10
   DATABASE_CONNECTION_URL="mongodb+srv://<username>:<password>@your-cluster.mongodb.net/your-db-name"
   JWT_USER_PASSWORD="Passwor1Sample"
   JWT_ADMIN_PASSWORD="Password2Sample"
   ```

5. **Start the server:**

   ```bash
   npm start
   ```

## Environment Variables

The following environment variables are required:

- `PORT`: The port number the server will listen on.
- `NO_OF_ROUNDS`: The number of rounds for bcrypt password hashing.
- `DATABASE_CONNECTION_URL`: The MongoDB connection string.
- `JWT_USER_PASSWORD`: Secret key for JWT authentication for users.
- `JWT_ADMIN_PASSWORD`: Secret key for JWT authentication for admins.

## Usage

- **User Signup**: `POST /user/signup`
- **User Signin**: `POST /user/signin`
- **View Purchased Courses**: `GET /user/purchase`
- **Admin Signup**: `POST /admin/signup`
- **Admin Signin**: `POST /admin/signin`
- **Create Course**: `POST /admin/course`
- **Update Course**: `PUT /admin/course`
- **Delete Course**: `DELETE /admin/course`
- **Get All Courses**: `GET /course`
- **Purchase Course**: `POST /course/purchase`
- **Preview Course**: `GET /course/preview/:courseId`

## API Endpoints

### User Routes

- **POST `/user/signup`**: Sign up a new user.
- **POST `/user/signin`**: Log in an existing user.
- **GET `/user/purchase`**: Retrieve all purchased courses for the authenticated user.

### Admin Routes

- **POST `/admin/signup`**: Sign up a new admin.
- **POST `/admin/signin`**: Log in an existing admin.
- **POST `/admin/course`**: Create a new course.
- **PUT `/admin/course`**: Update an existing course.
- **DELETE `/admin/course`**: Delete a course.
- **GET `/admin/courses/bulk`**: Retrieve all courses created by the authenticated admin.

### Course Routes

- **GET `/course`**: Get all available courses.
- **POST `/course/purchase`**: Purchase a course.
- **GET `/course/preview/:courseId`**: Get details of a specific course.

## Authentication

This application uses JWT for user and admin authentication. Tokens are issued upon successful login and must be included in the header of requests to protected routes.

## Database Schema

### Users Collection

- **email**: String (required, unique)
- **hashedPassword**: String (required)
- **firstName**: String (required)
- **lastName**: String (optional)

### Admins Collection

- **email**: String (required, unique)
- **hashedPassword**: String (required)
- **firstName**: String (required)
- **lastName**: String (optional)

### Courses Collection

- **title**: String (required, unique)
- **description**: String (optional)
- **price**: Number (required)
- **imageUrl**: String (optional)
- **creatorId**: ObjectId (reference to Admin)

### Purchases Collection

- **courseId**: ObjectId (reference to Course)
- **userId**: ObjectId (reference to User)

## Contributing

Contributions are welcome! Please fork the repository and create a pull request for any improvements.


## Acknowledgements

- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Mongoose](https://mongoosejs.com/)
- [Zod](https://zod.dev/)
- [Bcrypt](https://www.npmjs.com/package/bcrypt)


Feel free to adjust any sections as needed, and ensure that you replace placeholders in the environment variables section with actual values where necessary!