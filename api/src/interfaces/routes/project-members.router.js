const router = require('./project.router');

const { validatorHandler } = require('../middlewares/validator.handler');
const { validateSession } = require('../middlewares/authentication.handler');
const { checkProjectMembership, checkAdminRole, checkOwnership } = require('../middlewares/authorization/project.authorization');
const { projectIdSchema } = require('../schemas/project.schema');
const {addProjectMember, roleChangeSchema, projectMemberSchemas, transferOwnership } = require('../schemas/project-members.schema');

const projectMemberController = require('../controllers/project-member.controller');

/**
 * @swagger
 * /workspaces/{workspaceId}/projects/{projectId}/members:
 *   get:
 *     summary: Get project members and assigned teams
 *     description: >
 *       Returns the list of members assigned to the project along with the teams each member belongs to **only if those teams are assigned to the project**.
 *       Also includes a list of teams assigned to the project and their members.
 *       Requires that the requester is a project member.
 *     tags: [project-member]
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
 *         description: UUID of the project.
 *     responses:
 *       200:
 *         description: List of project members and assigned teams
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/ProjectMembersAndTeamsResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get('/:workspaceId/projects/:projectId/members',
  validateSession,
  validatorHandler(projectIdSchema, 'params'),
  checkProjectMembership,
  projectMemberController.getProjectMembers,
);

/**
 * @swagger
 * /workspaces/{workspaceId}/projects/{projectId}/members:
 *   post:
 *     summary: Add a workspace member to a project
 *     description: Only project owners or admins can add a workspace member to a project. The member must belong to the same workspace. This ensures project membership aligns with workspace scope. This endpoint require the bearer accessToken in the lock icon.
 *     tags:
 *       - project-member
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddProjectMemberBody'
 *     responses:
 *       200:
 *         description: Member added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AddedProjectMemberResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.post('/:workspaceId/projects/:projectId/members',
  validateSession,
  validatorHandler(projectIdSchema, 'params'),
  checkAdminRole,
  validatorHandler(addProjectMember, 'body'),
  projectMemberController.addMemberToProject,
);

/**
 * @swagger
 * /workspaces/{workspaceId}/projects/{projectId}/members/{projectMemberId}:
 *   patch:
 *     summary: Change the role of a project member
 *     description: Allows project owner or admins to update the role of a project member between "member" and "admin". The "owner" role cannot be assigned through this endpoint. This endpoint require bearer accessToken in lock icon
 *     tags:
 *       - project-member
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: workspaceId
 *         in: path
 *         required: true
 *         description: UUID of the workspace
 *         schema:
 *           type: string
 *           format: uuid
 *       - name: projectId
 *         in: path
 *         required: true
 *         description: UUID of the project
 *         schema:
 *           type: string
 *           format: uuid
 *       - name: projectMemberId
 *         in: path
 *         required: true
 *         description: UUID of the project member to update
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       description: New role for the project member
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RoleChangeRequest'
 *     responses:
 *       200:
 *         description: Role updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RoleChangeSuccessResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.patch('/:workspaceId/projects/:projectId/members/:projectMemberId',
  validateSession,
  validatorHandler(projectMemberSchemas, 'params'),
  validatorHandler(roleChangeSchema, 'body'),
  checkAdminRole,
  projectMemberController.changeRoleToMember,
);

/**
 * @swagger
 * /workspaces/{workspaceId}/projects/{projectId}/members/{projectMemberId}/ownership:
 *   patch:
 *     summary: Transfer project ownership
 *     description: Allows the current project owner to transfer ownership to another member. Requires a valid access token and that the requester is the current owner of the project.
 *     tags:
 *       - project-member
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: workspaceId
 *         in: path
 *         required: true
 *         description: UUID of the workspace
 *         schema:
 *           type: string
 *           format: uuid
 *       - name: projectId
 *         in: path
 *         required: true
 *         description: UUID of the project
 *         schema:
 *           type: string
 *           format: uuid
 *       - name: projectMemberId
 *         in: path
 *         required: true
 *         description: UUID of the member to whom ownership will be transferred
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Ownership transferred successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OwnershipTransferSuccessResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.patch('/:workspaceId/projects/:projectId/members/:projectMemberId/ownership',
  validateSession,
  validatorHandler(projectMemberSchemas, 'params'),
  checkOwnership,
  projectMemberController.transferOwnership
);

/**
 * @swagger
 * /workspaces/{workspaceId}/projects/{projectId}/members/{projectMemberId}:
 *   delete:
 *     summary: Remove a member from a project
 *     description: This endpoint allows the owner or a project admin to remove another project member. It also allows any project member to remove themselves, which is equivalent to leaving the project. This endpoint requires the bearer accessToken in the lock icon.
 *     tags:
 *       - project-member
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: workspaceId
 *         in: path
 *         required: true
 *         description: UUID of the workspace
 *         schema:
 *           type: string
 *           format: uuid
 *       - name: projectId
 *         in: path
 *         required: true
 *         description: UUID of the project
 *         schema:
 *           type: string
 *           format: uuid
 *       - name: projectMemberId
 *         in: path
 *         required: true
 *         description: UUID of the project member to be removed
 *         schema:
 *           type: string
 *           format: uuid
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
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.delete('/:workspaceId/projects/:projectId/members/:projectMemberId',
  validateSession,
  validatorHandler(projectMemberSchemas, 'params'),
  checkAdminRole,
  projectMemberController.removeMember,
);

module.exports = router;
