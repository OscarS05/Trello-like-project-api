const express = require('express');

const router = express.Router();

const { validateSession } = require('../middlewares/authentication.handler');
const { validatorHandler } = require('../middlewares/validator.handler');
const {
  validateListAuthorization,
  validateProjectReadPermission,
} = require('../middlewares/authorization/list.authorization');
const {
  validateCardAuthorization,
} = require('../middlewares/authorization/card.authorization');
const { listIdSchema } = require('../schemas/list.schema');
const {
  cardSchemas,
  createCardSchema,
  updateCardSchema,
} = require('../schemas/card.schema');

const cardControllers = require('../controllers/card.controller');

/**
 * @swagger
 * /lists/{listId}/cards/{cardId}/information:
 *   get:
 *     summary: Get full detailed information about a card
 *     description: |
 *       This endpoint retrieves full, non-summarized information about a specific card.
 *       It includes: labels, assigned members (cardMembers), attachments, checklists, checklist items, and each item's members.
 *
 *       ### Authorization & Access Rules
 *
 *       - A valid Bearer token is required.
 *       - If the project associated with the list is **private**, only users who are members of that project can access this endpoint.
 *       - If the project visibility is set to **workspace**, any user who is a member of the workspace where the project belongs can access the card.
 *       - If the user does **not** belong to the project or workspace (depending on the visibility), a `403 Forbidden` error will be returned.
 *       - If the list or project is not found, a `404 Not Found` error will be returned.
 *     tags:
 *       - card
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: listId
 *         required: true
 *         description: ID of the list the card belongs to
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: path
 *         name: cardId
 *         required: true
 *         description: ID of the card to retrieve detailed information for
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Full card information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 card:
 *                   $ref: '#/components/schemas/CardWithAllInformation'
 *       401:
 *         description: Invalid or missing token
 *       403:
 *         description: User does not have permission to access the project
 *       404:
 *         description: List or card not found
 */
router.get(
  '/lists/:listId/cards/:cardId/information',
  validateSession,
  validatorHandler(cardSchemas, 'params'),
  validateProjectReadPermission,
  cardControllers.getAllCardInformation,
);

/**
 * @swagger
 * /lists/{listId}/cards:
 *   get:
 *     summary: Get all cards from a specific list
 *     description: |
 *       This endpoint returns all cards belonging to a given list.
 *
 *       ### Authorization & Access Rules
 *
 *       - Requires a valid Bearer access token.
 *       - The `listId` must be a valid UUID.
 *       - The user must belong to the project that contains the list.
 *       - If the user does not have the required access, a `403 Forbidden` error is returned.
 *       - If the list does not exist, a `404 Not Found` error is returned.
 *     tags:
 *       - card
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: listId
 *         required: true
 *         description: ID of the list whose cards you want to retrieve
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: List of cards successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 cards:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Card'
 *       401:
 *         description: Invalid or missing token
 *       403:
 *         description: User does not have permission to access the project
 *       404:
 *         description: List not found
 */
router.get(
  '/lists/:listId/cards',
  validateSession,
  validatorHandler(listIdSchema, 'params'),
  validateListAuthorization,
  cardControllers.getCards,
);

/**
 * @swagger
 * /lists/{listId}/cards:
 *   post:
 *     summary: Create a new card in a list
 *     description: |
 *       This endpoint allows you to create a new card that belongs to a specific list.
 *
 *       ### Authorization & Access Rules
 *
 *       - Requires a valid Bearer access token.
 *       - The `listId` must be a valid UUID.
 *       - The user must belong to the project that contains the list.
 *       - If the user does not have the required access, a `403 Forbidden` error is returned.
 *       - If the list does not exist, a `404 Not Found` error is returned.
 *     tags:
 *       - card
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: listId
 *         required: true
 *         description: ID of the list where the card will be created
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCard'
 *     responses:
 *       201:
 *         description: Card successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 newCard:
 *                   $ref: '#/components/schemas/Card'
 *       400:
 *         description: Invalid request body
 *       401:
 *         description: Invalid or missing token
 *       403:
 *         description: User does not have permission to access the project
 *       404:
 *         description: List not found
 */
router.post(
  '/lists/:listId/cards',
  validateSession,
  validatorHandler(listIdSchema, 'params'),
  validatorHandler(createCardSchema, 'body'),
  validateListAuthorization,
  cardControllers.createCard,
);

/**
 * @swagger
 * /lists/{listId}/cards/{cardId}:
 *   patch:
 *     summary: Update a card
 *     description: |
 *       This endpoint allows updating the name and description of a specific card.
 *
 *       ### Authorization & Access Rules
 *
 *       - Requires a valid Bearer access token.
 *       - `listId` and `cardId` must be valid UUIDs.
 *       - The user must belong to the project that contains the list.
 *       - If access is denied or the card is not found, appropriate error codes will be returned.
 *
 *     tags:
 *       - card
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: listId
 *         required: true
 *         description: ID of the list containing the card
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: path
 *         name: cardId
 *         required: true
 *         description: ID of the card to be updated
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateCard'
 *     responses:
 *       200:
 *         description: Card successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 updatedCard:
 *                   $ref: '#/components/schemas/Card'
 *       400:
 *         description: Invalid request body
 *       401:
 *         description: Invalid or missing token
 *       403:
 *         description: User does not have permission to access the project
 *       404:
 *         description: List or card not found
 */
router.patch(
  '/lists/:listId/cards/:cardId',
  validateSession,
  validatorHandler(cardSchemas, 'params'),
  validatorHandler(updateCardSchema, 'body'),
  validateCardAuthorization,
  cardControllers.updateCard,
);

/**
 * @swagger
 * /lists/{listId}/cards/{cardId}:
 *   delete:
 *     summary: Delete a card
 *     description: |
 *       This endpoint allows deleting a specific card from a list.
 *
 *       ### Authorization & Access Rules
 *
 *       - Requires a valid Bearer access token.
 *       - `listId` and `cardId` must be valid UUIDs.
 *       - The user must belong to the project
 *       - If access is denied or the card is not found, appropriate error codes will be returned.
 *
 *     tags:
 *       - card
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: listId
 *         required: true
 *         description: ID of the list containing the card
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: path
 *         name: cardId
 *         required: true
 *         description: ID of the card to be deleted
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Card successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 deletedCard:
 *                   type: integer
 *                   example: 1
 *       401:
 *         description: Invalid or missing token
 *       403:
 *         description: User does not have permission to access the project
 *       404:
 *         description: List or card not found
 */
router.delete(
  '/lists/:listId/cards/:cardId',
  validateSession,
  validatorHandler(cardSchemas, 'params'),
  validateCardAuthorization,
  cardControllers.deleteCard,
);

module.exports = router;
