import mongoose from "mongoose";

const memberSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, unique: true},
  memberId: { type: String, required: true, unique: true },
  team: { type: String, trim: true },
  role: {
    type: String,
    required: true,
    enum: ['GS', 'JGS', 'Team Head', 'Member']
  },
  photoURL: { type: String, trim: true },
  instagramLink: { type: String, trim: true },
  linkedinLink: { type: String, trim: true }
}, {
  timestamps: true
});

const Member = mongoose.model("Member", memberSchema);

export default Member;
