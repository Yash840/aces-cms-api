import mongoose from "mongoose";

const onboardingCredsSchema = new mongoose.Schema({
  onboardingId: {type: String, unique: true, trim: true, require: true},
  associatedMemberId: {type: String, unique: true, trim: true, require: true}
})

const OnboardingCreds = mongoose.model("onboardingCreds", onboardingCredsSchema);

export default OnboardingCreds;