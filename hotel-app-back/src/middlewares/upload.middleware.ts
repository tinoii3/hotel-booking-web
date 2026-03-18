import multer from "multer";
import path from "path";
import fs from 'fs';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = 'assets/uploads/rooms/';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

export const upload = multer({ storage: storage })