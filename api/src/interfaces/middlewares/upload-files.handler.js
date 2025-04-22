const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../../infrastructure/store/storage/cloudinary');

const CARD_ATTACHMENT_FOLER = 'card-attachments';
const PROJECT_BACKGROUND_FOLER = 'project-backgrounds';

const storageCardAttachments = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: CARD_ATTACHMENT_FOLER,
    allowed_formats: ['jpg', 'png', 'jpeg', 'pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'svg'],
    use_filename: true,
    unique_filename: true,
  },
});
const uploadCardAttachment = multer({ storage: storageCardAttachments });

const projectBackgroundImage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: PROJECT_BACKGROUND_FOLER,
    allowed_formats: ['jpg', 'png', 'jpeg', 'pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'svg'],
    use_filename: true,
    unique_filename: true,
  },
});
const uploadProjectBackgroundImage = multer({ storage: projectBackgroundImage });

const conditionalUploadFileMiddleware = (req, res, next) => {
  const contentType = req.headers['content-type'];
  if (contentType && contentType.includes('multipart/form-data')) {
    return uploadCardAttachment.single('file')(req, res, next);
  }

  next();
};

module.exports = {
  conditionalUploadFileMiddleware,
  uploadCardAttachment,
  uploadProjectBackgroundImage,
  CARD_ATTACHMENT_FOLER,
};
