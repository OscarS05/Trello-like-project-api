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
 *
 *     ChecklistItemMemberAdded:
 *        type: object
 *        properties:
 *          id:
 *            type: string
 *            format: uuid
 *            example: 93cb4c3c-c9c4-420d-8d2e-0268b74036b0
 *          name:
 *            type: string
 *            example: lilo
 *          checklistItemId:
 *            type: string
 *            format: uuid
 *            example: 327c2217-6383-4305-b20a-ca6d9cb1758d
 *          projectMemberId:
 *            type: string
 *            format: uuid
 *            example: 26de1037-0474-4e11-bca1-ec344376744b
 *          addedAt:
 *            type: string
 *            format: date-time
 *            example: 2025-04-09T00:57:42.282Z
 *
 */
