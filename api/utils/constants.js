// FOLDERS IN CLOUDINARY
const PROJECT_BACKGROUND_FOLDER = 'project-backgrounds';
const CARD_ATTACHMENT_FOLDER = 'card-attachments';

// ALLOWED FILES TO LOAD IN CLOUDINARY
const allowedFormatsForImage = [
  'jpg',
  'avif',
  'png',
  'jpeg',
  'svg',
  'webp',
  'gif',
];
const MAX_FILE_SIZE_IN_BYTES = 5 * 1024 * 1024; // 5MB

// QUEUES
const emailQueueName = 'emailQueue';
const attachmentQueueName = 'attachmentQueue';
const nameQueueLoadBackgroundImage = 'loadBackgroundImage';
const loadCardAttachmentName = 'loadCardAttachment';
const sendVerificationEmailName = 'sendVerificationEmail';

module.exports = {
  PROJECT_BACKGROUND_FOLDER,
  CARD_ATTACHMENT_FOLDER,
  nameQueueLoadBackgroundImage,
  emailQueueName,
  attachmentQueueName,
  sendVerificationEmailName,
  loadCardAttachmentName,
  allowedFormatsForImage,
  MAX_FILE_SIZE_IN_BYTES,
};
