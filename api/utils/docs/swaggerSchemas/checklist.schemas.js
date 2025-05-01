/**
 * @swagger
 * components:
 *   schemas:
 *     ChecklistProgress:
 *       type: object
 *       properties:
 *         total:
 *           type: integer
 *           example: 6
 *         checked:
 *           type: integer
 *           example: 0

 *     ChecklistWithItems:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         cardId:
 *           type: string
 *           format: uuid
 *         createdAt:
 *           type: string
 *           format: date-time
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ChecklistItemWithMembers'
 */
