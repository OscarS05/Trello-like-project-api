/**
 * @swagger
 * components:
 *   schemas:
 *
 *     Attachment:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: dbb98467-81ad-4018-90f6-cbf581eac82d
 *         filename:
 *           type: string
 *           example: Agroplus-db-scheme.jpg
 *         url:
 *           type: string
 *           format: uri
 *           example: https://res.cloudinary.com/dfprxzekh/image/upload/v1744326304/card-attachments/file_ysjlp7.jpg
 *         cardId:
 *           type: string
 *           format: uuid
 *           example: 1a8ad354-e5bb-49f7-95b3-5cdfa0533233
 *         type:
 *           type: string
 *           example: image/jpeg
 *           description: Type of attachment (e.g. image/jpeg, external-link)
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2025-04-10T23:05:04.884Z
 */
