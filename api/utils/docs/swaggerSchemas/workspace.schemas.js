/**
 * @swagger
 * components:
 *   schemas:
 *     WorkspaceWithProjects:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: f4bbaf96-10d4-468e-b947-40e64f473cb6
 *         name:
 *           type: string
 *           example: NestJS
 *         userId:
 *           type: string
 *           format: uuid
 *           example: bd4d92b7-8ed7-438a-a1e0-ac5f456f4f19
 *         description:
 *           type: string
 *           nullable: true
 *           example: Semester 1
 *         role:
 *           type: string
 *           enum: [owner, member, guest]
 *           example: owner
 *         projects:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ProjectWithAccessField'
 *
 *     GetWorkspaceAndProjectsResponse:
 *       type: object
 *       properties:
 *         workspacesAndProjects:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/WorkspaceWithProjects'
 *
 *     workspaceResponse:
 *      type: object
 *      properties:
 *        id:
 *          type: string
 *          format: uuid
 *          example: 7427d184-3a63-4995-9b5d-9862357ed2db
 *        name:
 *          type: string
 *          example: University
 *        description:
 *          type: string
 *          nullable: true
 *          example: Semester 1
 *        userId:
 *          type: string
 *          format: uuid
 *          example: 6da5bc61-8590-4db3-a497-6b4a006c2064
 *        createdAt:
 *          type: string
 *          format: date-time
 *          example: 2025-04-24T00:21:58.319Z
 *
 *     CreateWorkspaceBody:
 *      type: object
 *      required:
 *        - name
 *      properties:
 *        name:
 *          type: string
 *          example: University
 *        description:
 *          type: string
 *          nullable: true
 *          example: Semester 1
 *
 *     WorkspaceCreatedResponse:
 *      type: object
 *      properties:
 *         workspace:
 *            $ref: '#/components/schemas/workspaceResponse'
 *
 *     WorkspaceUpdatedResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Workspace updated successfully
 *         workspace:
 *           $ref: '#/components/schemas/workspaceResponse'
 *
 *     WorkspaceDeletedResponse:
 *       type: object
 *       properties:
 *          message:
 *            type: string
 *            example: Workspace deleted successfully
 */
