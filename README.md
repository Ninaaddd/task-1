# Task 1 Backend Server and Authentication API

This repository contains the backend server and authentication API for Task 1 project. It includes user registration, authentication (login/logout), and password management functionalities.

## Technologies Used

- Node.js
- Express.js
- MongoDB
- CryptoJS
- JSON Web Tokens (JWT)
- Nodemailer

## Getting Started

To get a local copy up and running, follow these steps:

### Prerequisites

- Node.js installed
- MongoDB installed or MongoDB Atlas account


### Installation

1. Clone the repository
   ```sh
   git clone https://github.com/Ninaaddd/task-1.git
   cd task-1

2. Install Dependencies
    ```sh
    npm install

3. Set up environment variables
    Create a .env file in the root directory
    Add the following variables:
    - MONGO_URL
    - PASS_SEC
    - JWT_SEC
    - EMAIL
    - EMAIL_PASSWORD

### Usage

1. Start the server
   ```sh
    npm start

2. API Endpoints:

    - Register a new user: POST /api/auth/register
    - Login: POST /api/auth/login
    - Forgot password: POST /api/auth/forgot-password
    - Reset password: POST /api/auth/reset-password/:token
