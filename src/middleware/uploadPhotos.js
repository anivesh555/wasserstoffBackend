
const multer = require('multer');
const fs = require('fs')
// const multerS3 = require('multer-s3');
// const s3 = require('./../config/aws')

function fileCheckFilter (req, file, cb) {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type, only JPEG and PNG is allowed!'));
  }
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = 's3/';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
       
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname);
    }
  });

const upload = multer({ storage: storage,fileFilter: fileCheckFilter });

// const uploadS3 = multer({
//   storage: multerS3({
//     s3: s3,
//     bucket:  process.env.AWS_BUCKET_NAME,
//     contentType: multerS3.AUTO_CONTENT_TYPE,
//     metadata: function (req, file, cb) {
//       cb(null, {fieldName: file.fieldname});
//     },
//     key: function (req, file, cb) {
//       cb(null, Date.now().toString())
//     }
//   }),
//   fileFilter: fileCheckFilter
// })

const errorHandlerMulter = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(500).json({ error: err.message });
  } else if (err) {
    return res.status(500).json({ error: err.message });
  }

// Everything went fine.
  next();
}
module.exports={upload,errorHandlerMulter}
