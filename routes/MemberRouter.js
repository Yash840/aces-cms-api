import { Router } from "express";
import { deleteMember, getAllMembers, getMemberById, getMembersInPublicDataFormat, registerNewMember, updateMember } from "../handlers/memberHandler.js";
import { upload } from "../middleware/multer.js";
import { uploadImage } from "../middleware/uploadImgToCloud.js";

const memberRouter = Router();

memberRouter.get("/", getAllMembers);
memberRouter.get("/protected/aces/2025", getMembersInPublicDataFormat);
memberRouter.get("/:id", getMemberById);
memberRouter.post("/",upload.single("img"), uploadImage, registerNewMember);
memberRouter.patch("/:id", upload.single("img"), uploadImage, updateMember);
memberRouter.delete("/:id", deleteMember);

export default memberRouter;
