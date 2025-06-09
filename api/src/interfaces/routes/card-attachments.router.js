const express = require('express');

const router = express.Router();

const { validateSession } = require('../middlewares/authentication.handler');
const { validatorHandler } = require('../middlewares/validator.handler');
const {
  checkProjectMembershipByCard,
} = require('../middlewares/authorization/card.authorization');
const { cardIdSchema } = require('../schemas/card.schema');
const {
  cardAttachmentSchema,
  updateCardAttachmentSchema,
} = require('../schemas/card-attachment.schema');
const {
  conditionalUploadFileMiddleware,
} = require('../middlewares/upload-files.handler');

const cardAttachmentControllers = require('../controllers/card-attachments.controller');

/**
 * @swagger
 * /cards/{cardId}/attachments:
 *   get:
 *     summary: Get all attachments of a card
 *     description: |
 *       Returns all attachments (files or external links) associated with a specific card.
 *
 *       ### Authorization & Access Rules
 *       - Requires a valid Bearer access token.
 *       - The `cardId` must be a valid UUID.
 *       - The requester must be a member of the project that owns the card (any role).
 *
 *     tags:
 *       - card-attachment
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cardId
 *         required: true
 *         description: ID of the card to retrieve attachments from
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: List of attachments for the specified card
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 cardAttachments:
 *                   type: array
 *                   items:
 *                      $ref: '#/components/schemas/Attachment'
 *       401:
 *         description: Invalid or missing token
 *       403:
 *         description: User is not authorized to view this card's attachments
 *       404:
 *         description: Card not found
 */
router.get(
  '/:cardId/attachments',
  validateSession,
  validatorHandler(cardIdSchema, 'params'),
  checkProjectMembershipByCard,
  cardAttachmentControllers.getAllCardAttachments,
);

/**
 * @swagger
 * /cards/{cardId}/attachments/{attachmentId}/download:
 *   get:
 *     summary: Download a file attachment from a card
 *     description: |
 *       It acts as a proxy for downloading an attachment stored on an external hosting service. It can also be used to view card attachments, not just for downloading.
 *
 *       - This endpoint ensures the actual storage URL remains hidden.
 *       - Only works for **file attachments**, not for external links.
 *       - The attachment must belong to the card identified by `cardId`.
 *
 *       ### Authorization & Access Rules
 *       - Requires a valid Bearer access token.
 *       - Both `cardId` and `attachmentId` must be valid UUIDs.
 *       - The requester must be a member of the project that owns the card (any role).
 *
 *     tags:
 *       - card-attachment
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cardId
 *         required: true
 *         description: ID of the card that owns the attachment
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: path
 *         name: attachmentId
 *         required: true
 *         description: ID of the file attachment to download
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: File attachment streamed for download
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Cannot download external links
 *       401:
 *         description: Invalid or missing token
 *       403:
 *         description: User is not authorized to download this attachment
 *       404:
 *         description: Attachment not found or does not belong to the specified card
 */
router.get(
  '/:cardId/attachments/:attachmentId/download',
  validateSession,
  validatorHandler(cardAttachmentSchema, 'params'),
  checkProjectMembershipByCard,
  cardAttachmentControllers.downloadCardAttachment,
);

/**
 * @swagger
 * /cards/{cardId}/attachments:
 *   post:
 *     summary: Attach a file or link to a card
 *     description: |
 *       Saves a new attachment (either a file or an external link) to a specific card.
 *       - Files must be sent as `multipart/form-data` using the field name `file`.
 *       - Supported file types: **jpg, png, avif, jpeg, svg, webp, gif**.
 *       - Maximum file size: **5MB**.
 *       - If sending an external link, use JSON with `filename` and `url` in the body.
 *
 *       This endpoint can only be used to upload a file or a link, **you cannot do both at the same time**.
 *
 *       ### Authorization & Access Rules
 *       - Requires a valid Bearer access token.
 *       - The `cardId` must be a valid UUID.
 *       - The requester must be a member of the project that owns the card (any role).
 *
 *     tags:
 *       - card-attachment
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cardId
 *         required: true
 *         description: ID of the card to attach the file or link to
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: File to attach to the card
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - filename
 *               - url
 *             properties:
 *               filename:
 *                 type: string
 *                 example: Github repository
 *               url:
 *                 type: string
 *                 format: uri
 *                 example: https://github.com/OscarS05/Trello-like-project
 *     responses:
 *       201:
 *         description: Attachment saved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: The attachment was saved successfully
 *                 job:
 *                    type: object
 *                    properties:
 *                      id:
 *                        type: string
 *                        example: 12
 *                      name:
 *                        type: string
 *                        example: loadCardAttachment
 *       400:
 *         description: Invalid input or unsupported file type
 *       401:
 *         description: Invalid or missing token
 *       403:
 *         description: User is not authorized to attach files/links to this card
 *       404:
 *         description: Card not found
 */
