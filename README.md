```markdown
# Kafka Todo App with NestJS

This is a NestJS-based Todo application that integrates Kafka for event-driven communication. It includes authentication, task management, and notification features. The application uses MongoDB for data storage and Kafka for handling events.

---

## Table of Contents
1. [Project Structure](#project-structure)
2. [Prerequisites](#prerequisites)
3. [Setup and Running the Project](#setup-and-running-the-project)
4. [APIs](#apis)
5. [Kafka Topics](#kafka-topics)
6. [Environment Variables](#environment-variables)
7. [Authentication and Authorization](#authentication-and-authorization)
8. [Global Pipes and Guards](#global-pipes-and-guards)
9. [Swagger Documentatiion](#swagger-documentation)

---

## Project Structure

```
kafka-todo-app/
├── dist/                          # Compiled files
├── node_modules/                  # Node.js dependencies
├── src/                           # Source code
│   ├── auth/                      # Authentication module
│   │   ├── dto/                   # Data Transfer Objects
│   │   │   ├── sign-in.dto.ts     # Sign-in DTO
│   │   │   └── sign-up.dto.ts     # Sign-up DTO
│   │   ├── auth.controller.ts     # Authentication controller
│   │   ├── auth.module.ts         # Authentication module
│   │   └── auth.service.ts        # Authentication service
│   ├── decorators/                # Custom decorators
│   │   └── custom.decorator.ts    # Custom decorator
│   ├── kafka/                     # Kafka module
│   │   ├── kafka.module.ts        # Kafka module
│   │   └── kafka.service.ts      # Kafka service
│   ├── notifications/             # Notifications module
│   │   ├── schemas/               # Mongoose schemas
│   │   │   └── notification.schema.ts # Notification schema
│   │   ├── notification.controller.ts # Notification controller
│   │   ├── notification.module.ts # Notification module
│   │   └── notification.service.ts # Notification service
│   ├── task/                      # Task module
│   │   ├── dto/                   # Data Transfer Objects
│   │   │   ├── create-task.dto.ts # Create task DTO
│   │   │   └── update-task.dto.ts # Update task DTO
│   │   ├── schemas/               # Mongoose schemas
│   │   │   └── task.schema.ts     # Task schema
│   │   ├── task.controller.ts     # Task controller
│   │   ├── task.module.ts         # Task module
│   │   └── task.service.ts        # Task service
│   ├── user/                      # User module
│   │   ├── dto/                   # Data Transfer Objects
│   │   │   └── create-user.dto.ts # Create user DTO
│   │   ├── schemas/               # Mongoose schemas
│   │   │   └── user.schema.ts     # User schema
│   │   ├── user.module.ts         # User module
│   │   └── user.service.ts       # User service
│   ├── utils/                     # Utility files
│   │   ├── app.controller.ts      # Application controller
│   │   ├── app.module.ts         # Application module
│   │   ├── app.service.ts        # Application service
│   │   ├── auth.guard.ts         # Authentication guard
│   │   ├── http-exception.filter.ts # HTTP exception filter
│   │   └── main.ts               # Application entry point
├── .dockerignore                  # Docker ignore file
├── .env                           # Environment variables
├── .gitignore                     # Git ignore file
├── .prettierrc                    # Prettier configuration
├── docker-compose.yml             # Docker Compose file
├── eslint.config.mjs              # ESLint configuration
├── nest-cli.json                  # NestJS CLI configuration
├── package-lock.json              # Node.js dependencies lock file
├── package.json                   # Node.js dependencies
├── README.md                      # Project documentation
├── tsconfig.build.json            # TypeScript build configuration
└── tsconfig.json                  # TypeScript configuration
```

---

## Prerequisites

Before running the project, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [NestJS CLI](https://docs.nestjs.com/cli/overview) (`npm i -g @nestjs/cli`)
- [MongoDB](https://www.mongodb.com/try/download/community) (running locally or remotely)
- [Docker](https://www.docker.com/) (for running Kafka)

---

## Setup and Running the Project

1. **Clone the Repository**

   ```bash
   git clone https://github.com/mirzaghalib4726/kafka-todo-app.git
   cd kafka-todo-app
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Set Up Environment Variables**

   Create a `.env` file in the root directory and add the following variables:

   ```env
   PORT=
   MONGO_SERVER_LOCAL=
   MONGO_DATABASE_NAME=

   JWTSECRET=
   SALT=

   KAFKA_CLIENT_ID_PRODUCER=
   KAFKA_CLIENT_ID_CONSUMER=
   KAFKA_BROKER=
   KAFKA_TOPIC=

   ```

