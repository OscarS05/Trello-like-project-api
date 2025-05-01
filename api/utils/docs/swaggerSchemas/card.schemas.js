/**
 * @swagger
 * components:
 *   schemas:
 *     CardWithSummarizedInformation:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         listId:
 *           type: string
 *           format: uuid
 *         createdAt:
 *           type: string
 *           format: date-time
 *         cardMembers:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CardMemberResponse'
 *         labels:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/LabelWithVisibility'
 *         attachmentsCount:
 *           type: integer
 *           example: 2
 *         checklistProgress:
 *           $ref: '#/components/schemas/ChecklistProgress'
 *
 *     Card:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *           example: Card 1
 *         description:
 *           type: string
 *         listId:
 *           type: string
 *           format: uuid
 *         createdAt:
 *           type: string
 *           format: date-time

 *     CardWithAllInformation:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         listId:
 *           type: string
 *           format: uuid
 *         createdAt:
 *           type: string
 *           format: date-time
 *         labels:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/LabelWithVisibility'
 *         cardMembers:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CardMemberResponse'
 *         attachments:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Attachment'
 *         checklists:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ChecklistWithItems'
 *
 *     CreateCard:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           example: Task 3
 *         description:
 *           type: string
 *           example: Description
 *
 *     UpdateCard:
 *       type: object
 *       required:
 *         - newName
 *       properties:
 *         newName:
 *           type: string
 *           example: In progress
 *         description:
 *           type: string
 *           example: description
 */
