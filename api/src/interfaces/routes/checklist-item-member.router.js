const express = require('express');
const router = express.Router();

const { validateSession } = require('../middlewares/authentication.handler');
const { validatorHandler } = require('../middlewares/validator.handler');
const { checkProjectMembershipByChecklist } = require('../middlewares/authorization/card.authorization');
const { checklistItemMemberSchema, checklistItemSchema, addMemberToItemSchema } = require('../schemas/checklist-item-member.schema');

const checklistItemControllers = require('../controllers/checklist-item-member.controller');

/**
 * @swagger
 * /checklists/{checklistId}/checklist-items/{checklistItemId}/members:
 *   get:
 *     summary: Get assigned members of a checklist item
 *     description: |
 *       Returns a list of project members assigned to a specific checklist item.
 *       - **Only project members can be assigned.**
 *
 *       ### Authorization & Access Rules
 *       - Requires a valid Bearer access token.
 *       - All path parameters must be UUIDs.
 *       - The requester must be a member of the project (any role).
 *
 *     tags:
 *       - checklist-item-member
 *     security:
 *       - bearerAuth: []
 *     parameters:
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
 *     responses:
 *       200:
 *         description: List of assigned checklist item members
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 checklistItemMembers:
 *                   type: array
 *                   items:
 *                      $ref: '#/components/schemas/ChecklistItemMemberAdded'
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       403:
 *         description: Forbidden - User is not a member of the project
 *       404:
 *         description: Checklist item not found
 */
router.get('/:checklistId/checklist-items/:checklistItemId/members',
  validateSession,
  validatorHandler(checklistItemSchema, 'params'),
  checkProjectMembershipByChecklist,
  checklistItemControllers.getAllChecklistItemMembers
);

/**
 * @swagger
 * /checklists/{checklistId}/checklist-items/{checklistItemId}/members:
 *   post:
 *     summary: Add members to a checklist item
 *     description: |
 *       Assigns one or more project members to a specific checklist item.
 *       - Already-assigned members will be ignored (no duplicates).
 *
 *       ### Authorization & Access Rules
 *       - Requires Bearer token.
 *       - All params must be valid UUIDs.
 *       - Requester must be a member of the project (any role).
 *
 *     tags:
 *       - checklist-item-member
 *     security:
 *       - bearerAuth: []
 *     parameters:
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
 *               projectMemberIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uuid
 *                 example: [
 *                   "8942a2d8-02c8-464e-8a9a-2d5b8c839ea3",
 *                   "26de1037-0474-4e11-bca1-ec344376744b"
 *                 ]
 *     responses:
 *       201:
 *         description: Members were successfully assigned to the checklist item
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 checklistItemMemberAdded:
 *                   type: array
 *                   items:
 *                      $ref: '#/components/schemas/ChecklistItemMemberAdded'
 *       400:
 *         description: Bad request - Invalid or missing body
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       403:
 *         description: Forbidden - Not a project member
 *       404:
 *         description: Checklist item not found
 */
router.post('/:checklistId/checklist-items/:checklistItemId/members',
  validateSession,
  validatorHandler(checklistItemSchema, 'params'),
  validatorHandler(addMemberToItemSchema, 'body'),
  checkProjectMembershipByChecklist,
  checklistItemControllers.addMemberToChecklistItem
);

/**
 * @swagger
 * /checklists/{checklistId}/checklist-items/{checklistItemId}/members/{projectMemberId}:
 *   delete:
 *     summary: Remove a member from a checklist item
 *     description: |
 *       Removes a specific member assigned to a checklist item.
 *
 *       ### Authorization & Access Rules
 *       - Requires Bearer token.
 *       - All params must be valid UUIDs.
 *       - Requester must be a member of the project (any role).
 *
 *     tags:
 *       - checklist-item-member
 *     security:
 *       - bearerAuth: []
 *     parameters:
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
 *       - in: path
 *         name: projectMemberId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID of the project member to remove from the item
 *     responses:
 *       200:
 *         description: The checklist item member was successfully removed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: The checklist item member was successfully removed
 *                 deletedMember:
 *                   type: integer
 *                   example: 1
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       403:
 *         description: Forbidden - Not a project member
 *       404:
 *         description: Checklist item member not found
 */
router.delete('/:checklistId/checklist-items/:checklistItemId/members/:projectMemberId',
  validateSession,
  validatorHandler(checklistItemMemberSchema, 'params'),
  checkProjectMembershipByChecklist,
  checklistItemControllers.deleteChecklistItemMember
);

module.exports = router;
