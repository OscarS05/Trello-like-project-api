const router = require('./workspace.router');

const { workspaceIdSchema } = require('../schemas/workspace.schema');
const {
  createWorkspaceMember,
  updateWorkspaceMember,
  updateWorkspaceMemberIdParams,
  removeMember,
} = require('../schemas/workspace-member.schema');

const { validatorHandler } = require('../middlewares/validator.handler');
const { validateSession } = require('../middlewares/authentication.handler');
const {
  checkAdminRole,
  checkOwnership,
  checkWorkspaceMembership,
} = require('../middlewares/authorization/workspace.authorization');

const workspaceMemberController = require('../controllers/workspace-member.controller');

/**
 * @swagger
 * /workspaces/{workspaceId}/members:
 *   get:
 *     summary: Get members of a workspace
 *     description: |
 *       Retrieves the list of members belonging to a specific workspace.

 *       **Requirements:**
 *       - The `Authorization` header **must contain a valid access token** in the format: `Bearer <accessToken>`.
 *       - The user making the request **must be a member** of the specified workspace.
 *       - The `workspaceId` must be a valid UUID and refer to an existing workspace.

 *       **Response:**
 *       This endpoint returns an array of members with their metadata, including:
 *       - Basic user information (username, role, etc.)
 *       - A list of teams the user belongs to within the workspace
 *       - A list of projects the user is participating in
 *
 *       This structure is designed to provide all the necessary data the frontend may require
 *       when rendering the members list in a table view.

 *     tags:
 *       - workspace-member
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: workspaceId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the workspace whose members will be listed.
 *     responses:
 *       200:
 *         description: List of members retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WorkspaceMembersResponse'
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
  '/:workspaceId/members',
  validateSession,
  validatorHandler(workspaceIdSchema, 'params'),
  checkWorkspaceMembership,
  workspaceMemberController.getworkspaceMembers,
);

/**
 * @swagger
 * /workspaces/{workspaceId}/members:
 *   post:
 *     summary: Add a member to a workspace
 *     description: |
 *       Adds a user to a specified workspace.

 *       **Requirements:**
 *       - The `Authorization` header **must contain a valid access token** in the format: `Bearer <accessToken>`.
 *       - The `workspaceId` must be a valid UUID and correspond to an existing workspace.
 *       - The request body must include a valid `userId` (UUID) of the user to add.
 *       - The requester must be the **owner** or an **admin** of the workspace.

 *       **Errors that may occur:**
 *       - Access token is missing, expired or invalid.
 *       - The workspace ID is not a UUID or the workspace does not exist.
 *       - The user to be added does not exist.
 *       - The requester does not have sufficient permissions.
 *
 *     tags:
 *       - workspace-member
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: workspaceId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the workspace to which the user will be added.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddWorkspaceMemberBody'
 *     responses:
 *       201:
 *         description: Member added successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AddWorkspaceMemberResponse'
 *       400:
 *         description: Invalid input. Workspace ID or user ID not valid.
 *       401:
 *         description: Unauthorized. Access token is missing or invalid.
 *       403:
 *         description: Forbidden. User does not have permission to add members.
 *       404:
 *         description: Workspace or user not found.
 */
router.post(
  '/:workspaceId/members',
  validateSession,
  validatorHandler(workspaceIdSchema, 'params'),
  validatorHandler(createWorkspaceMember, 'body'),
  checkAdminRole,
  workspaceMemberController.addMemberToWorkspace,
);

