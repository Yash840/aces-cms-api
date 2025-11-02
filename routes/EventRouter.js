import { Router } from "express";
import { 
  getAllEvents, 
  getEventById, 
  createEvent, 
  updateEvent, 
  deleteEvent 
} from "../handlers/eventHandler.js";
import { upload } from "../middleware/multer.js";
import { uploadImage } from "../middleware/uploadImgToCloud.js";

const eventRouter = Router();

eventRouter.get("/", getAllEvents);
eventRouter.get("/:id", getEventById);
eventRouter.post("/", upload.single("img"), uploadImage, createEvent);
eventRouter.patch("/:id",upload.single("img"), uploadImage, updateEvent);
eventRouter.delete("/:id", deleteEvent);

export default eventRouter;
