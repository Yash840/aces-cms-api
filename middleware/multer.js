import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb){
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb){
    const suffix = Date.now();
    const name = file.fieldname + "-" + suffix + path.extname(file.originalname);
    cb(null, name);
  }
})

export const upload = multer({
  storage: storage, 
  limits: {
    fileSize: 5*1024*1024
  },
  fileFilter: function(req, file, cb){
    const exts = ['.png', '.jpeg', '.jpg'];
    const fileExt = path.extname(file.originalname).toLowerCase();
    
    if(exts.includes(fileExt)){
      cb(null, true);
    } else {
      cb(new Error("File not supported"), false);
    }
  }
});