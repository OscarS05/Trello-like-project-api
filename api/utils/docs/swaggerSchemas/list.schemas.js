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
 *
 *     ListWithCards:
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
 *             $ref: '#/components/schemas/Card'

 *     NameOnly:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           example: "Done"

 *     list:
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
 *
 *     NewName:
 *       type: object
 *       required:
 *         - newName
 *       properties:
 *         newName:
 *           type: string
 *           description: New name for the list
 *           example: Not done
 */