4. **Run Kafka and MongoDB**

   - Start Kafka and Zookeeper using Docker:

     ```bash
     docker-compose up -d
     ```

   - Ensure MongoDB is running locally or remotely.

5. **Run the Application**

   ```bash
   npm run start:dev
   ```

   The application will start on `http://localhost:3000`.

---

## APIs

### Authentication APIs

- **Sign Up**
  - **Endpoint**: `POST /auth/sign-up`
  - **Description**: Registers a new user.
  - **Example Request**:
    ```bash
    curl -X POST http://localhost:3000/auth/sign-up \
    -H "Content-Type: application/json" \
    -d '{
      "username": "user123",
      "password": "password123"
    }'
    ```

- **Sign In**
  - **Endpoint**: `POST /auth/sign-in`
  - **Description**: Logs in a user and returns a JWT token.
  - **Example Request**:
    ```bash
    curl -X POST http://localhost:3000/auth/sign-in \
    -H "Content-Type: application/json" \
    -d '{
      "username": "user123",
      "password": "password123"
    }'
    ```

### Task APIs

- **Create Task**
  - **Endpoint**: `POST /tasks`
  - **Description**: Creates a new task.
  - **Example Request**:
    ```bash
    curl -X POST http://localhost:3000/tasks \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer <JWT_TOKEN>" \
    -d '{
      "title": "New Task",
      "description": "Complete the project by Friday"
    }'
    ```

- **Update Task**
  - **Endpoint**: `PATCH /tasks/:id`
  - **Description**: Updates an existing task.
  - **Example Request**:
    ```bash
    curl -X PATCH http://localhost:3000/tasks/64f8e4b8e4b8e4b8e4b8e4b8 \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer <JWT_TOKEN>" \
    -d '{
      "title": "Updated Task"
    }'
    ```

### Notification APIs

- **Get Unread Notifications**
  - **Endpoint**: `GET /notifications/unread`
  - **Description**: Fetches all unread notifications for the authenticated user and marks them as read.
  - **Example Request**:
    ```bash
    curl -X GET http://localhost:3000/notifications/unread \
    -H "Authorization: Bearer <JWT_TOKEN>"
    ```

---

## Kafka Topics

- **Topic Name**: `task-events`
  - **Description**: Used to publish and consume task-related events.
  - **Producer**: `KafkaService` (publishes events to this topic).
  - **Consumer**: `NotificationService` (consumes events from this topic).

---

## Environment Variables

| Variable                | Description                          | Default Value       |
|-------------------------|--------------------------------------|---------------------|
| `PORT`                  | Server Port                          |---------------------|
| `MONGO_SERVER_LOCAL`    | MongoDB connection URI               |---------------------|
| `MONGO_DATABASE_NAME`   | Database name                        |---------------------|
| `JWTSECRET`             | Jwt Secret                           |---------------------|
| `SALT`                  | Salt bcrypt                          |---------------------|
| `KAFKA_BROKER`          | Kafka broker address                 |---------------------|
| `KAFKA_CLIENT_ID_PRODUCER` | Kafka producer client ID          |---------------------|
| `KAFKA_CLIENT_ID_CONSUMER` | Kafka producer client ID          |---------------------|
| `KAFKA_TOPIC`           | Kafka topic name                     |---------------------|

---

## Authentication and Authorization

The application uses JWT (JSON Web Tokens) for authentication. All endpoints (except `/auth/sign-up` and `/auth/sign-in`) are protected by an `AuthGuard` that checks for a valid Bearer token in the `Authorization` header.

---

## Global Pipes and Guards

- **Global Validation Pipe**: Ensures that all incoming requests are validated against their respective DTOs.
- **Global Auth Guard**: Protects all routes by default, requiring a valid JWT token.

---

## Swagger Documentation

The `swagger documentation` is available at `127.0.0.1:${PORT}/docs`

### Key Features of the README:
1. **Project Overview**: A brief description of the project.
2. **Project Structure**: A clear breakdown of the directory structure.
3. **Setup Instructions**: Step-by-step guide to set up and run the project.
4. **API Documentation**: Detailed descriptions of available APIs.
5. **Kafka Topics**: Information about Kafka topics used in the project.
6. **Environment Variables**: A table listing all required environment variables.
7. **Authentication and Authorization**: Details about JWT-based authentication.
8. **Global Pipes and Guards**: Information about global validation and authentication guards.

This `README.md` provides everything a developer needs to understand, set up, and contribute to your project.
