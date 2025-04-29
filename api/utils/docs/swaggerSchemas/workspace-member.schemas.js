/**
 * @swagger
 * components:
 *   schemas:
 *
 *     WorkspaceMembersResponse:
 *       type: object
 *       properties:
 *         workspaceMembers:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 format: uuid
 *                 example: 8bc9b526-4c33-4b88-af81-0fd6a7c05188
 *               userId:
 *                 type: string
 *                 format: uuid
 *                 example: 3a81c842-3ecd-465f-89a0-20bb61e7070d
 *               user:
 *                 type: string
 *                 example: juanita
 *               role:
 *                 type: string
 *                 enum: [owner, admin, member]
 *                 example: member
 *               workspaceId:
 *                 type: string
 *                 format: uuid
 *                 example: f4bbaf96-10d4-468e-b947-40e64f473cb6
 *               addedAt:
 *                 type: string
 *                 format: date-time
 *                 example: 2025-04-03T17:03:07.224Z
 *               teams:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                       example: 7e7bd727-a1c0-485b-8e75-6d2bdfc82ea8
 *                     name:
 *                       type: string
 *                       example: Team 3
 *               projects:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                       example: 5a028f7e-dff9-4fb6-a4c0-5cdb2bdc4d9c
 *                     name:
 *                       type: string
 *                       example: TypeScript
 *                     visibility:
 *                       type: string
 *                       enum: [private, public]
 *                       example: private
 *
 *     AddWorkspaceMemberBody:
 *       type: object
 *       required:
 *         - userId
 *       properties:
 *         userId:
 *           type: string
 *           format: uuid
 *           description: ID of the user to add to the workspace.
 *
 *     WorkspaceMember:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         userId:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         workspaceId:
 *           type: string
 *           format: uuid
 *         role:
 *           type: string
 *           enum: [owner, admin, member]
 *         addedAt:
 *           type: string
 *           format: date-time
 *
 *     AddWorkspaceMemberResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Member added successfully
 *         addedMember:
 *           $ref: '#/components/schemas/WorkspaceMember'
 *
 *     UpdateWorkspaceMemberBody:
 *       type: object
 *       required:
 *         - newRole
 *       properties:
 *         newRole:
 *           type: string
 *           enum: [admin, member]
 *           description: New role to assign to the member (excluding owner)
 */
