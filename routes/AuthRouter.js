import { Router } from 'express';
import { loginMember } from '../handlers/authHandler.js';
import { getOnboardingMemberProfile, onboardNewMember } from '../handlers/memberHandler.js';

const authRouter = Router();

authRouter.post('/login',loginMember)
authRouter.post('/onboarding/onboard', onboardNewMember)
authRouter.post('/onboarding/member-profile', getOnboardingMemberProfile)

export default authRouter;