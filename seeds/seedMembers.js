import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import Member from "../model/member.js";
import { generateUniqueId } from "../utils/UniqueIdGenerator.js";

const MEMBERS = [
  {
    name: "Alice Johnson",
    email: "alice.johnson@aces.org",
    team: "Design",
    role: "Team Head",
    photoURL: "",
    instagramLink: "",
    linkedinLink: "https://www.linkedin.com/in/alice-johnson"
  },
  {
    name: "Bob Smith",
    email: "bob.smith@aces.org",
    team: "Engineering",
    role: "GS",
    photoURL: "",
    instagramLink: "",
    linkedinLink: "https://www.linkedin.com/in/bob-smith"
  },
  {
    name: "Carla Reyes",
    email: "carla.reyes@aces.org",
    team: "Product",
    role: "JGS",
    photoURL: "",
    instagramLink: "",
    linkedinLink: "https://www.linkedin.com/in/carla-reyes"
  },
  {
    name: "David Lee",
    email: "david.lee@aces.org",
    team: "Engineering",
    role: "Member",
    photoURL: "",
    instagramLink: "",
    linkedinLink: "https://www.linkedin.com/in/david-lee"
  },
  {
    name: "Esha Patel",
    email: "esha.patel@aces.org",
    team: "Marketing",
    role: "Member",
    photoURL: "",
    instagramLink: "",
    linkedinLink: "https://www.linkedin.com/in/esha-patel"
  },
  {
    name: "Frank O'Connor",
    email: "frank.oconnor@aces.org",
    team: "Operations",
    role: "Team Head",
    photoURL: "",
    instagramLink: "",
    linkedinLink: "https://www.linkedin.com/in/frank-oconnor"
  }
];

async function seed() {
  try {
    await connectDB();

    const toInsert = MEMBERS.map((m) => ({
      ...m,
      memberId: generateUniqueId({ prefix: "ACES", alphanumeric: false, length: 6 })
    }));

    // Insert many; don't stop on duplicates so re-running is safe-ish
    const inserted = await Member.insertMany(toInsert, { ordered: false });
    console.log(`Inserted ${inserted.length} members`);
  } catch (error) {
    // Duplicate key errors may happen on re-run; report and continue
    if (error && error.code === 11000) {
      console.warn("Duplicate key error: some members likely already exist.");
    } else {
      console.error("Seeding error:", error);
      process.exitCode = 1;
    }
  } finally {
    try {
      await mongoose.disconnect();
    } catch (e) {
      // ignore
    }
  }
}

seed().then(() => {
  console.log("Seeding finished");
});
