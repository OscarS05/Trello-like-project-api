/**
 * @swagger
 * components:
 *   schemas:
 *     TeamWithMembersAndProjects:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         owner:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *         workspaceId:
 *           type: string
 *           format: uuid
 *         members:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/TeamMember'
 *         projects:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Project'
 *         requesterActions:
 *           $ref: '#/components/schemas/RequesterActions'

 *     TeamMember:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         workspaceMemberId:
 *           type: string
 *           format: uuid
 *         workspaceId:
 *           type: string
 *           format: uuid
 *         teamId:
 *           type: string
 *           format: uuid
 *         role:
 *           type: string
 *           enum: [owner, admin, member]
 *         addedAt:
 *           type: string
 *           format: date-time

 *     RequesterActions:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           enum: [owner, admin, member]
 *         canModify:
 *           type: array
 *           items:
 *             type: string
 *             enum: [admin, member]
 *         actions:
 *           type: array
 *           items:
 *             type: string
 *             enum: [remove_member, change_role, leave_team, transfer_ownership, add_member]
 *
 *     CreateTeamBody:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           example: "Development Team"
 *           description: The name of the new team
 *
 *     Team:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "3102b980-5955-4216-b0e4-9f6a81401cd1"
 *         name:
 *           type: string
 *           example: "Team 4"
 *         workspaceMemberId:
 *           type: string
 *           format: uuid
 *           example: "3b000ed0-8ade-4999-822c-7dfebe69b406"
 *         workspaceId:
 *           type: string
 *           format: uuid
 *           example: "7427d184-3a63-4995-9b5d-9862357ed2db"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-04-24T00:23:11.946Z"
 *
 *     TeamAssignedResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: The team was successfully assigned
 *         result:
 *           type: object
 *           properties:
 *             assignedProject:
 *               type: object
 *               properties:
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-04-03T21:12:35.239Z"
 *                 teamId:
 *                   type: string
 *                   format: uuid
 *                   example: "96a8a2a5-416e-49c0-aed9-b710d8c98be1"
 *                 projectId:
 *                   type: string
 *                   format: uuid
 *                   example: "cba6445a-9bf3-4181-9b0a-60ab44ae746d"
 *             addedMembers:
 *               type: array
 *               description: List of team members added to the project
 *               items:
 *                 type: integer
 *                 description: Added members
 *                 example: 2
 *
 *     TeamUnassignedResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: The team was successfully unassigned
 *         result:
 *           type: integer
 *           example: 1
 *
 *     TeamDeletedResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Team was successfully deleted
 *         result:
 *           type: object
 *           properties:
 *             teamDeleted:
 *               type: integer
 *               example: 1
 *             teamMembersDeletedFromProjects:
 *               type: array
 *               items:
 *                 type: string
 *               example: []
 */
