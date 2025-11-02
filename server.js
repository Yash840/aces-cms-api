import express from 'express';
import cookieParser from 'cookie-parser';
import memberRouter from './routes/MemberRouter.js';
import eventRouter from './routes/EventRouter.js';
import { connectDB } from './config/db.js';
import fs from 'fs';
import cors from 'cors'
import { membersDataSeeder } from './handlers/memberHandler.js';

const app = express();

(async () => {
  try {
    await connectDB();

    app.use(cors({
      origin: true, // Allow all origins
      credentials: true, // Allow cookies
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization']
    }));

    app.use(express.json());
    app.use(cookieParser());
    app.use("/api/members", memberRouter);
    app.use("/api/events", eventRouter);

    const uploadDir = 'uploads/';
    
    if(!fs.existsSync(uploadDir)){
      fs.mkdirSync(uploadDir)
    }

    // membersDataSeeder(teams)

    app.listen(3000, () => {
      console.log(`server is listening at http://localhost:3000`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
})();


const teams = [
      {
        name: "Web Team",
        displayName: "Web Team",
        members: [
          {
            name: "Shruti Natekar",
            role: "Head",
            image: "https://github.com/acespvg/ACES-Website-Images/blob/main/ShrutiN_web.jpg?raw=true",
            linkedin: "https://www.linkedin.com/in/shruti-natekar-a013b228a",
            instagram: "https://www.instagram.com/nshruti_n/#",
            email: "22000016@pvgcoet.ac.in"
          },
          {
            name: "Ketaki Kulkarni",
            role: "Joint Head",
            image: "https://cdn.jsdelivr.net/gh/acespvg/ACES-Website-Images@main/Ketaki.jpg",
            linkedin: "https://www.linkedin.com/in/ketaki-kulkarni-786614245/",
            instagram: "https://instagram.com/ketakikulkarni562",
            email: "23010082@pvgcoet.ac.in"
          },
          {
            name: "Aditya Kelkar ",
            role: "Member",
            image: "https://github.com/acespvg/ACES-Website-Images/blob/main/AdityaWEB.jpg?raw=true",
            linkedin: "http://www.linkedin.com/in/aditya-kelkar-5a6643290",
            instagram: "https://instagram.com/_adit.yeah_",
            email: "23120069@pvgcoet.ac.in"
          },
          {
            name: "Mrugesh Patil",
            role: "Member",
            image: "https://github.com/acespvg/ACES-Website-Images/blob/main/MurgeshWEB.jpg?raw=true",
            linkedin: "https://www.linkedin.com/in/mrugesh-patil?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
            instagram: "https://www.instagram.com/patil__mrugesh?igsh=eTh6eDYybzhndzdp",
            email: "24110036@pvgcoet.ac.in"
          },
          {
            name: "Yash Jawale",
            role: "Member",
            image: "https://github.com/acespvg/ACES-Website-Images/blob/main/yash_web_team.png?raw=true",
            linkedin: "https://www.linkedin.com/in/yash-jawale-ba1bb226a?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
            instagram: "https://www.instagram.com/the_yash_jawale?igsh=MXFpcnRtanMxcDByMQ==",
            email: "241100020@pvgcoet.ac.in"
          },
          {
            name: "Rahul Gawade",
            role: "Member",
            image: "https://github.com/acespvg/ACES-Website-Images/blob/main/RahulWEB.jpg?raw=true",
            linkedin: "www.linkedin.com/in/ rahul-gawade-2509b3333",
            instagram: "https://instagram.com/rahul_gawade_04",
            email: "24010015@pvgcoet.ac.in"
          }
        ]
      }
    ]