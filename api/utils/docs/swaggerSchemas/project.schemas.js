/**
 * @swagger
 * components:
 *   schemas:
 *     ProjectWithAccessField:
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
 *         access:
 *           type: boolean
 *           example: true
 *
 *     Project:
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
 */
