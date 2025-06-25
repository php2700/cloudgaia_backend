import multer from "multer";
import path from "path";

const uploadVideo = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/about/");
    },
    filename: async (req, file, cb) => {
        try {
            const currentDate = new Date();
            const timestamp = currentDate.getTime().toString();
            const uniqueSuffix = timestamp;
            const ext = path.extname(file.originalname);
            cb(null, uniqueSuffix + ext);
        } catch (err) {
            console.error("Error generating filename:", err);
            cb(err);
        }
    },
});

const allowedMimeTypes = ["video/mp4", "video/mov", "video/avi", "video/mkv"];

const Video = multer({
    storage: uploadVideo,
    limits: {
        fileSize: 20 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Invalid file type. Only video files are allowed."));
        }
    },
});

export { Video };
