const router = require('./team-member.router');

const { projectIdSchema } = require('../schemas/project.schema');
const {
  listNameSchema,
  updateListSchema,
  listSchema,
} = require('../schemas/list.schema');
const {
  checkProjectMembership,
} = require('../middlewares/authorization/project.authorization');
const { validatorHandler } = require('../middlewares/validator.handler');
const { validateSession } = require('../middlewares/authentication.handler');

const listControllers = require('../controllers/list.controller');

/**
 * @swagger
 * /workspaces/{workspaceId}/projects/{projectId}/lists:
 *   get:
 *     summary: Get all lists from a project, including their cards
 *     description: >
 *       Returns all **lists** belonging to a project, along with all **cards** inside each list.
 *       Requires a valid **Bearer access token**.
 *       The requester **must be a member of the project**, regardless of role.
 *     tags:
 *       - list
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: workspaceId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the workspace
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the project
 *     responses:
 *       200:
 *         description: Lists fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 lists:
 *                   type: array
 *                   items:
 *                      $ref: '#/components/schemas/ListWithCards'
 *       401:
 *         description: Unauthorized – Missing or invalid access token
 *       403:
 *         description: Forbidden – User is not a project member
 *       404:
 *         description: Not Found – Project or workspace not found
 *       500:
 *         description: Internal Server Error
 */
router.get(
  '/:workspaceId/projects/:projectId/lists',
  validateSession,
  validatorHandler(projectIdSchema, 'params'),
  checkProjectMembership,
  listControllers.getLists,
);

/**
 * @swagger
 * /workspaces/{workspaceId}/projects/{projectId}/lists:
 *   post:
 *     summary: Create a new list in a project
 *     description: >
 *       This endpoint allows any member of a project to create a new list within the specified project.
 *       Require bearer accessToken in lock icon.
 *       The request body must contain a valid list name.
 *     tags: [list]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: workspaceId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NameOnly'
 *     responses:
 *       201:
 *         description: List created successfully
 *         content:
 *           application/json:
 *             schema:
 *                type: object
 *                properties:
 *                    newList:
 *                        $ref: '#/components/schemas/list'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post(
  '/:workspaceId/projects/:projectId/lists',
  validateSession,
  validatorHandler(projectIdSchema, 'params'),
  validatorHandler(listNameSchema, 'body'),
  checkProjectMembership,
  listControllers.createList,
);

/**
 * @swagger
 * /workspaces/{workspaceId}/projects/{projectId}/lists/{listId}:
 *   patch:
 *     summary: Update a list
 *     description: >
 *       This endpoint allows any member of a project to update the name of a specific list within that project.
 *       Only the list's name can be modified. The user must be authenticated and be a member of the project.
 *     tags: [list]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: workspaceId
 *         required: true
 *         description: The ID of the workspace that contains the project
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: path
 *         name: projectId
 *         required: true
 *         description: The ID of the project that contains the list
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: path
 *         name: listId
 *         required: true
 *         description: The ID of the list to update
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewName'
 *     responses:
 *       200:
 *         description: List name updated successfully
 *         content:
 *           application/json:
 *             schema:
 *                type: object
 *                properties:
 *                  updatedList:
 *                      $ref: '#/components/schemas/list'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized – missing or invalid bearer token
 *       403:
 *         description: Forbidden – requester is not a member of the project
 */
router.patch(
  '/:workspaceId/projects/:projectId/lists/:listId',
  validateSession,
  validatorHandler(listSchema, 'params'),
  validatorHandler(updateListSchema, 'body'),
  checkProjectMembership,
  listControllers.updateList,
);

/**
 * @swagger
 * /workspaces/{workspaceId}/projects/{projectId}/lists/{listId}:
 *   delete:
 *     summary: Delete a list from a project
 *     description: >
 *       This endpoint allows any member of a project to delete a specific list within that project.
 *       The requester must be authenticated and be a member of the project, regardless of their role.
 *     tags: [list]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: workspaceId
 *         required: true
 *         description: ID of the workspace that contains the project
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: path
 *         name: projectId
 *         required: true
 *         description: ID of the project that contains the list
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: path
 *         name: listId
 *         required: true
 *         description: ID of the list to be deleted
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: List successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: The list was deleted successfully
 *                 deletedList:
 *                   type: integer
 *                   example: 1
 *       400:
 *         description: Invalid input or parameters
 *       401:
 *         description: Unauthorized – missing or invalid bearer token
 *       403:
 *         description: Forbidden – requester is not a member of the project
 */
router.delete(
  '/:workspaceId/projects/:projectId/lists/:listId',
  validateSession,
  validatorHandler(listSchema, 'params'),
  checkProjectMembership,
  listControllers.deleteList,
);

module.exports = router;
