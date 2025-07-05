import multer from "multer";
import path from "path";


const BlogFile = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/blog");
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

const uploadBlogImg = multer({
  storage: BlogFile,
  limits: {
    fileSize: 10 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed!"));
    }
    cb(null, true);
  }
});


const blogImg = uploadBlogImg;

export { blogImg };


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/blog/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only images are allowed'));
  }
});

const uploads = upload;
export { uploads };
