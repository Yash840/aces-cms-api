import mongoose from "mongoose";
import Member from "../model/member.js";
import { generateUniqueId } from "../utils/UniqueIdGenerator.js";
import { dissolveOnboardingIdForMember, getAssociatedMemberId, getOnboardingUrl } from "./onboardingIdManager.js";
import { sendMail } from "../utils/mailSender.js";
import { hashPassword, validatePassword } from "../utils/passwordManager.js";

const authorisedTeams = ['team_web', 'team_technical', 'team_leaders', 'team_admin']

export const getAllMembers = async (req, res) => {
  try {
    const members = await Member.find({isHidden: false}).sort('level');
    return res.status(200).json({
      path: req.url,
      timestamp: new Date(),
      success: true,
      message: "Members fetched successfully",
      data: members.map((member) => {
        return {
          name: member.name,
          memberId: member.memberId,
          email: member.email,
          team: member.team,
          role: member.role,
          img: member.photoURL,
          instagram: member.instagramLink,
          linkedin: member.linkedinLink
        }
      })
    });
  } catch (error) {
    return res.status(500).json({
      path: req.url,
      timestamp: new Date(),
      success: false,
      message: error.message,
      data: null
    });
  }
};

export const getMemberById = async (req, res) => {
  try {
    const memberId = req.params.id;

    const member = await Member.findOne({memberId, isHidden: false});
    
    if (!member) {
      return res.status(404).json({
        path: req.url,
        timestamp: new Date(),
        success: false,
        message: "Member not found",
        data: null
      });
    }

    return res.status(200).json({
      path: req.url,
      timestamp: new Date(),
      success: true,
      message: "Member fetched successfully",
      data: {
          name: member.name,
          memberId: member.memberId,
          email: member.email,
          team: member.team,
          role: member.role,
          img: member.photoURL,
          instagram: member.instagramLink,
          linkedin: member.linkedinLink
        }
      });
  } catch (error) {
    return res.status(500).json({
      path: req.url,
      timestamp: new Date(),
      success: false,
      message: error.message,
      data: null
    });
  }
};

const getLevelForRole = (role) => {
  if(role === "team_head") return 1;
  if(role === "member") return 2;

  return 0;
}

export const getUserProfile = async (email, plainPassword) => {
  try {
    const member = await Member.findOne({email});
    let isValidPassword = await validatePassword(member.password, plainPassword);

    let isActive = member.active;

    if(isValidPassword && isActive){
      return {
        name: member.name,
          memberId: member.memberId,
          img: member.photoURL,
          email: member.email,
          team: member.team,
          role: member.role
        }
    }

    return null
  } catch (error) {
    throw new Error(error.message)
  }
}

export const registerNewMember = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    if(!authorisedTeams.includes(req.member.team)){
      return res.status(401).json({
      path: req.url,
      timestamp: new Date(),
      success: false,
      message: "unauthorized request",
      data: null
    });
    }

    session.startTransaction();
    const doesMemberExist = await Member.exists({email: req.body.email});

    if(doesMemberExist){
      throw new Error("member with email already exists");
    }

    const member = new Member(req.body);
    const memberId = generateUniqueId({prefix: "ACES", alphanumeric: false})
    member.memberId = memberId;
    member.level = getLevelForRole(member.role)
    await member.save({session});

    const onboardingUrl = await getOnboardingUrl(memberId, session)
    await sendMail({
      to: member.email,
      subject: "ACES Onboarding Link",
      text: onboardingUrl
    })

    await session.commitTransaction();

    const memberData = {
      name: member.name,
      email: member.email,
      memberId: member.memberId,
      img: member.photoURL,
      instagram: member.instagramLink,
      linkedin: member.linkedinLink,
      team: member.team,
      role: member.role
    }
    return res.status(201).json({
      path: req.url,
      timestamp: new Date(),
      success: true,
      message: "Member registered successfully",
      data: memberData
    });
  } catch (error) {
    await session.abortTransaction();
    return res.status(400).json({
      path: req.url,
      timestamp: new Date(),
      success: false,
      message: error.message,
      data: null
    });
  } finally{
    await session.endSession();
  }
};

export const getOnboardingMemberProfile = async (req, res) => {
  try {
    const memberId = (await getAssociatedMemberId(req.query.onb)).associatedMemberId;
    const member = await Member.findOne({memberId, isHidden: false});

    console.log(memberId)
    console.log(member)
    
    if (!member) {
      return res.status(404).json({
        path: req.url,
        timestamp: new Date(),
        success: false,
        message: "Member not found",
        data: null
      });
    }

    return res.status(200).json({
      path: req.url,
      timestamp: new Date(),
      success: true,
      message: "Member fetched successfully",
      data: {
          name: member.name,
          memberId: member.memberId,
          email: member.email,
          team: member.team,
          role: member.role
        }
      });
  } catch (error) {
    return res.status(500).json({
      path: req.url,
      timestamp: new Date(),
      success: false,
      message: error.message,
      data: null
    });
  }
}

