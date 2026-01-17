import path from "path";
import { v4 as uuidv4 } from "uuid";

const supportedExts = [".png", ".jpg", ".jpeg", ".gif"];

export const checkFile = (req, res, next) => {
  const file = req.files?.image;

  if (!file) {
    return res.status(400).json({
      status: "error",
      data: "Please provide image file",
    });
  }

  const fileExt = path.extname(file.name).toLowerCase();
  if (!supportedExts.includes(fileExt)) {
    return res.status(400).json({
      status: "error",
      data: "Please provide valid image file",
    });
  }

  const imagePath = `${uuidv4()}-${file.name}`;

  file.mv(`./uploads/${imagePath}`, (err) => {
    if (err) {
      return res.status(500).json({
        status: "error",
        data: "Image upload failed",
        message: err.message,
      });
    }

    req.imagePath = imagePath; // ✅ set imagePath for controller
    next();
  });
};

// For updates: image is optional
export const updateCheckFile = (req, res, next) => {
  const file = req.files?.image;
  if (!file) return next(); // no image, continue

  const fileExt = path.extname(file.name).toLowerCase();
  if (!supportedExts.includes(fileExt)) {
    return res.status(400).json({
      status: "error",
      data: "Please provide valid image file",
    });
  }

  const imagePath = `${uuidv4()}-${file.name}`;

  file.mv(`./uploads/${imagePath}`, (err) => {
    if (err) {
      return res.status(500).json({
        status: "error",
        data: "Image upload failed",
        message: err.message,
      });
    }

    req.imagePath = imagePath;
    next();
  });
};












