import multer from "multer";
import path from "path";

// Storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Store admin ID proofs inside /uploads/adminProofs
    cb(null, "uploads/adminProofs/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

// Allow Images AND PDFs
const fileFilter = (req, file, cb) => {
  const allowed = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "application/pdf"
  ];

  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG, PNG, or PDF files are allowed"));
  }
};

export const upload = multer({ storage, fileFilter });
