const multer = require('multer');
const path = require('path');

const { validatorHandler } = require('./validator.handler');
const { attachLink } = require('../schemas/card-attachment.schema');

const { allowedFormatsForImage } = require('../../../utils/constants');

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

const storage = multer.memoryStorage();
const uploadSingle = (allowedFormats, inputName = 'file') => {
  return multer({
    storage,
    fileFilter: fileFilterByExtension(allowedFormats),
  }).single(inputName);
};

const conditionalUploadFileMiddleware = (req, res, next) => {
  const contentType = req.headers['content-type'];
  if (contentType && contentType.includes('multipart/form-data')) {
    return uploadSingle(allowedFormatsForImage, 'file')(req, res, next);
  }

  return validatorHandler(attachLink, 'body')(req, res, next);
};

const uploadProjectBackgroundImage = uploadSingle(
  allowedFormatsForImage,
  'background-image',
);

module.exports = {
  conditionalUploadFileMiddleware,
  uploadProjectBackgroundImage,
};
