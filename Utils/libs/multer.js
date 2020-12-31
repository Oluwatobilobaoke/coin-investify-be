const multer = require("multer");
const path = require("path");
//image upload
const storage = multer.diskStorage({
    destination: (req, res, cb) => {
         cb(null, path.join("./files/"));
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString().replace(/:/g, '-')+ file.originalname);
    }
});
console.log(storage);
// checking file type
const fileFilter = (req, file, cb) => {
    console.log("file", file);
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else if (file.mimetype.startsWith('application')) {
        cb(null, true);
    } else {
        cb(new Error('Not an image / pdf! Please upload an a valid file.', 400), false);
    }
};
exports.upload = multer({
    storage: storage,   
    limits: {
        fileSize: 1024 * 1024 * 6
    },
    fileFilter: fileFilter
});