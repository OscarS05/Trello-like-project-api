const router = require('./project-members.router');

const { checkWorkspaceMembership } = require('../middlewares/authorization/workspace.authorization');
const { workspaceIdSchema } = require('../schemas/workspace.schema');

const { createTeamScheme, teamIdScheme, updateTeamScheme, asignProjectScheme, unasignProjectScheme } = require('../schemas/team.schema');
const { authorizationToCreateTeam, checkAdminRole, checkAdminRoleToAssign, checkTeamOwnership } = require('../middlewares/authorization/team.authorization');
const { validateSession } = require('../middlewares/authentication.handler');
const { validatorHandler } = require('../middlewares/validator.handler');

const teamControllers = require('../controllers/team.controller');

/**
 * @swagger
 * /workspaces/{workspaceId}/teams:
 *   get:
 *     summary: Get all teams in a workspace
 *     description: >
 *       Returns all the teams that belong to the specified workspace, including their members, assigned projects, and the list of actions the requester is allowed to perform on each team based on their role.
 *       Requires a valid bearer access token and the requester must be a member of the workspace.
 *     tags:
 *       - team
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
 *     responses:
 *       200:
 *         description: List of teams in the workspace along with their members, assigned projects, and requester permissions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 teams:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/TeamWithMembersAndProjects'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get('/:workspaceId/teams',
  validateSession,
  validatorHandler(workspaceIdSchema, 'params'),
  checkWorkspaceMembership,
  teamControllers.getTeamsAndTheirMembersByWorkspace,
);

/**
 * @swagger
 * /workspaces/{workspaceId}/teams:
 *   post:
 *     summary: Create a new team within a workspace
 *     description: >
 *       This endpoint creates a new team within the specified workspace. The requester must be authenticated and must belong to the workspace.
 *       Additional restrictions apply depending on the user's subscription level:
 *       - Basic users can create up to 20 teams
 *       - Premium users can create up to 40 teams
 *     tags:
 *       - team
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: workspaceId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The UUID of the workspace where the team will be created
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTeamBody'
 *     responses:
 *       201:
 *         description: Team successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Team was successfully created
 *                 teamCreated:
 *                   $ref: '#/components/schemas/Team'
 *       400:
 *         description: Bad Request – Invalid data in body or params
 *       401:
 *         description: Unauthorized – Invalid or missing access token
 *       403:
 *         description: Forbidden – Team creation limit exceeded for the user's subscription level
 *       404:
 *         description: Not Found – Workspace does not exist
 *       500:
 *         description: Internal Server Error
 */
router.post('/:workspaceId/teams',
  validateSession,
  validatorHandler(workspaceIdSchema, 'params'),
  validatorHandler(createTeamScheme, 'body'),
  checkWorkspaceMembership,
  authorizationToCreateTeam,
  teamControllers.createTeam,
);

/**
 * @swagger
 * /workspaces/{workspaceId}/teams/{teamId}/projects/{projectId}:
 *   post:
 *     summary: Assign a team to a project
 *     description: >
 *       This endpoint assigns a team to a project.
 *       It also automatically adds the members of the team to the project.
 *       Only users with admin or owner roles in the workspace or project are authorized to perform this action.
 *     tags:
 *       - team
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: workspaceId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the workspace
 *       - in: path
 *         name: teamId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the team to assign
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the project to assign the team to
 *     responses:
 *       200:
 *         description: The team was successfully assigned to the project
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TeamAssignedResponse'
 *       400:
 *         description: Bad Request – Invalid parameter values
 *       401:
 *         description: Unauthorized – Missing or invalid access token
 *       403:
 *         description: Forbidden – User does not have permission to assign the team
 *       404:
 *         description: Not Found – One or more resources were not found
 *       500:
 *         description: Internal Server Error
 */
router.post('/:workspaceId/teams/:teamId/projects/:projectId',
  validateSession,
  validatorHandler(asignProjectScheme, 'params'),
  checkAdminRoleToAssign,
  teamControllers.assignTeamToProject,
);

