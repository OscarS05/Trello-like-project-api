const router = require('./workspace-members.router');

const { workspaceIdSchema } = require('../schemas/workspace.schema');
const {
  createProject,
  updateProject,
  projectIdSchema,
  projectId,
} = require('../schemas/project.schema');
const {
  checkWorkspaceMembership,
} = require('../middlewares/authorization/workspace.authorization');
const {
  checkProjectMembershipByUserId,
  validateProjectReadPermission,
} = require('../middlewares/authorization/project.authorization');

const {
  uploadProjectBackgroundImage,
} = require('../middlewares/upload-files.handler');
const { validatorHandler } = require('../middlewares/validator.handler');
const { validateSession } = require('../middlewares/authentication.handler');
const {
  authorizationToCreateProject,
  checkAdminRole,
  checkOwnership,
} = require('../middlewares/authorization/project.authorization');

const projectControllers = require('../controllers/project.controller');

/**
 * @swagger
 * /workspaces/projects/{projectId}/board:
 *   get:
 *     summary: Get all board information for a project
 *     description: >
 *       Returns all project information including lists and cards. This endpoint is designed to serve a complete snapshot of a Trello-like board, showing all lists and summarized card data.
 *
 *       Requires access token and membership permissions. Visibility restrictions apply.
 *     tags: [project]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID of the project
 *     responses:
 *       200:
 *         description: Full board data for the given project
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProjectBoardResponse'
 *       400:
 *         description: Invalid projectId format
 *       401:
 *         description: Access token missing, expired or invalid
 *       403:
 *         description: User does not belong to the project or workspace
 *       404:
 *         description: Project not found
 */
router.get(
  '/projects/:projectId/board',
  validateSession,
  validatorHandler(projectId, 'params'),
  validateProjectReadPermission,
  projectControllers.getAllprojectInformation
);

/**
 * @swagger
 * /workspaces/{workspaceId}/projects:
 *   get:
 *     summary: Get all projects from a specific workspace
 *     description: Retrieves all projects that belong to a specific workspace, only if the authenticated user is a member of that workspace.
 *     tags:
 *       - project
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: workspaceId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID of the workspace to retrieve projects from.
 *     responses:
 *       200:
 *         description: A list of projects from the given workspace.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 projects:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Project'
 *       400:
 *         description: Invalid workspaceId format.
 *       401:
 *         description: Missing or invalid access token.
 *       403:
 *         description: You do not belong to the workspace.
 */
router.get(
  '/:workspaceId/projects',
  validateSession,
  validatorHandler(workspaceIdSchema, 'params'),
  checkWorkspaceMembership,
  projectControllers.getProjectsByWorkspace
);

/**
 * @swagger
 * /workspaces/{workspaceId}/projects:
 *   post:
 *     summary: Create a new project in a specific workspace
 *     description: Creates a project inside the given workspace. Only members of the workspace are allowed to perform this action. Users are subject to project creation limits based on their system role (basic or premium).
 *     tags:
 *       - project
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: workspaceId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID of the workspace where the project will be created.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              $ref: '#/components/schemas/CreateProjectRequest'
 *     responses:
 *       201:
 *         description: Project created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Project created successfully
 *                 projectCreated:
 *                   $ref: '#/components/schemas/Project'
 *       400:
 *         description: Invalid request body or workspaceId.
 *       401:
 *         description: Missing, invalid, do not match with stored token in redis or not provided access token.
 *       403:
 *         description: User is not a member of the workspace or has reached the project limit.
 */
router.post(
  '/:workspaceId/projects',
  validateSession,
  validatorHandler(createProject, 'body'),
  checkWorkspaceMembership,
  authorizationToCreateProject,
  projectControllers.createProject
);

/**
 * @swagger
 * /workspaces/{workspaceId}/projects/{projectId}:
 *   patch:
 *     summary: Update a project's name and visibility
 *     description: Allows an admin or the project owner to update a project's name and visibility. `backgroundUrl` and `owner` changes must be done through other endpoints.
 *     tags:
 *       - project
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: workspaceId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID of the workspace.
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID of the project to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProjectRequest'
 *     responses:
 *       200:
 *         description: Project updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Project updated successfully
 *                 updatedProject:
 *                   $ref: '#/components/schemas/Project'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         description: Project not found
 */
router.patch(
  '/:workspaceId/projects/:projectId',
  validateSession,
  validatorHandler(projectIdSchema, 'params'),
  validatorHandler(updateProject, 'body'),
  checkAdminRole,
  projectControllers.updateProject
);

/**
 * @swagger
 * /workspaces/{workspaceId}/projects/{projectId}/background:
 *   patch:
 *     summary: Update project background image
 *     tags: [project]
 *     description: |
 *        Allows admins or owners to update the background image of a project using a file upload.
 *        - Supported file types: **jpg, png, avif, jpeg, svg, webp, gif**.
 *        - Maximum file size: **5MB**.
 *        - Files must be sent as `multipart/form-data` using the field name `background-image`.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: workspaceId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID of the workspace.
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID of the project to update.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - background-image
 *             properties:
 *               background-image:
 *                 type: string
 *                 format: binary
 *                 description: Image file to be used as the new background.
 *     responses:
 *       200:
 *         description: Project updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Bakground image queued successfully
 *                 job:
 *                   type: string
 *                   example: 14
 *
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
router.patch(
  '/:workspaceId/projects/:projectId/background',
  validateSession,
  validatorHandler(projectIdSchema, 'params'),
  checkAdminRole,
  uploadProjectBackgroundImage,
  projectControllers.updateBackgroundProject
);

/**
 * @swagger
 * /workspaces/{workspaceId}/projects/{projectId}:
 *   delete:
 *     summary: Delete a project
 *     tags: [project]
 *     description: Permanently deletes a project and its associated background image from Cloudinary. Only the project owner can perform this action.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: workspaceId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID of the workspace.
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID of the project to delete.
 *     responses:
 *       200:
 *         description: Project deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Project deleted successfully
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.delete(
  '/:workspaceId/projects/:projectId',
  validateSession,
  validatorHandler(projectIdSchema, 'params'),
  checkOwnership,
  projectControllers.deleteProject
);

module.exports = router;
