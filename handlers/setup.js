import Member from "../model/member.js"
import { hashPassword } from "../utils/passwordManager.js"

export const setup = async () => {
  try {
    const doesAdminExist = await Member.exists({email: process.env.ADMIN_EMAIL});

    if(doesAdminExist){
      console.log("Setup already done");
      return
    }

    const adminOptions = {
      name: "admin",
      memberId: 'ADMIN0000',
      password: await hashPassword(process.env.ADMIN_PASS),
      photoURL: "https://img.favpng.com/9/22/15/iron-man-animated-hero-character-digital-portrait-cVHGteLt_t.jpg",
      team: "team_admin",
      role: "role_admin",
      isHidden: false,
      active: true,
      email: process.env.ADMIN_EMAIL
    }

    const admin = await Member.create(adminOptions);

    console.log("Admin Created, Setup Complete")
    console.log("admin", admin)
  } catch (error) {
    console.log(error.message)
  }
}