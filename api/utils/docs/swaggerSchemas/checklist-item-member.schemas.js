/**
 * @swagger
 * components:
 *   schemas:
 *     ChecklistItemMember:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         projectMemberId:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *           example: Juanita
 *
 *     ChecklistItemMemberAssigned:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         projectMemberId:
 *           type: string
 *           format: uuid
 *         checklistItemId:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *           example: Juanita
 */
