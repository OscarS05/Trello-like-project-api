const express = require('express');

const router = express.Router();

const cardMemberRouter = require('./card-members.router');

const { validateSession } = require('../middlewares/authentication.handler');
const { validatorHandler } = require('../middlewares/validator.handler');
const {
  checkProjectMembershipByUserId,
} = require('../middlewares/authorization/project.authorization');
const {
  checkProjectMembershipByCard,
} = require('../middlewares/authorization/card.authorization');
const {
  createLabelSchema,
  projectIdSchema,
  projectLabelScheme,
  labelIdSchema,
  cardIdSchema,
  updateLabelSchema,
  updateVisibility,
  labelVisibilitySchema,
} = require('../schemas/label.schema');

const labelControllers = require('../controllers/label.controller');

/**
 * @swagger
 * /projects/{projectId}/labels:
 *   get:
 *     summary: Get all labels in a project
 *     description: |
 *       This endpoint retrieves all labels associated with a specific project.
 *
 *       ### Authorization & Access Rules
 *
 *       - Requires a valid Bearer access token.
 *       - `projectId` must be a valid UUID.
 *       - The user must be a **member** of the project.
 *       - If access is denied or the project is not found, appropriate error codes will be returned.
 *
 *     tags:
 *       - label
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         description: ID of the project from which to retrieve labels
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Labels successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 labels:
 *                   type: array
 *                   items:
 *                      $ref: '#/components/schemas/Label'
 *       401:
 *         description: Invalid or missing token
 *       403:
 *         description: User does not have permission to access the project
 *       404:
 *         description: Project not found
 */
router.get(
  '/projects/:projectId/labels',
  validateSession,
  validatorHandler(projectIdSchema, 'params'),
  checkProjectMembershipByUserId,
  labelControllers.getAllLabels,
);

/**
 * @swagger
 * /cards/{cardId}/labels/:
 *   get:
 *     summary: Get labels assigned to a card
 *     description: |
 *       Retrieves all labels that have been assigned to a specific card via the `card_labels` table in the database.
 *       Each label includes whether it is currently visible (`isVisible`) or not.
 *
 *       ### Authorization & Access Rules
 *       - Requires a valid Bearer access token.
 *       - The `cardId` must be a valid UUID.
 *       - The user must be a member of the project that owns the card (any role).
 *
 *     tags:
 *       - label
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cardId
 *         required: true
 *         description: ID of the card to retrieve labels for
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: List of labels associated with the card, including their visibility
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 visibleLabels:
 *                   type: array
 *                   items:
 *                      $ref: '#/components/schemas/LabelWithVisibility'
 *       401:
 *         description: Invalid or missing token
 *       403:
 *         description: User does not have permission to access this card's labels
 *       404:
 *         description: Card not found
 */
cardMemberRouter.get(
  '/:cardId/labels/',
  validateSession,
  validatorHandler(cardIdSchema, 'params'),
  checkProjectMembershipByCard,
  labelControllers.getLabelsByCard,
);

/**
 * @swagger
 * /projects/{projectId}/cards/{cardId}/labels:
 *   post:
 *     summary: Create a new label for a project from a card
 *     description: |
 *       This endpoint allows a project member to create a new label from within a specific card.
 *       Although the label is created in the context of a card, it is stored at the project level so it can be reused across all cards in the project.
 *       After creation, the label is automatically associated (made visible) with the card where it was created.
 *
 *       ### Authorization & Access Rules
 *
 *       - Requires a valid Bearer access token.
 *       - `projectId` and `cardId` must be valid UUIDs.
 *       - The user must be a **member** of the project (any role).
 *       - The label will be available for all cards in the project, and immediately visible in the card where it was created.
 *
 *     tags:
 *       - label
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         description: ID of the project where the label will be created
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: path
 *         name: cardId
 *         required: true
 *         description: ID of the card where the label is being created
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              $ref: '#/components/schemas/CreateLabel'
 *     responses:
 *       201:
 *         description: Label successfully created and associated with the card
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 newLabel:
 *                    $ref: '#/components/schemas/LabelWithVisibility'
 *       400:
 *         description: Validation error in body or parameters
 *       401:
 *         description: Invalid or missing token
 *       403:
 *         description: User does not have permission to access the project
 *       404:
 *         description: Project or card not found
 */
