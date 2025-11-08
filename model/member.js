import mongoose from "mongoose";

const memberSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, unique: true},
  password: {type: String, trim: true},
  level: {type: Number}, // An integer assigned to member as per role: Team Head: 1, Member: 2. For sorting and returning data in proper order.
  memberId: { type: String, required: true, unique: true },
  team: { type: String, trim: true },
  role: {
    type: String,
    required: true,
    enum: ['role_genereal_secretary', 'role_joint_genereal_secretary', 'role_team_head', 'role_team_member', 'role_admin']
  },
  photoURL: { type: String, trim: true },
  instagramLink: { type: String, trim: true },
  linkedinLink: { type: String, trim: true },
  active: {type: Boolean, default: false, require: true},
  isHidden: {type: Boolean, default: true, require: true}
}, {
  timestamps: true
});

const Member = mongoose.model("Member", memberSchema);

export default Member;
