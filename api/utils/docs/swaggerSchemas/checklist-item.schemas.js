/**
 * @swagger
 * components:
 *   schemas:
 *     ChecklistItemWithMembers:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         checklistId:
 *           type: string
 *           format: uuid
 *         isChecked:
 *           type: boolean
 *         dueDate:
 *           type: string
 *           format: date-time
 *         createdAt:
 *           type: string
 *           format: date-time
 *         members:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ChecklistItemMember'
 *
 *     ChecklistItem:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         checklistId:
 *           type: string
 *           format: uuid
 *         isChecked:
 *           type: boolean
 *         dueDate:
 *           type: string
 *           format: date-time
 *         createdAt:
 *           type: string
 *           format: date-time
 */