router.post(
  '/projects/:projectId/cards/:cardId/labels',
  validateSession,
  validatorHandler(projectLabelScheme, 'params'),
  validatorHandler(createLabelSchema, 'body'),
  checkProjectMembershipByUserId,
  labelControllers.createLabel,
);

/**
 * @swagger
 * /projects/{projectId}/labels/{labelId}:
 *   patch:
 *     summary: Update a label
 *     description: |
 *       This endpoint updates a label's `name` and `color` within a project.
 *
 *       ### Authorization & Access Rules
 *
 *       - Requires a valid Bearer access token.
 *       - `projectId` and `labelId` must be valid UUIDs.
 *       - The user must be a member of the project (any role).
 *
 *     tags:
 *       - label
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         description: ID of the project the label belongs to
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: path
 *         name: labelId
 *         required: true
 *         description: ID of the label to update
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateLabel'
 *     responses:
 *       200:
 *         description: Label successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: The card member was successfully updated
 *                 updatedLabel:
 *                    $ref: '#/components/schemas/Label'
 *       401:
 *         description: Invalid or missing token
 *       403:
 *         description: User does not have permission to access the project
 *       404:
 *         description: Label not found
 */
router.patch(
  '/projects/:projectId/labels/:labelId',
  validateSession,
  validatorHandler(labelIdSchema, 'params'),
  validatorHandler(updateLabelSchema, 'body'),
  checkProjectMembershipByUserId,
  labelControllers.updateLabel,
);

/**
 * @swagger
 * /cards/{cardId}/labels/{labelId}/visibility:
 *   patch:
 *     summary: Update label visibility in a card
 *     description: |
 *       Updates the visibility status of a label within a specific card.
 *       The label must already exist in the project. This only affects visibility in the given card.
 *
 *       ### Authorization & Access Rules
 *       - Requires a valid Bearer access token.
 *       - `cardId` and `labelId` must be UUIDs.
 *       - The user must be a member of the project (any role).
 *
 *     tags:
 *       - label
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cardId
 *         required: true
 *         description: ID of the card where visibility is being changed
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: path
 *         name: labelId
 *         required: true
 *         description: ID of the label whose visibility will be updated
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isVisible:
 *                 type: boolean
 *                 example: true
 *             required:
 *               - isVisible
 *     responses:
 *       200:
 *         description: Visibility updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 newLabel:
 *                    $ref: '#/components/schemas/updatedLabelVisibility'
 *       401:
 *         description: Invalid or missing token
 *       403:
 *         description: User does not have permission to modify label visibility
 *       404:
 *         description: Label or card not found
 */
cardMemberRouter.patch(
  '/:cardId/labels/:labelId/visibility',
  validateSession,
  validatorHandler(labelVisibilitySchema, 'params'),
  validatorHandler(updateVisibility, 'body'),
  checkProjectMembershipByCard,
  labelControllers.updateLabelVisibilityInCard,
);

/**
 * @swagger
 * /projects/{projectId}/labels/{labelId}:
 *   delete:
 *     summary: Delete a label from the project
 *     description: |
 *       Deletes a label from the specified project. The label will no longer be available for any card in the project.
 *
 *       ### Authorization & Access Rules
 *       - Requires a valid Bearer access token.
 *       - `projectId` and `labelId` must be UUIDs.
 *       - The user must be a member of the project (any role).
 *
 *     tags:
 *       - label
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         description: ID of the project
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: path
 *         name: labelId
 *         required: true
 *         description: ID of the label to delete
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Label successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: The card member was successfully removed
 *                 deletedCard:
 *                   type: integer
 *                   example: 1
 *       401:
 *         description: Invalid or missing token
 *       403:
 *         description: User does not have permission to delete the label
 *       404:
 *         description: Label or project not found
 */
router.delete(
  '/projects/:projectId/labels/:labelId',
  validateSession,
  validatorHandler(labelIdSchema, 'params'),
  checkProjectMembershipByUserId,
  labelControllers.deleteLabel,
);

module.exports = { router, cardMemberRouter };
