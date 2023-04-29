const multer = require('multer');
const path = require('path');

global.fileUploadeWithName = "";

let fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads');
    },
    filename: (req, file, cb) => {
        var file_name = Date.now() + path.extname(file.originalname);
        global.fileUploadeWithName = file_name;
        cb(null, file_name);
    }
});

module.exports = fileStorage;