/**
 * @swagger
 * /workspaces/{workspaceId}/members/{workspaceMemberId}:
 *   patch:
 *     summary: Update a workspace member's role
 *     description: >
 *       This endpoint updates the role of a member within a specific workspace.
 *       **Only users with admin or owner roles** can perform this action.
 *       It does **not** allow updating a member to or from the "owner" role—this is handled by a separate endpoint.
 *     tags:
 *       - workspace-member
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: workspaceId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the workspace
 *       - name: workspaceMemberId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the workspace member whose role will be updated
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateWorkspaceMemberBody'
 *     responses:
 *       200:
 *         description: Member role updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Updated successfully
 *                 updatedMember:
 *                   $ref: '#/components/schemas/WorkspaceMember'
 *       400:
 *         description: Validation error (e.g. invalid UUID or missing role)
 *       401:
 *         description: Unauthorized - access token missing, invalid, or expired
 *       403:
 *         description: Forbidden - user is not admin or owner of the workspace
 *       404:
 *         description: Workspace or member not found
 */
router.patch(
  '/:workspaceId/members/:workspaceMemberId',
  validateSession,
  validatorHandler(updateWorkspaceMemberIdParams, 'params'),
  validatorHandler(updateWorkspaceMember, 'body'),
  checkAdminRole,
  workspaceMemberController.changeRoleToMember,
);

/**
 * @swagger
 * /workspaces/{workspaceId}/members/{workspaceMemberId}/ownership:
 *   patch:
 *     summary: Transfer ownership of a workspace to another member
 *     description: >
 *       Allows the current **owner** of a workspace to transfer ownership to another existing member within the same workspace.
 *       Only the current owner can perform this action.
 *     tags:
 *       - workspace-member
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: workspaceId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the workspace
 *       - name: workspaceMemberId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the workspace member to whom ownership will be transferred
 *     responses:
 *       200:
 *         description: Ownership transferred successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: The workspace member was updated to owner in the workspace
 *                 updatedWorkspaceMember:
 *                   type: array
 *                   items:
 *                     type: integer
 *                   example: [1]
 *       400:
 *         description: Validation error (e.g. invalid UUID)
 *       401:
 *         description: Unauthorized - access token missing, invalid, expired, or not matched with Redis
 *       403:
 *         description: Forbidden - only the current owner can transfer ownership
 *       404:
 *         description: Workspace or member not found
 *       409:
 *         description: The member to be updated as workspace owner already has the owner role
 */
router.patch(
  '/:workspaceId/members/:workspaceMemberId/ownership',
  validateSession,
  validatorHandler(updateWorkspaceMemberIdParams, 'params'),
  checkOwnership,
  workspaceMemberController.transferOwnership,
);

/**
 * @swagger
 * /workspaces/{workspaceId}/members/{workspaceMemberId}:
 *   delete:
 *     summary: Remove a workspace member or allow a member to leave the workspace
 *     description: >
 *       This endpoint allows for two use cases:
 *       - An **admin or the owner** can remove another member from the workspace.
 *       - A **regular member** can use this endpoint to leave the workspace themselves.
 *
 *       The system validates that the `workspaceMemberId` exists in the given workspace, and performs a set of business logic rules before deletion:
 *       - It checks that the workspace, and any related projects or teams the user belongs to, have other members.
 *       - If the user being removed is the only member of a project or team, deletion will be blocked to avoid orphaned entities.
 *       - If possible, ownership of any project, team, or the workspace itself is automatically transferred to another existing member before deletion.
 *
 *       This ensures data integrity and avoids orphaned entities within the system.
 *     tags:
 *       - workspace-member
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: workspaceId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the workspace
 *       - name: workspaceMemberId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the workspace member to be removed
 *     responses:
 *       200:
 *         description: Member was removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Member was removed successfully
 *       400:
 *         description: Validation error (e.g. invalid UUID format)
 *       401:
 *         description: Unauthorized - access token missing, expired, invalid, or does not match session
 *       403:
 *         description: Forbidden - requester is not the workspace owner
 *       404:
 *         description: Workspace or workspace member not found
 *       409:
 *         description: Conflict - cannot delete member because related projects or teams would be left without members
 */
router.delete(
  '/:workspaceId/members/:workspaceMemberId',
  validateSession,
  validatorHandler(removeMember, 'params'),
  checkWorkspaceMembership,
  workspaceMemberController.removeMember,
);

module.exports = router;
