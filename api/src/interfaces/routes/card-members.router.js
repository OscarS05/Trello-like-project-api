const router = require('./card-attachments.router');

const { validateSession } = require('../middlewares/authentication.handler');
const { validatorHandler } = require('../middlewares/validator.handler');
const { checkAdminRoleInProjectByCard, checkProjectMembershipByCard } = require('../middlewares/authorization/card.authorization');
const { cardIdSchema, cardMemberSchema } = require('../schemas/card-member.schema');

const cardMemberControllers = require('../controllers/card-member.controller');

/**
 * @swagger
 * /cards/{cardId}/members:
 *   get:
 *     summary: Get all members of a card
 *     description: |
 *       This endpoint retrieves all members assigned to a specific card.
 *
 *       ### Authorization & Access Rules
 *
 *       - Requires a valid Bearer access token.
 *       - `cardId` must be a valid UUID.
 *       - The user must belong to the project.
 *       - If access is denied or the card is not found, appropriate error codes will be returned.
 *
 *     tags:
 *       - card-member
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cardId
 *         required: true
 *         description: ID of the card to retrieve members from
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Card members successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 cardMembers:
 *                   type: array
 *                   items:
 *                      $ref: '#/components/schemas/CardMemberResponse'
 *       401:
 *         description: Invalid or missing token
 *       403:
 *         description: User does not have permission to access the project
 *       404:
 *         description: Card not found
 */
router.get('/:cardId/members',
  validateSession,
  validatorHandler(cardIdSchema, 'params'),
  checkProjectMembershipByCard,
  cardMemberControllers.getAllCardMembers
);

/**
 * @swagger
 * /cards/{cardId}/members/{projectMemberId}:
 *   post:
 *     summary: Add a member to a card
 *     description: |
 *       This endpoint allows adding a project member to a specific card.
 *
 *       ### Authorization & Access Rules
 *
 *       - Requires a valid Bearer access token.
 *       - `cardId` and `projectMemberId` must be valid UUIDs.
 *       - The user making the request must be an **admin** or **owner** of the project.
 *       - Only members already part of the project can be added to a card.
 *       - If access is denied or the IDs are invalid, appropriate error codes will be returned.
 *
 *     tags:
 *       - card-member
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cardId
 *         required: true
 *         description: ID of the card to which the member will be added
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: path
 *         name: projectMemberId
 *         required: true
 *         description: ID of the project member to be added to the card
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       201:
 *         description: Member successfully added to the card
 *         content:
 *           application/json:
 *             schema:
 *                type: object
 *                properties:
 *                    newMember:
 *                        $ref: '#/components/schemas/CardMemberResponse'
 *       401:
 *         description: Invalid or missing token
 *       403:
 *         description: User does not have permission to add members to the card
 *       404:
 *         description: Card or project member not found
 *       409:
 *         description: Member is already assigned to the card
 */
router.post('/:cardId/members/:projectMemberId',
  validateSession,
  validatorHandler(cardMemberSchema, 'params'),
  checkAdminRoleInProjectByCard,
  cardMemberControllers.addMemberToCard
);

/**
 * @swagger
 * /cards/{cardId}/members/{projectMemberId}:
 *   delete:
 *     summary: Remove a member from a card
 *     description: |
 *       This endpoint allows removing a project member from a specific card.
 *
 *       ### Authorization & Access Rules
 *
 *       - Requires a valid Bearer access token.
 *       - `cardId` and `projectMemberId` must be valid UUIDs.
 *       - The user making the request must be an **admin** or **owner** of the project.
 *       - If access is denied or the member is not part of the card, appropriate error codes will be returned.
 *
 *     tags:
 *       - card-member
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cardId
 *         required: true
 *         description: ID of the card from which the member will be removed
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: path
 *         name: projectMemberId
 *         required: true
 *         description: ID of the project member to be removed from the card
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Member successfully removed from the card
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
 *         description: User does not have permission to remove members from the card
 *       404:
 *         description: Card or project member not found
 */
router.delete('/:cardId/members/:projectMemberId',
  validateSession,
  validatorHandler(cardMemberSchema, 'params'),
  checkAdminRoleInProjectByCard,
  cardMemberControllers.deleteCardMember
);

module.exports = router;
