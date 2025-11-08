import { configDotenv } from "dotenv";
import nodemailer from "nodemailer"
configDotenv()

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, 
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
})

export const sendMail = async ({to, subject, text, html=""}) => {
  if(to.length === 0 || subject.length === 0 || text.length === 0){
    throw new Error("sendMail: Unsufficient details to send mail");
  }

  const draft = {
    from: '"ACES, PVG COET", <yashjawle440@gmail.com>',
    to,
    subject,
    text,
    html
  }

  const info = await transporter.sendMail(draft);

  console.log("Message Sent ::", info.messageId);
}