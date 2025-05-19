const express = require('express');

const router = express.Router();

const {
  createWorkspace,
  updateWorkspace,
  workspaceIdSchema,
} = require('../schemas/workspace.schema');
const { validatorHandler } = require('../middlewares/validator.handler');
const { validateSession } = require('../middlewares/authentication.handler');
const {
  authorizationToCreateWorkspace,
  checkAdminRole,
  checkOwnership,
  checkWorkspaceMembership,
} = require('../middlewares/authorization/workspace.authorization');

const workspaceControllers = require('../controllers/workspace.controller');

/**
 * @swagger
 * /workspaces/{workspaceId}:
 *   get:
 *     summary: Get a workspace and its projects
 *     description: |
 *       Returns the data of a specific workspace along with all the projects that belong to it.
 *
 *       Each project in the response includes an `access` field that indicates whether the user has permission to access the project.
 *       A user can have access to a project even if they are not a direct member of it, depending on the project's `visibility`:
 *       - If the project visibility is set to `workspace`, all workspace members will have access to it, regardless of whether they were added individually to the project.
 *       - If the visibility is `private`, only users explicitly added to the project will have access.
 *
 *       **Requirements:**
 *       - The `Authorization` header **must contain a valid access token** in the format: `Bearer <accessToken>`.
 *       - The user **must be a member** of the workspace; otherwise, access is denied.
 *
 *       This endpoint is useful for displaying all the projects related to a workspace the user has access to.
 *     tags:
 *       - workspace
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: workspaceId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the workspace to retrieve.
 *     responses:
 *       200:
 *         description: Workspace and its projects retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/WorkspaceWithProjects'
 *       400:
 *         description: Invalid workspace ID format.
 *       401:
 *         description: Unauthorized. Missing or invalid access token.
 *       403:
 *         description: Forbidden. User is not a member of the workspace.
 *       404:
 *         description: Workspace not found.
 */
router.get(
  '/:workspaceId',
  validateSession,
  validatorHandler(workspaceIdSchema, 'params'),
  checkWorkspaceMembership,
  workspaceControllers.getWorkspaceAndItsProjects,
);

/**
 * @swagger
 * /workspaces:
 *   get:
 *     summary: Get all workspaces and their projects for the logged-in user
 *     description: |
 *       Retrieves all the workspaces that the authenticated user is a member of, along with the projects that belong to each workspace.
 *
 *       This endpoint is typically used to populate the dashboard with all the workspaces and projects visible to the user (similar to Trello's homepage).
 *
 *       Each project includes an `access` field which indicates whether the authenticated user has permission to access it:
 *       - If the project visibility is set to `workspace`, all workspace members will have access.
 *       - If the visibility is `private`, only users explicitly added to the project will have access.
 *
 *       **Requirements:**
 *       - The `Authorization` header **must contain a valid access token** in the format: `Bearer <accessToken>`.
 *
 *       **Behavior:**
 *       - If the user does not exist, an error will be returned.
 *       - If the user is not a member of any workspace, the response will be an empty array.
 *       - Otherwise, it returns an array of workspaces, each with its corresponding projects.
 *     tags:
 *       - workspace
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Workspaces and their projects retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GetWorkspaceAndProjectsResponse'
 *       401:
 *         description: Unauthorized. Missing or invalid access token.
 *       404:
 *         description: User not found.
 */
router.get('/', validateSession, workspaceControllers.getWorkspacesAndProjects);

/**
 * @swagger
 * /workspaces:
 *   post:
 *     summary: Create a new workspace
 *     description: |
 *       Creates a new workspace for the authenticated user.
 *
 *       **Requirements:**
 *       - The `Authorization` header **must contain a valid access token** in the format: `Bearer <accessToken>`.
 *       - The user **must not exceed the workspace creation limit** defined by their system role:
 *         - `basic`: maximum of **8** workspaces.
 *         - `premium`: maximum of **30** workspaces.
 *
 *       **Behavior:**
 *       - Any authenticated user can create a workspace, unless they have reached the limit based on their subscription role.
 *       - If the user does not exist or exceeds the workspace limit, an appropriate error is returned.
 *
 *     tags:
 *       - workspace
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              $ref: '#/components/schemas/CreateWorkspaceBody'
 *     responses:
 *       201:
 *         description: Workspace created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WorkspaceCreatedResponse'
 *       401:
 *         description: Unauthorized. User not authenticated.
 *       403:
 *         description: Forbidden. Workspace limit reached for the user role.
 *       404:
 *         description: User not found.
 */
router.post(
  '/',
  validateSession,
  authorizationToCreateWorkspace,
  validatorHandler(createWorkspace, 'body'),
  workspaceControllers.createWorkspace,
);

/**
 * @swagger
 * /workspaces/{workspaceId}:
 *   patch:
 *     summary: Update a workspace
 *     description: |
 *       Updates the name and/or description of a specific workspace.

 *       **Requirements:**
 *       - The `Authorization` header **must contain a valid access token** in the format: `Bearer <accessToken>`.
 *       - The user must be an **admin or the owner** of the workspace.
 *       - The `name` field is **required**, even if it's not being changed. This ensures at least one valid field is submitted for the update.

 *     tags:
 *       - workspace
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: workspaceId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the workspace to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateWorkspaceBody'
 *     responses:
 *       200:
 *         description: Workspace updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WorkspaceUpdatedResponse'
 *       400:
 *         description: Invalid input data or schema validation failed.
 *       401:
 *         description: Unauthorized. Missing or invalid access token.
 *       403:
 *         description: Forbidden. User is not admin or owner of the workspace.
 *       404:
 *         description: Workspace not found.
 */
router.patch(
  '/:workspaceId',
  validateSession,
  validatorHandler(workspaceIdSchema, 'params'),
  validatorHandler(updateWorkspace, 'body'),
  checkAdminRole,
  workspaceControllers.updateWorkspace,
);

/**
 * @swagger
 * /workspaces/{workspaceId}:
 *   delete:
 *     summary: Delete a workspace
 *     description: |
 *       Deletes a specific workspace.

 *       **Requirements:**
 *       - The `Authorization` header **must contain a valid access token** in the format: `Bearer <accessToken>`.
 *       - The user must be the **owner** of the workspace.
 *       - The `workspaceId` must be valid and exist in the system.

 *     tags:
 *       - workspace
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: workspaceId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the workspace to delete.
 *     responses:
 *       200:
 *         description: Workspace deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WorkspaceDeletedResponse'
 *       401:
 *         description: Unauthorized. Missing or invalid access token.
 *       403:
 *         description: Forbidden. Only the owner can delete the workspace.
 *       404:
 *         description: Workspace not found.
 */
router.delete(
  '/:workspaceId',
  validateSession,
  validatorHandler(workspaceIdSchema, 'params'),
  checkOwnership,
  workspaceControllers.deleteWorkspace,
);

module.exports = router;
