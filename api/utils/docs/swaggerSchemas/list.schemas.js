/**
 * @swagger
 * components:
 *   schemas:
 *     listWithCardWithSummerizedInformation:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         projectId:
 *           type: string
 *           format: uuid
 *         createdAt:
 *           type: string
 *           format: date-time
 *         cards:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CardWithSummarizedInformation'
 */
