## 🗳 Real-Time Polling Backend
A backend service for a real-time polling application, built with Node.js, Express, Prisma (PostgreSQL), and Socket.IO.
Users can register, create polls, vote on poll options, and see live results updated in real time.

## 🚀 Tech Stack
Backend Framework: Express.js

## 🚀 Tech Stack
- **Database**: PostgreSQL  
- **ORM**: Prisma  
- **Real-time Communication**: Socket.IO  


## 🔧 Setup Instructions
## 1. Clone the Repository
```bash
git clone https://github.com/berohanprabhakar/VotingPoolBackend.git
cd VotingPoolBackend
```

## 2. Change the .env file
```bash
DATABASE_URL="postgresql://<user>:<password>@localhost:5432/pollingdb?schema=public"
PORT=4000
```

## 3. Install Dependencies
```bash
npm install
```

## 4. Setup Database
Run Prisma migrations to create the database schema:

```bash
npx prisma migrate dev --name init
```
Generate Prisma client:
```bash
npx prisma generate
```

## 5. Run the Server
```bash
npm start
```
Server will start at:
👉 http://localhost:4000

Thank you.
(This readme is written with the help of AI but code is **mine**)
