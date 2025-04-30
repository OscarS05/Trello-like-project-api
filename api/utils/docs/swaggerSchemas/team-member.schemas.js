/**
 * @swagger
 * components:
 *   schemas:
 *     ProjectWithTeams:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: 5a028f7e-dff9-4fb6-a4c0-5cdb2bdc4d9c
 *         name:
 *           type: string
 *           example: TypeScript
 *         visibility:
 *           type: string
 *           enum: [private, workspace]
 *           example: private
 *         workspaceId:
 *           type: string
 *           format: uuid
 *           example: f4bbaf96-10d4-468e-b947-40e64f473cb6
 *         workspaceMemberId:
 *           type: string
 *           format: uuid
 *           example: 0c6650a2-59d4-411d-8709-3719030ee96b
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2025-04-02T23:24:02.314Z
 *         teams:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 format: uuid
 *                 example: 96a8a2a5-416e-49c0-aed9-b710d8c98be1
 *               name:
 *                 type: string
 *                 example: Team 3
 *               workspaceMemberId:
 *                 type: string
 *                 format: uuid
 *                 example: 0c6650a2-59d4-411d-8709-3719030ee96b
 *
 *     TeamMember:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: 189c1162-6632-475b-95fa-59fbaa100b26
 *         name:
 *           type: string
 *           example: lilo
 *         workspaceMemberId:
 *           type: string
 *           format: uuid
 *           example: 0c6650a2-59d4-411d-8709-3719030ee96b
 *         workspaceId:
 *           type: string
 *           format: uuid
 *           example: f4bbaf96-10d4-468e-b947-40e64f473cb6
 *         teamId:
 *           type: string
 *           format: uuid
 *           example: 7e7bd727-a1c0-485b-8e75-6d2bdfc82ea8
 *         role:
 *           type: string
 *           enum: [owner, member, admin]
 *           example: owner
 *         addedAt:
 *           type: string
 *           format: date-time
 *           example: 2025-04-23T18:53:26.469Z
 */
