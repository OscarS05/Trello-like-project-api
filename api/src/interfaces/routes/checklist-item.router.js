const { cardRouter } = require('./checklist.router');

const { validateSession } = require('../middlewares/authentication.handler');
const { validatorHandler } = require('../middlewares/validator.handler');
const {
  checkProjectMembershipByCard,
} = require('../middlewares/authorization/card.authorization');
const { checklistSchema } = require('../schemas/checklist.schema');
const {
  checklistItemSchema,
  createChecklistItemSchema,
  schemaUpdateCheck,
  updateChecklistItemSchema,
} = require('../schemas/checklist-item.schema');

const checklistItemControllers = require('../controllers/checklist-item.controller');

/**
 * @swagger
 * /cards/{cardId}/checklists/{checklistId}/checklist-items:
 *   get:
 *     summary: Get all checklist items
 *     description: |
 *        Retrieves all items from a checklist, including assigned members for each item.

 *        ### Authorization & Access Rules
 *        - Requires a valid Bearer access token.
 *        - `cardId` and `checklistId` must be UUIDs.
 *        - The requester must be a member of the project (any role).

 *     tags:
 *       - checklist-item
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cardId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID of the card that contains the checklist
 *       - in: path
 *         name: checklistId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID of the checklist to retrieve items from
 *     responses:
 *       200:
 *         description: List of checklist items with their assigned members
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 checklistItems:
 *                   type: array
 *                   items:
 *                      $ref: '#/components/schemas/ChecklistItemWithMembers'
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       403:
 *         description: Forbidden - User is not a member of the project
 *       404:
 *         description: Card or checklist not found
 */
cardRouter.get(
  '/:cardId/checklists/:checklistId/checklist-items',
  validateSession,
  validatorHandler(checklistSchema, 'params'),
  checkProjectMembershipByCard,
  checklistItemControllers.getAllChecklistItems,
);

/**
 * @swagger
 * /cards/{cardId}/checklists/{checklistId}/checklist-items:
 *   post:
 *     summary: Create a new checklist item
 *     description: |
 *       Creates a new item in a checklist and optionally assigns project members to it.
 *       - **Only project members can be assigned.**
 *
 *       ### Authorization & Access Rules
 *       - Requires a valid Bearer access token.
 *       - `cardId` and `checklistId` must be UUIDs.
 *       - The requester must be a member of the project (any role).

 *     tags:
 *       - checklist-item
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cardId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID of the card that contains the checklist
 *       - in: path
 *         name: checklistId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID of the checklist to add the item to
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              $ref: '#/components/schemas/ChecklistItemRequest'
 *     responses:
 *       201:
 *         description: Checklist item successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 newChecklistItem:
 *                    $ref: '#/components/schemas/ChecklistItemWithMembers'
 *       400:
 *         description: Invalid request body
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       403:
 *         description: Forbidden - User is not a member of the project
 *       404:
 *         description: Card or checklist not found
 */
cardRouter.post(
  '/:cardId/checklists/:checklistId/checklist-items',
  validateSession,
  validatorHandler(checklistSchema, 'params'),
  validatorHandler(createChecklistItemSchema, 'body'),
  checkProjectMembershipByCard,
  checklistItemControllers.createChecklistItem,
);

/**
 * @swagger
 * /cards/{cardId}/checklists/{checklistId}/checklist-items/{checklistItemId}:
 *   patch:
 *     summary: Update a checklist item
 *     description: |
 *       Updates the properties of a checklist item. Allows changing the name, assigning new project members, and updating the due date.

 *       - **Only project members can be assigned.**
 *       - Already assigned members will not be reassigned again.
 *
 *       ### Authorization & Access Rules
 *       - Requires a valid Bearer access token.
 *       - All path parameters (`cardId`, `checklistId`, `checklistItemId`) must be UUIDs.
 *       - The requester must be a member of the project (any role).

 *     tags:
 *       - checklist-item
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cardId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID of the card containing the checklist
 *       - in: path
 *         name: checklistId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID of the checklist
 *       - in: path
 *         name: checklistItemId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID of the checklist item to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              $ref: '#/components/schemas/ChecklistItemRequest'
 *     responses:
 *       200:
 *         description: Checklist item successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: The checklist item was successfully updated
 *                 updatedItem:
 *                    $ref: '#/components/schemas/ChecklistItemWithAssigned'
 *       400:
 *         description: Invalid request body
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       403:
 *         description: Forbidden - User is not a member of the project
 *       404:
 *         description: Checklist item not found
 */
cardRouter.patch(
  '/:cardId/checklists/:checklistId/checklist-items/:checklistItemId',
  validateSession,
  validatorHandler(checklistItemSchema, 'params'),
  validatorHandler(updateChecklistItemSchema, 'body'),
  checkProjectMembershipByCard,
  checklistItemControllers.updateChecklistItem,
);

/**
 * @swagger
 * /cards/{cardId}/checklists/{checklistId}/checklist-items/{checklistItemId}/check:
 *   patch:
 *     summary: Update checklist item check status
 *     description: |
 *       Updates the `isChecked` property of a checklist item (i.e., mark it as completed or not).
 *
 *       ### Authorization & Access Rules
 *       - Requires a valid Bearer access token.
 *       - All path parameters must be UUIDs.
 *       - The requester must be a member of the project (any role).
 *
 *     tags:
 *       - checklist-item
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cardId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID of the card containing the checklist
 *       - in: path
 *         name: checklistId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID of the checklist
 *       - in: path
 *         name: checklistItemId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID of the checklist item
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isChecked:
 *                 type: boolean
 *             required:
 *               - isChecked
 *     responses:
 *       200:
 *         description: Checklist item check status successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: The checklist item was successfully updated
 *                 updatedItem:
 *                    $ref: '#/components/schemas/ChecklistItem'
 *       400:
 *         description: Invalid request body
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       403:
 *         description: Forbidden - User is not a member of the project
 *       404:
 *         description: Checklist item not found
 */
cardRouter.patch(
  '/:cardId/checklists/:checklistId/checklist-items/:checklistItemId/check',
  validateSession,
  validatorHandler(checklistItemSchema, 'params'),
  validatorHandler(schemaUpdateCheck, 'body'),
  checkProjectMembershipByCard,
  checklistItemControllers.updateTheCheckOfItem,
);

/**
 * @swagger
 * /cards/{cardId}/checklists/{checklistId}/checklist-items/{checklistItemId}:
 *   delete:
 *     summary: Delete a checklist item
 *     description: |
 *       Deletes a checklist item and all assigned members related to it.
 *
 *       ### Authorization & Access Rules
 *       - Requires a valid Bearer access token.
 *       - All path parameters must be UUIDs.
 *       - The requester must be a member of the project (any role).
 *
 *     tags:
 *       - checklist-item
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cardId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID of the card
 *       - in: path
 *         name: checklistId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID of the checklist
 *       - in: path
 *         name: checklistItemId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID of the checklist item to delete
 *     responses:
 *       200:
 *         description: Checklist item successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: The checklist item was successfully removed
 *                 deletedCard:
 *                   type: integer
 *                   example: 1
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       403:
 *         description: Forbidden - User is not a member of the project
 *       404:
 *         description: Checklist item not found
 */
cardRouter.delete(
  '/:cardId/checklists/:checklistId/checklist-items/:checklistItemId',
  validateSession,
  validatorHandler(checklistItemSchema, 'params'),
  checkProjectMembershipByCard,
  checklistItemControllers.deleteChecklistItem,
);

module.exports = cardRouter;
