# Couch Critic

Welcome to Couch Critic! Couch Critic is an innovative platform designed to bring people together for real-time voice conversations. Whether you want to join a public discussion or host a private chat, Couch Critic provides a seamless experience for users to connect and communicate.



## Features

- Public Rooms
Join Public Rooms: Users can join public rooms and engage in real-time voice chats with multiple participants. It's a perfect space for open discussions, debates, or just casual conversations.
conversation.
- Private Rooms
Create Private Rooms: Users have the option to create private rooms for more controlled and intimate discussions.
Invite Others: Private rooms come with the ability to invite other users, ensuring that only selected participants can join the 



![Home Page](https://github.com/Adi-The-Pro/CouchCriticDeployment/assets/98386784/7ea49b45-3883-4076-9771-41458a00cd9a)

![Verification Page](https://github.com/Adi-The-Pro/CouchCriticDeployment/assets/98386784/e909dffb-35c4-4046-9df3-9f17c86a2816)

![Add New Room](https://github.com/Adi-The-Pro/CouchCriticDeployment/assets/98386784/2fb9d5cd-c539-48bc-8bc9-29666b11197b)

![Chatting Page](https://github.com/Adi-The-Pro/CouchCriticDeployment/assets/98386784/6e8992d9-5eb0-4727-b55d-a473d746478c)
## How To Use
- Sign Up / Log In: Create an account or log in to your existing account.
- Browse Rooms: Explore the list of available public rooms and join any conversation that interests you.
- Create Private Rooms: If you prefer a private chat, create your own room and invite others to join.
- Real-Time Voice Chat: Enjoy seamless, real-time voice communication with other users in both public and private rooms.
## Technologies Used
- Frontend : React.js, HTML, CSS, JavaScript
- Backend  : Node.js, Express.js, Socket.IO   
## Run Locally

Step-1: Clone the project

```bash
  git clone https://github.com/Adi-The-Pro/CouchCriticDeployment
  cd CouchCriticDeployment
```

Step 2: Create Your MongoDB Account and Database Cluster
- Create your own MongoDB account by visiting the MongoDB website and signing up for a new account.
- Create a new database or cluster by following the instructions provided in the MongoDB documentation. Remember to note down the "Connect to your application URI" for the database, as you will need it later. Also, make sure to change <password> with your own password
- Add your current IP address to the MongoDB database's IP whitelist to allow connections (this is needed whenever your ip changes)

Step 3: Edit the Environment File
- Check a file named .env in the /backend directory.
- This file will store environment variables for the project to run.

Step 4: Update MongoDB URI
- In the .env file, find the line that reads:
- MONGODB_URI="your-mongodb-uri"
- Replace "your-mongodb-uri" with the actual URI of your MongoDB database.

Step 5: Install Backend And Frontend Dependencies
- In your terminal, navigate to the /backend directory and /myapp directory
```bash
  npm install
```

Step 6: Run the Backend Server
- In the same terminal, run the following command to start the backend server:
```bash
  npm run dev
```

Step 7: Run the Frontend Server
- After installing the frontend dependencies, run the following command in the same terminal to start the frontend server:
```bash
  npm start
```
