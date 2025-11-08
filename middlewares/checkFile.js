import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const supportedExts = ['.png','.jpg','.jpeg','.gif'];
export const checkFile = (req,res,next) => {
   const file = req.files?.image;
   //checking file
   if (!file) return res.status(400).json({
    status:'Error',
    data:'please provide image files'
   });
  const fileExt = path.extname(file.name);
  //checking valid image file
  if(!supportedExts.includes(fileExt)) return res.status(400).json({
    status:'Error',
    data:'please provide valid image files'
   });
    
   const imagePath = `${uuidv4()}-${file.name}`;
    file.mv(`./uploads/${imagePath}`,(err) => {
      req.imagePath=imagePath;
    next();
    });
    }


// update checkfile
    export const updateCheckFile = (req,res,next) => {
   const file = req.files?.image;
   //checking file
   if (!file) return next();
  const fileExt = path.extname(file.name);
  //checking valid image file
  if(!supportedExts.includes(fileExt)) return res.status(400).json({
    status:'Error',
    data:'please provide valid image files'
   });
    
   const imagePath = `${uuidv4()}-${file.name}`;
    file.mv(`./uploads/${imagePath}`,(err) => {
      req.imagePath=imagePath;
    next();
    });
    }
