export const onboardNewMember = async (req, res) => {
  const session = await mongoose.startSession()
  try {
    session.startTransaction()
    const {memberId, password} = req.body;
    const member = await Member.findOne({memberId}).session(session).exec();

    if(member === null){
      throw new Error("onboardNewMember: member does not exist");
    }

    member.password = await hashPassword(password);
    member.active = true;

    await member.save({session});
    await dissolveOnboardingIdForMember(memberId, session);

    await session.commitTransaction();

    return res.status(200).json({
      path: req.url,
      timestamp: new Date(),
      success: true,
      message: "Member Onboarded successfully",
      data: member.email
    });
  } catch (error) {
    await session.abortTransaction();
    return res.status(400).json({
      path: req.url,
      timestamp: new Date(),
      success: false,
      message: error.message,
      data: null
    });
  } finally{
    await session.endSession();
  }
}

export const deleteMember = async (req, res) => {
  try {
    if(!authorisedTeams.includes(req.member.team)){
      return res.status(401).json({
      path: req.url,
      timestamp: new Date(),
      success: false,
      message: "unauthorized request",
      data: null
    });
    }
    const deleted = await Member.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({
        path: req.url,
        timestamp: new Date(),
        success: false,
        message: "Member not found",
        data: null
      });
    }
    return res.status(200).json({
      path: req.url,
      timestamp: new Date(),
      success: true,
      message: "Member deleted successfully",
      data: null
    });
  } catch (error) {
    return res.status(500).json({
      path: req.url,
      timestamp: new Date(),
      success: false,
      message: error.message,
      data: null
    });
  }
};

export const updateMember = async (req, res) => {
  try {
    if(!authorisedTeams.includes(req.member.team)){
      return res.status(401).json({
      path: req.url,
      timestamp: new Date(),
      success: false,
      message: "unauthorized request",
      data: null
    });
    }

    const member = await Member.findOne({memberId: req.params.id}).exec();
    const {name, linkedin, instagram, photoURL, team, role} = req.body;

    if (!member) {
      return res.status(404).json({
        path: req.url,
        timestamp: new Date(),
        success: false,
        message: "Member not found",
        data: null
      });
    }

    if(name !== null && name !== undefined){member.name = name}
    if(linkedin !== null && linkedin !== undefined){member.linkedinLink = linkedin}
    if(instagram !== null && instagram !== undefined){member.instagramLink = instagram}
    if(photoURL !== null && photoURL !== undefined){member.photoURL = photoURL}
    if(team !== null && team !== undefined){member.team = team}
    if(role !== null && role !== undefined){member.role = role}

    await member.save();

    return res.status(200).json({
      path: req.url,
      timestamp: new Date(),
      success: true,
      message: "Member updated successfully",
      data: {
        name: member.name,
        email: member.email,
        memberId: member.memberId,
        img: member.photoURL,
        instagram: member.instagramLink,
        linkedin: member.linkedinLink,
        team: member.team,
        role: member.role
      }
    });
  } catch (error) {
    return res.status(400).json({
      path: req.url,
      timestamp: new Date(),
      success: false,
      message: error.message,
      data: null
    });
  }
};

export const getMembersInPublicDataFormat = async (req, res) => {
  try {
    const members = await Member.find();
    const membersData = []

    members.forEach((member) => {
      const {name, email, photoURL, instagramLink, linkedinLink, team} = member

      const properTeam = membersData.find(t => t.name === team);
      if(properTeam){
        properTeam.members.push({
          name,
          email,
          instagram: instagramLink,
          linkedin: linkedinLink,
          image: photoURL
        })
      }else{
        membersData.push({
          name: team,
          members: [
            {
          name,
          email,
          instagram: instagramLink,
          linkedin: linkedinLink,
          image: photoURL
        }
          ]
        })
      }
    })

    return res.status(200).json({
      path: req.url,
      timestamp: new Date(),
      success: true,
      message: "Members fetched successfully",
      data: membersData
    });

  } catch (error) {
    return res.status(500).json({
      path: req.url,
      timestamp: new Date(),
      success: false,
      message: error.message,
      data: null
    });
  }
}

const reshapeData = (teams) => {
  const seeds = []
  teams.forEach((t) => {
    t.members.forEach((m) => {
      seeds.push(
        {
          name: m.name,
          team: t.name,
          email: m.email,
          role: "Member",
          photoURL: m.image,
          instagramLink: m.instagram,
          linkedinLink: m.linkedin
        }
      )
    })
  })

  return seeds
}

export const membersDataSeeder = async (teams) => {
  try {
    const seeds = reshapeData(teams)
    await Promise.all(
      seeds.map(async (s) => {
        const newMember = { ...s, memberId: generateUniqueId({ prefix: "ACES", alphanumeric: false }) };
        return Member.create(newMember);
      })
    );
  } catch (error) {
    console.log(error.message)
  }
}