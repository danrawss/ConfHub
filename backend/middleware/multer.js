const multer = require("multer");

// Configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Directory where files will be stored
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + "-" + file.originalname); // Unique file name
    },
});

// Initialize multer with storage configuration
const upload = multer({ storage });

module.exports = upload;
