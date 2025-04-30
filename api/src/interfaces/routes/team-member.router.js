const router = require('./team.router');

const { validatorHandler } = require('../middlewares/validator.handler');
const { validateSession } = require('../middlewares/authentication.handler');
const { teamIdScheme } = require('../schemas/team.schema');
const { roleChangeSchema, teamMemberSchemas, memberToBeAdded } = require('../schemas/team-member.schema');
const { checkTeamMembership, checkTeamOwnership, checkAdminRole } = require('../middlewares/authorization/team.authorization');
const { checkWorkspaceMembership } = require('../middlewares/authorization/workspace.authorization');

const teamMemberControllers = require('../controllers/team-member.controller');

/**
 * @swagger
 * /workspaces/{workspaceId}/teams/{teamId}/members/{teamMemberId}/projects:
 *   get:
 *     summary: Get the projects assigned to a team via a specific team member
 *     description: >
 *       This endpoint returns the list of projects where the **team** has been assigned,
 *       accessed through a **specific team member**.
 *       Requires a valid **Bearer access token**.
 *       The requester must be a member of the team.
 *     tags:
 *       - team-member
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
 *         name: teamId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the team
 *       - in: path
 *         name: teamMemberId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the team member whose projects will be listed
 *     responses:
 *       200:
 *         description: Projects where the team has been assigned, filtered by member
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ProjectsTeamMemberBelongs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ProjectWithTeams'
 *       400:
 *         description: Bad Request – Invalid UUIDs
 *       401:
 *         description: Unauthorized – Missing or invalid access token
 *       403:
 *         description: Forbidden – The requester is not a member of the team
 *       404:
 *         description: Not Found – Team or member not found
 *       500:
 *         description: Internal Server Error
 */
router.get('/:workspaceId/teams/:teamId/members/:teamMemberId/projects',
  validateSession,
  validatorHandler(teamMemberSchemas, 'params'),
  checkTeamMembership,
  teamMemberControllers.getTeamProjectsByTeamMember
);

/**
 * @swagger
 * /workspaces/{workspaceId}/teams/{teamId}/members:
 *   get:
 *     summary: Get all members of a specific team
 *     description: >
 *       Returns the list of members belonging to a specific **team** within a workspace.
 *       Requires a valid **Bearer access token**.
 *       The requester must be a **member of the workspace**, regardless of their role.
 *     tags:
 *       - team-member
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
 *         name: teamId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the team to retrieve members from
 *     responses:
 *       200:
 *         description: List of members in the specified team
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 teamMembers:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/TeamMember'
 *       400:
 *         description: Bad Request – Invalid UUIDs
 *       401:
 *         description: Unauthorized – Missing or invalid access token
 *       403:
 *         description: Forbidden – Requester is not a member of the workspace
 *       404:
 *         description: Not Found – Team or workspace not found
 *       500:
 *         description: Internal Server Error
 */
router.get('/:workspaceId/teams/:teamId/members',
  validateSession,
  validatorHandler(teamIdScheme, 'params'),
  checkWorkspaceMembership,
  teamMemberControllers.getTeamMembers
);

/**
 * @swagger
 * /workspaces/{workspaceId}/teams/{teamId}/members:
 *   post:
 *     summary: Add a member to a team
 *     description: >
 *       Adds a new **member** to a team within a workspace.
 *       Requires a valid **Bearer access token**.
 *       Only users with **admin** or **owner** role in the team can perform this action.
 *     tags:
 *       - team-member
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
 *         name: teamId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the team to add a member to
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - workspaceMemberId
 *             properties:
 *               workspaceMemberId:
 *                 type: string
 *                 format: uuid
 *                 example: e62ae538-df29-4099-955a-79cbba723582
 *     responses:
 *       200:
 *         description: Member successfully added to the team
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: The team member was added successfully
 *                 addedMember:
 *                   $ref: '#/components/schemas/TeamMember'
 *       400:
 *         description: Bad Request – Invalid input or UUIDs
 *       401:
 *         description: Unauthorized – Missing or invalid access token
 *       403:
 *         description: Forbidden – Only admins or team owners can add members
 *       404:
 *         description: Not Found – Workspace or team not found
 *       409:
 *         description: Conflict – Member is already part of the team
 *       500:
 *         description: Internal Server Error
 */
