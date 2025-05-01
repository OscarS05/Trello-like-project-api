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
 *           example: item 1
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
 *     ChecklistItemWithAssigned:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *           example: item 1
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
 *         assignedMembers:
 *           type: array
 *           items:
 *              $ref: '#/components/schemas/ChecklistItemMemberAssigned'
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
 *
 *     ChecklistItemRequest:
 *        type: object
 *        required:
 *          - name
 *        properties:
 *          name:
 *            type: string
 *            example: item 3
 *          assignedProjectMemberIds:
 *            type: array
 *            items:
 *              type: string
 *              format: uuid
 *          dueDate:
 *            type: string
 *            format: date-time
 *
 */
