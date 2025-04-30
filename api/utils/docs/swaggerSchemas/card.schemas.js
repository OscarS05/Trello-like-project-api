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
 */