/**
 * @swagger
 * /workspaces/{workspaceId}/teams/{teamId}:
 *   patch:
 *     summary: Update a team's name
 *     description: >
 *        This endpoint allows updating the name of an existing team.
 *        Only users with admin or owner role in the team are authorized.
 *        Requires a valid bearer access token and UUID parameters.
 *     tags:
 *       - team
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: workspaceId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the workspace the team belongs to
 *       - in: path
 *         name: teamId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the team to update
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
 *                 example: Tesis
 *     responses:
 *       200:
 *         description: Team was successfully updated
 *         content:
 *           application/json:
 *             schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: Team was successfully updated
 *                  updatedTeam:
 *                    $ref: '#/components/schemas/Team'
 *
 *       400:
 *         description: Bad Request – Invalid parameters or body
 *       401:
 *         description: Unauthorized – Missing or invalid access token
 *       403:
 *         description: Forbidden – You do not have permission to update the team
 *       404:
 *         description: Not Found – Team or workspace not found
 *       500:
 *         description: Internal Server Error
 */
router.patch('/:workspaceId/teams/:teamId',
  validateSession,
  validatorHandler(teamIdScheme, 'params'),
  validatorHandler(updateTeamScheme, 'body'),
  checkAdminRole,
  teamControllers.updateProject,
);

/**
 * @swagger
 * /workspaces/{workspaceId}/teams/{teamId}/projects/{projectId}:
 *   delete:
 *     summary: Unassign a team from a project
 *     description: >
 *       This endpoint unassigns a team from a project.
 *       You can optionally remove the team members from the project as well.
 *       Only users with admin or owner role in the workspace/project are authorized.
 *       Requires a valid bearer access token and UUIDs for the parameters.
 *     tags:
 *       - team
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: workspaceId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the workspace the team belongs to
 *       - in: path
 *         name: teamId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the team to unassign
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the project to unassign the team from
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - removeTeamMembersFromProject
 *             properties:
 *               removeTeamMembersFromProject:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Team was successfully unassigned from the project
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TeamUnassignedResponse'
 *       400:
 *         description: Bad Request – Invalid parameters or body
 *       401:
 *         description: Unauthorized – Missing or invalid access token
 *       403:
 *         description: Forbidden – You do not have permission to unassign the team
 *       404:
 *         description: Not Found – Team or project not found
 *       500:
 *         description: Internal Server Error
 */
router.delete('/:workspaceId/teams/:teamId/projects/:projectId',
  validateSession,
  validatorHandler(asignProjectScheme, 'params'),
  validatorHandler(unasignProjectScheme, 'body'),
  checkAdminRoleToAssign,
  teamControllers.unassignProject,
);

/**
 * @swagger
 * /workspaces/{workspaceId}/teams/{teamId}:
 *   delete:
 *     summary: Delete a team and all its related data
 *     description: >
 *       This endpoint **deletes** a team.
 *       ⚠️ **Warning:** It will also delete:
 *
 *       - All team-to-project assignments
 *       - All team members
 *       - All project members who are part of the team
 *
 *       Only the **owner of the team** is allowed to perform this action.
 *       Requires a valid Bearer access token.
 *     tags:
 *       - team
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: workspaceId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the workspace the team belongs to
 *       - in: path
 *         name: teamId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the team to delete
 *     responses:
 *       200:
 *         description: Team was successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TeamDeletedResponse'
 *       400:
 *         description: Bad Request – Invalid parameters
 *       401:
 *         description: Unauthorized – Missing or invalid access token
 *       403:
 *         description: Forbidden – Only the team owner can perform this action
 *       404:
 *         description: Not Found – Team not found
 *       500:
 *         description: Internal Server Error
 */
router.delete('/:workspaceId/teams/:teamId',
  validateSession,
  validatorHandler(teamIdScheme, 'params'),
  checkTeamOwnership,
  teamControllers.deleteProject,
);

module.exports = router;
