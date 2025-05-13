import multer from "multer"

// const storageMain = multer.diskStorage({
//   // destination: function (req, file, cb) {
//   //   cb(null, "uploads/");
//   // },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     let extension = file.originalname.split(".")[1];
//     cb(null, file.fieldname + "-" + uniqueSuffix + "." + extension);
//   },
// });

const storage = multer.memoryStorage()

const upload = multer({ storage: storage });

export default upload;