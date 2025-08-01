import multer from "multer";
import path from "path";

// Storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Folder to save images
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

// Filter only images
const fileFilter = (req, file, cb) => {
  if(['image/jpeg','image/jpg','image/png'].includes(file.mimetype)){
        cb(null,true);
    } else {
    cb(new Error("Only JPEG/PNG images allowed"));
  }
};

export const upload = multer({ storage, fileFilter });
