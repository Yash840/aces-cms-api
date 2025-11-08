import { getUserProfile } from "./memberHandler.js";
import jwt from 'jsonwebtoken';

export const loginMember = async (req, res) => {
  try {
    const {email, password} = req.body;

    const memberProfile = await getUserProfile(email, password);

    console.log(memberProfile)

    if(memberProfile === null){
      return res.status(400).json({
      path: req.url,
      timestamp: new Date(),
      success: true,
      message: "invalid email or password",
      data: null
    });
    }

    const authPayload = {
      member_email: email,
      member_id: memberProfile.memberId,
      member_team: memberProfile.team,
      member_role: memberProfile.role
    }

    const authToken = jwt.sign(authPayload, process.env.JWT_SECRET, {expiresIn: '24h'});

    res.cookie("authToken", authToken, {
      maxAge: 1000 * 60 * 60 * 24, // 24h
      secure: process.env.NODE_ENV === 'production', 
      httpOnly: true,
      sameSite: 'lax'
    });

    return res.status(200).json({
      path: req.url,
      timestamp: new Date(),
      success: true,
      message: "login successful",
      data: memberProfile
    });
  } catch (error) {
    return res.status(500).json({
      path: req.url,
      timestamp: new Date(),
      success: true,
      message: error.message,
      data: null
    });
  }
}