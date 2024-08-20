# Multi User Chat App

## Project Description
A chat app built using ReactJS, Tailwind CSS, NodeJs, ExpressJs, Socket.IO, and PostgreSQL.

## Installation Instructions

### Frontend
1. Navigate to the client directory:
    ```sh
    cd client
    ```
2. Install the dependencies:
    ```sh
    npm install
    ```
3. Run the development server:
    ```sh
    npm run dev
    ```

### Backend
1. Create a `.env` file in the root directory and add the following:
    ```properties
    PG_USER=chat
    PG_DATABASE=chatapp
    PG_PASSWORD=password
    PG_HOST=localhost
    PG_PORT=5432
    JWT_SECRET=mysecret
    ```
2. Install the dependencies:
    ```sh
    npm install
    ```

### Database Setup
1. Pull the Docker image for PostgreSQL:
    ```sh
    docker pull postgres
    ```
2. Run the Docker container:
    ```sh
    docker run --name some-postgres -e POSTGRES_USER=root -e POSTGRES_PASSWORD=mysecretpassword -d postgres
    ```
3. Login to the PostgreSQL CLI:
    ```sh
    psql -U root -h localhost
    ```
4. Create a new user and database:
    ```sql
    CREATE USER chatapp WITH PASSWORD 'password';
    CREATE DATABASE chatapp;
    ```
5. Create the necessary tables:
    ```sql
    CREATE TABLE users (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL
    );

    CREATE TABLE messages (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        conversation_id UUID NOT NULL REFERENCES conversations(id),
        sender_id UUID NOT NULL REFERENCES users(id),
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE conversations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        sender_id UUID NOT NULL REFERENCES users(id),
        receiver_id UUID NOT NULL REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    ```
6. Grant privileges to the `chatapp` user:
    ```sql
    GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO chatapp;
    ```

### Running the Backend
1. Move to server directory
    ```sh
    cd server
    ```
2. Start the backend server:
    ```sh
    npm start
    ```

## Usage Instructions
- Open your browser and go to `http://localhost:5173` to access the website.

## Contribution Guidelines
- Fork the repository
- Create a new branch (`git checkout -b feature-branch`)
- Commit your changes (`git commit -m 'Add some feature'`)
- Push to the branch (`git push origin feature-branch`)
- Open a pull request

## License
This project is licensed under the MIT License.