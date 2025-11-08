import { Router } from "express";
import { deleteMember, getAllMembers, getMemberById, getMembersInPublicDataFormat, registerNewMember, updateMember } from "../handlers/memberHandler.js";
import { upload } from "../middleware/multer.js";
import { uploadImage } from "../middleware/uploadImgToCloud.js";
import validateAuthToken from "../middleware/jwtValidator.js";

const memberRouter = Router();

memberRouter.get("/", validateAuthToken,  getAllMembers);
memberRouter.get("/protected/aces/2025", validateAuthToken, getMembersInPublicDataFormat);
memberRouter.get("/:id", validateAuthToken, getMemberById);
memberRouter.post("/", validateAuthToken, upload.single("img"), uploadImage, registerNewMember);
memberRouter.patch("/:id", validateAuthToken,  upload.single("img"), uploadImage, updateMember);
memberRouter.delete("/:id", validateAuthToken,  deleteMember);

export default memberRouter;
