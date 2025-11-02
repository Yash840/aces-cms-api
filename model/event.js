import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  eventId: { type: String, unique: true, sparse: true },
  title: { type: String, required: true, trim: true },
  mode: { 
    type: String, 
    required: true,
    enum: ['Online', 'Offline', 'Mixed'] 
  },
  entryFee: { type: Number, default: 0 },
  thumbnailURL: {type : String, default: "", required: true},
  prize: { type: Number, default: 0 },
  registrationLink: { type: String, trim: true },
  shortDescription: { type: String, trim: true },
  description: { type: String, required: true, trim: true },
  eventStartDateTime: { type: Date, required: true },
  eventEndDateTime: { type: Date, required: true },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

eventSchema.virtual('status').get(function () {
  const now = new Date();
  if (now < this.eventStartDateTime) return 'upcoming';
  if (now > this.eventEndDateTime) return 'ended';
  return 'ongoing';
});

eventSchema.virtual('isUpcoming').get(function () {
  return new Date() < this.eventStartDateTime;
});

eventSchema.virtual('isOngoing').get(function () {
  const now = new Date();
  return now >= this.eventStartDateTime && now <= this.eventEndDateTime;
});

eventSchema.virtual('isEnded').get(function () {
  return new Date() > this.eventEndDateTime;
});

const Event = mongoose.model("Event", eventSchema);

export default Event;