router.post('/:workspaceId/teams/:teamId/members',
  validateSession,
  validatorHandler(teamIdScheme, 'params'),
  validatorHandler(memberToBeAdded, 'body'),
  checkAdminRole,
  teamMemberControllers.addMemberToTeam,
);

/**
 * @swagger
 * /workspaces/{workspaceId}/teams/{teamId}/members/{teamMemberId}:
 *   patch:
 *     summary: Update the role of a team member (admin or member)
 *     description: >
 *       Updates the **role** of a team member in a workspace team.
 *       Allowed roles are only **member** and **admin** (not owner).
 *       Requires a valid **Bearer access token** and that the requester is an **admin or owner** of the team.
 *     tags:
 *       - team-member
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
 *         name: teamId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the team
 *       - in: path
 *         name: teamMemberId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the team member to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - newRole
 *             properties:
 *               newRole:
 *                 type: string
 *                 enum: [member, admin]
 *                 example: admin
 *     responses:
 *       200:
 *         description: Team member role updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: The team member was added successfully
 *                 updatedMember:
 *                   $ref: '#/components/schemas/TeamMember'
 *       400:
 *         description: Bad Request – Invalid UUIDs or role
 *       401:
 *         description: Unauthorized – Missing or invalid access token
 *       403:
 *         description: Forbidden – Only admins or owners can update roles
 *       404:
 *         description: Not Found – Member or team not found
 *       500:
 *         description: Internal Server Error
 */
router.patch('/:workspaceId/teams/:teamId/members/:teamMemberId',
  validateSession,
  validatorHandler(teamMemberSchemas, 'params'),
  validatorHandler(roleChangeSchema, 'body'),
  checkAdminRole,
  teamMemberControllers.updateRole,
);

/**
 * @swagger
 * /workspaces/{workspaceId}/teams/{teamId}/members/{teamMemberId}/ownership:
 *   patch:
 *     summary: Transfer team ownership to another member
 *     description: >
 *       Transfers **ownership** of a team to another member.
 *       Only the **current owner** of the team can perform this action.
 *       Requires a valid **Bearer access token** and valid UUIDs in params.
 *     tags:
 *       - team-member
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
 *         name: teamId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the team
 *       - in: path
 *         name: teamMemberId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the member who will receive ownership
 *     responses:
 *       200:
 *         description: Team ownership transferred successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: The team member was updated successfully
 *                 updatedMember:
 *                   type: array
 *                   items:
 *                     type: integer
 *                   example: [1]
 *       400:
 *         description: Bad Request – Invalid UUIDs or logic errors
 *       401:
 *         description: Unauthorized – Missing or invalid access token
 *       403:
 *         description: Forbidden – Only the current owner can transfer ownership
 *       404:
 *         description: Not Found – Team or member not found
 *       500:
 *         description: Internal Server Error
 */
router.patch('/:workspaceId/teams/:teamId/members/:teamMemberId/ownership',
  validateSession,
  validatorHandler(teamMemberSchemas, 'params'),
  checkTeamOwnership,
  teamMemberControllers.transferOwnership,
);

/**
 * @swagger
 * /workspaces/{workspaceId}/teams/{teamId}/members/{teamMemberId}:
 *   delete:
 *     summary: Remove a member from the team or allow self-removal
 *     description: >
 *       Removes a **team member** from a team.
 *       - Admins or owners can remove **any member** of the team.
 *       - Any team member can use this endpoint to **remove themselves** (leave the team).
 *       Requires a valid **Bearer access token** and UUIDs in params.
 *       The requester **must belong to the team**.
 *     tags:
 *       - team-member
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
 *         name: teamId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the team
 *       - in: path
 *         name: teamMemberId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the team member to remove
 *     responses:
 *       200:
 *         description: Member removed from the team successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: The member was successfully removed
 *                 removedRows:
 *                   type: integer
 *                   example: 1
 *       400:
 *         description: Bad Request – Invalid UUIDs or constraints
 *       401:
 *         description: Unauthorized – Missing or invalid access token
 *       403:
 *         description: Forbidden – Only team admins/owners can remove others, or self-removal
 *       404:
 *         description: Not Found – Team or member not found
 *       500:
 *         description: Internal Server Error
 */
router.delete('/:workspaceId/teams/:teamId/members/:teamMemberId',
  validateSession,
  validatorHandler(teamMemberSchemas, 'params'),
  checkTeamMembership,
  teamMemberControllers.deleteTeamMember,
);

module.exports = router;
