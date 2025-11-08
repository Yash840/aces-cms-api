import OnboardingCreds from "../model/onboarding.js";
import { generateUniqueId } from "../utils/UniqueIdGenerator.js"

const createOnboardingUrl = (onboardingId) => {
  return `http://localhost:5173/onboarding?onboard=${onboardingId}`;
}

const generateOnboardingId = async (memberId, session = null) => {
  try {
    const onboardingId = generateUniqueId({length: 13, prefix: "onb"});
    const onboardingOptions = {
      onboardingId,
      associatedMemberId: memberId
    };

    if(session){
      await OnboardingCreds.create([onboardingOptions], session);
    }else{
      await OnboardingCreds.create(onboardingOptions);
    }

    return onboardingId
  } catch (error) {
    throw new Error("generateOnboardingId: onboarding id not generated", error.message)
  }
}

export const getOnboardingUrl = async (memberId, session = null) => {
  try {
    const onboardingId = await generateOnboardingId(memberId, session);

    return createOnboardingUrl(onboardingId);
  } catch (error) {
    throw new Error(error.message);
  }
}

export const getAssociatedMemberId = async (onboardingId, session = null) => {
  try {
    let query = OnboardingCreds.findOne({onboardingId}).select("associatedMemberId");


    if(session){
      query = query.session(session);
    }

    const onb = await query.exec();

    return onb
  } catch (error) {
    throw new Error("getAssociatedMemberId: can't retrieve member id", error.message)
  }
}

export const dissolveOnboardingIdForMember = async (memberId, session = null) => {
  try {
    let deleteQuery = OnboardingCreds.deleteOne({ associatedMemberId: memberId });

    if (session) {
      deleteQuery = deleteQuery.session(session);
    }

    const result = await deleteQuery.exec(); // { acknowledged, deletedCount, ... }
    return result;
  } catch (error) {
    throw new Error(`dissolveOnboardingId: can't dissolve onboarding id: ${error.message}`);
  }
}
