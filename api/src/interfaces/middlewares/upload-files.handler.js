const multer = require('multer');
const path = require('path');

const { validatorHandler } = require('./validator.handler');
const { attachLink } = require('../schemas/card-attachment.schema');

const allowedFormatsForImage = ['jpg', 'avif', 'png', 'jpeg', 'svg'];
const allowedFormatsForAttachments = [
  'jpg',
  'avif',
  'png',
  'jpeg',
  'svg',
  'doc',
  'docx',
  'pdf',
  'ppt',
  'pptx',
  'xls',
  'xlsx',
];

const { CARD_ATTACHMENT_FOLDER } = require('../../../utils/constants');

const storage = multer.memoryStorage();
const uploadSingle = (allowedFormats, inputName = 'file') => {
  return multer({
    storage,
    fileFilter: fileFilterByExtension(allowedFormats),
  }).single(inputName);
};

const fileFilterByExtension = (allowedFormats) => {
  return (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase().slice(1);
    if (allowedFormats.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid file type: ${ext}`), false);
    }
  };
};

const uploadToCloudinary = (folder) => {
  return async (req, res, next) => {
    // try {
    //   if (!req.file) {
    //   }
    //   const buffer = req.file.buffer;
    //   const dimensions = imageSize(buffer);
    //   const { width, height } = dimensions;
    //   if (width < 800 || width < height) {
    //     return next(
    //       new Error('The image must be horizontal and at least 800px wide.')
    //     );
    //   }
    //   const base64file = `data:${req.file.mimetype};base64,${buffer.toString(
    //     'base64'
    //   )}`;
    //   const result = await cloudinaryStorageRepository.upload(
    //     { path: base64file },
    //     folder
    //   );
    //   console.log('RESULT', result);
    //   req.file = {
    //     ...result,
    //     originalname: req.file.originalname,
    //     mimetype: req.file.mimetype,
    //   };
    //   next();
    // } catch (error) {
    //   next(error);
    // }
  };
};

const conditionalUploadFileMiddleware = (req, res, next) => {
  const contentType = req.headers['content-type'];
  if (contentType && contentType.includes('multipart/form-data')) {
    uploadSingle(allowedFormatsForAttachments, 'file');
    return next();
  }

  return validatorHandler(attachLink, 'body')(req, res, next);
};

const uploadProjectBackgroundImage = uploadSingle(
  allowedFormatsForImage,
  'background-image'
);

module.exports = {
  conditionalUploadFileMiddleware,
  uploadProjectBackgroundImage,
};
