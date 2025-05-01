const { cardMemberRouter: cardRouter, router: labelRouter } = require('./label.router');

const { validateSession } = require('../middlewares/authentication.handler');
const { validatorHandler } = require('../middlewares/validator.handler');
const { checkProjectMembershipByUserId } = require('../middlewares/authorization/project.authorization');
const { checkProjectMembershipByCard } = require('../middlewares/authorization/card.authorization');
const { cardIdSchema, projectIdSchema } = require('../schemas/label.schema');
const { checklistSchema, createChecklistSchema, updateCardSchema } = require('../schemas/checklist.schema');

const checklistControllers = require('../controllers/checklist.controller');

/**
 * @swagger
 * /projects/{projectId}/checklists:
 *   get:
 *     summary: Get all checklists in a project
 *     description: |
 *       Retrieves all the checklists from the cards belonging to a specific project.
 *       Although the checklist belongs directly to a card, this endpoint returns all checklists
 *       from the cards within the specified project.
 *
 *       ### Authorization & Access Rules
 *       - Requires a valid Bearer access token.
 *       - The `projectId` must be a valid UUID.
 *       - The requester must be a member of the project (any role).
 *
 *     tags:
 *       - checklist
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         description: ID of the project to retrieve the checklists from
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: List of checklists for all cards in the project
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 checklists:
 *                   type: array
 *                   items:
 *                      $ref: '#/components/schemas/cardWithChecklists'
 *       401:
 *         description: Invalid or missing token
 *       403:
 *         description: User is not authorized to view checklists for this project
 *       404:
 *         description: Project not found or the user does not belong to the project
 */
labelRouter.get('/projects/:projectId/checklists',
  validateSession,
  validatorHandler(projectIdSchema, 'params'),
  checkProjectMembershipByUserId,
  checklistControllers.getAllChecklistsByProject
);

/**
 * @swagger
 * /cards/{cardId}/checklists:
 *   get:
 *     summary: Get all checklists for a specific card
 *     description: |
 *        Retrieves all checklists from a specific card, including their checklist items.
 *
 *        ### Authorization & Access Rules
 *        - Requires a valid Bearer access token.
 *        - The `cardId` must be a valid UUID.
 *        - The requester must be a member of the project (any role).
 *     tags:
 *       - checklist
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cardId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID of the card to get checklists from
 *     responses:
 *       200:
 *         description: A list of checklists with their items
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 checklists:
 *                   type: array
 *                   items:
 *                      $ref: '#/components/schemas/ChecklistWithItemWithouMembers'
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       403:
 *         description: Forbidden - User is not a member of the project
 *       404:
 *         description: Card not found
 */
cardRouter.get('/:cardId/checklists',
  validateSession,
  validatorHandler(cardIdSchema, 'params'),
  checkProjectMembershipByCard,
  checklistControllers.getAllChecklistsByCard
);

/**
 * @swagger
 * /cards/{cardId}/checklists:
 *   post:
 *     summary: Create a new checklist in a card
 *     description: |
 *        Creates a new checklist associated with a specific card. Only project members can create checklists, regardless of their role.
 *
 *        ### Authorization & Access Rules
 *        - Requires a valid Bearer access token.
 *        - The `cardId` must be a valid UUID.
 *        - The requester must be a member of the project (any role).
 *
 *     tags:
 *       - checklist
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cardId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID of the card where the checklist will be created
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the checklist
 *                 example: New checklist 2
 *     responses:
 *       201:
 *         description: Checklist successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 newChecklist:
 *                    $ref: '#/components/schemas/Checklist'
 *       400:
 *         description: Bad Request - Invalid request body
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       403:
 *         description: Forbidden - User is not a member of the project
 *       404:
 *         description: Card not found
 */
cardRouter.post('/:cardId/checklists',
  validateSession,
  validatorHandler(cardIdSchema, 'params'),
  validatorHandler(createChecklistSchema, 'body'),
  checkProjectMembershipByCard,
  checklistControllers.createChecklist
);