router.post(
  '/:cardId/attachments',
  validateSession,
  validatorHandler(cardIdSchema, 'params'),
  checkProjectMembershipByCard,
  conditionalUploadFileMiddleware,
  cardAttachmentControllers.saveCardAttachment,
);

/**
 * @swagger
 * /cards/{cardId}/attachments/{attachmentId}:
 *   patch:
 *     summary: Update a card attachment
 *     description: |
 *       Updates the `filename` and/or `url` of an attachment belonging to a specific card.
 *
 *       - If the attachment is a **file**, only the `filename` can be updated. The file itself will **not be replaced or renamed** in the file hosting service.
 *       - If the attachment is an **external link**, both the `filename` and the `url` can be updated.
 *
 *       ### Authorization & Access Rules
 *       - Requires a valid Bearer access token.
 *       - The `cardId` and `attachmentId` must be valid UUIDs.
 *       - The requester must be a member of the project that owns the card (any role).
 *
 *     tags:
 *       - card-attachment
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cardId
 *         required: true
 *         description: ID of the card that owns the attachment
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: path
 *         name: attachmentId
 *         required: true
 *         description: ID of the attachment to update
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - filename
 *             properties:
 *               filename:
 *                 type: string
 *                 example: Updated file name or link name
 *               url:
 *                 type: string
 *                 format: uri
 *                 example: https://updated-link.example.com
 *     responses:
 *       200:
 *         description: Attachment updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: The card attachment was successfully updated
 *                 upadedCard:
 *                   $ref: '#/components/schemas/Attachment'
 *       400:
 *         description: Invalid input or update not allowed
 *       401:
 *         description: Invalid or missing token
 *       403:
 *         description: User is not authorized to update attachments on this card
 *       404:
 *         description: Attachment or card not found
 */
router.patch(
  '/:cardId/attachments/:attachmentId',
  validateSession,
  validatorHandler(cardAttachmentSchema, 'params'),
  validatorHandler(updateCardAttachmentSchema, 'body'),
  checkProjectMembershipByCard,
  cardAttachmentControllers.updateCardAttachment,
);

/**
 * @swagger
 * /cards/{cardId}/attachments/{attachmentId}:
 *   delete:
 *     summary: Delete an attachment from a card
 *     description: |
 *       Deletes an attachment (file or external link) from a specific card.
 *
 *       - If the attachment is a **file**, it will also be deleted from the file hosting service.
 *       - If the attachment is an **external link**, it will only be removed from the database.
 *
 *       ### Authorization & Access Rules
 *       - Requires a valid Bearer access token.
 *       - The `cardId` and `attachmentId` must be valid UUIDs.
 *       - The requester must be a member of the project that owns the card (any role).
 *
 *     tags:
 *       - card-attachment
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cardId
 *         required: true
 *         description: ID of the card that owns the attachment
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: path
 *         name: attachmentId
 *         required: true
 *         description: ID of the attachment to delete
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Attachment deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: The card attachment was successfully removed
 *                 deletedCard:
 *                   type: integer
 *                   example: 1
 *       401:
 *         description: Invalid or missing token
 *       403:
 *         description: User is not authorized to delete attachments on this card
 *       404:
 *         description: Attachment or card not found
 */
router.delete(
  '/:cardId/attachments/:attachmentId',
  validateSession,
  validatorHandler(cardAttachmentSchema, 'params'),
  checkProjectMembershipByCard,
  cardAttachmentControllers.deleteCardAttachent,
);

module.exports = router;
