/**
 * @swagger
 * components:
 *   schemas:
 *     ProjectMemberWithTeams:
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
 *         projectId:
 *           type: string
 *           format: uuid
 *         role:
 *           type: string
 *           enum: [owner, member]
 *         teams:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ProjectTeamSummary'
 *
 *     ProjectTeamSummary:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *
 *     ProjectTeam:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         members:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ProjectTeamMember'
 *
 *     ProjectTeamMember:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         role:
 *           type: string
 *           enum: [owner, member]
 *         isMemberProject:
 *           type: boolean
 *
 *     ProjectMembersAndTeamsResponse:
 *       type: object
 *       properties:
 *         projectMembers:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ProjectMemberWithTeams'
 *         teams:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ProjectTeam'
 *
 *     AddProjectMemberBody:
 *       type: object
 *       required:
 *         - workspaceMemberId
 *       properties:
 *         workspaceMemberId:
 *           type: string
 *           format: uuid
 *           description: ID of the workspace member to be added to the project
 *
 *     projectMember:
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
 *         projectId:
 *           type: string
 *           format: uuid
 *         role:
 *           type: string
 *           enum: [member, owner, admin]
 *         addedAt:
 *           type: string
 *           format: date-time
 *
 *     AddedProjectMemberResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Member was added successfully
 *         addedMember:
 *           $ref: '#/components/schemas/projectMember'
 *
 *     RoleChangeRequest:
 *       type: object
 *       required:
 *         - newRole
 *       properties:
 *         newRole:
 *           type: string
 *           enum: [member, admin]
 *           description: New role to assign to the project member. Only "member" or "admin" are allowed.
 *       example:
 *         newRole: admin
 *
 *     RoleChangeSuccessResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: The role has been changed successfully
 *         updatedMember:
 *           $ref: '#/components/schemas/projectMember'
 *
 *     OwnershipTransferSuccessResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: The transfer of ownership was successful
 *         updatedRows:
 *           type: array
 *           items:
 *             type: integer
 *           example: [1]
 */