/**
 * @swagger
 * /cards/{cardId}/checklists/{checklistId}/copy:
 *   post:
 *     summary: Create a new checklist by copying items from another one
 *     description: |
 *        Creates a new checklist in a card by copying all the items from an existing checklist.
 *        This functionality replicates Trello's "copy checklist" feature.
 *
 *        ### Authorization & Access Rules
 *        - Requires a valid Bearer access token.
 *        - Both `cardId` and `checklistId` must be valid UUIDs.
 *        - The requester must be a member of the project (any role).
 *
 *     tags:
 *       - checklist
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cardId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID of the card where the new checklist will be created
 *       - in: path
 *         name: checklistId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID of the source checklist to copy items from
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the new checklist
 *                 example: Checklist with its items copied
 *     responses:
 *       201:
 *         description: Checklist with copied items successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 newChecklist:
 *                    $ref: '#/components/schemas/ChecklistWithItemWithouMembers'
 *       400:
 *         description: Bad Request - Invalid request body
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       403:
 *         description: Forbidden - User is not a member of the project
 *       404:
 *         description: Card or checklist not found
 */
cardRouter.post('/:cardId/checklists/:checklistId/copy',
  validateSession,
  validatorHandler(checklistSchema, 'params'),
  validatorHandler(createChecklistSchema, 'body'),
  checkProjectMembershipByCard,
  checklistControllers.createChecklistByCopyingItems
);

/**
 * @swagger
 * /cards/{cardId}/checklists/{checklistId}:
 *   patch:
 *     summary: Update an existing checklist
 *     description: |
 *        Updates the name of an existing checklist associated with a card.

 *        ### Authorization & Access Rules
 *        - Requires a valid Bearer access token.
 *        - Both `cardId` and `checklistId` must be valid UUIDs.
 *        - The requester must be a member of the project (any role).

 *     tags:
 *       - checklist
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
 *         description: UUID of the checklist to be updated
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - newName
 *             properties:
 *               newName:
 *                 type: string
 *                 description: New name for the checklist
 *                 example: Checklist of task 1
 *     responses:
 *       200:
 *         description: Checklist successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: The checklist was successfully updated
 *                 updatedChecklist:
 *                    $ref: '#/components/schemas/Checklist'
 *       400:
 *         description: Bad Request - Invalid request body
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       403:
 *         description: Forbidden - User is not a member of the project
 *       404:
 *         description: Card or checklist not found
 */
cardRouter.patch('/:cardId/checklists/:checklistId',
  validateSession,
  validatorHandler(checklistSchema, 'params'),
  validatorHandler(updateCardSchema, 'body'),
  checkProjectMembershipByCard,
  checklistControllers.updateChecklist
);

/**
 * @swagger
 * /cards/{cardId}/checklists/{checklistId}:
 *   delete:
 *     summary: Delete a checklist from a card
 *     description: |
 *        Deletes a checklist from a specific card. If the checklist contains items, and those items have assigned members, everything will be deleted in cascade.

 *        ### Authorization & Access Rules
 *        - Requires a valid Bearer access token.
 *        - Both `cardId` and `checklistId` must be valid UUIDs.
 *        - The requester must be a member of the project (any role).

 *     tags:
 *       - checklist
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
 *         description: UUID of the checklist to be deleted
 *     responses:
 *       200:
 *         description: Checklist successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: The checklist was successfully removed
 *                 deletedCard:
 *                   type: number
 *                   example: 1
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       403:
 *         description: Forbidden - User is not a member of the project
 *       404:
 *         description: Card or checklist not found
 */
cardRouter.delete('/:cardId/checklists/:checklistId',
  validateSession,
  validatorHandler(checklistSchema, 'params'),
  checkProjectMembershipByCard,
  checklistControllers.deleteChecklist
);

module.exports = { cardRouter, labelRouter };
