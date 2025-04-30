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
 *         backgroundUrl:
 *           type: string
 *           example: https://images.unsplash.com/photo-asdas787878
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
 *         backgroundUrl:
 *           type: string
 *           example: https://images.unsplash.com/photo-asdas787878
 *         createdAt:
 *           type: string
 *           format: date-time
 *
 *     ProjectBoard:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         visibility:
 *           type: string
 *           enum: [private, workspace]
 *         backgroundUrl:
 *           type: string
 *           nullable: true
 *         lists:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/listWithCardWithSummerizedInformation'
 *
 *     ProjectBoardResponse:
 *       type: object
 *       properties:
 *         projectData:
 *           $ref: '#/components/schemas/ProjectBoard'
 *
 *     CreateProjectRequest:
 *       type: object
 *       required:
 *         - name
 *         - visibility
 *         - backgroundUrl
 *       properties:
 *         name:
 *           type: string
 *           description: Name of the project.
 *           example: "Testing"
 *         visibility:
 *           type: string
 *           enum: [private, workspace]
 *           description: Project visibility.
 *           example: "private"
 *         backgroundUrl:
 *           type: string
 *           format: uri
 *           nullable: true
 *           description: Optional background image URL.
 *           example: "https://images.unsplash.com/photo-1741812191037-96bb5f12010a?ixlib=rb-4.0.3&q=80&w=400"
 *
 *     UpdateProjectRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: New name of the project.
 *           example: "GraphQL"
 *         visibility:
 *           type: string
 *           enum: [private, workspace]
 *           nullable: true
 *           description: New visibility for the project.
 *           example: "private"
 */
