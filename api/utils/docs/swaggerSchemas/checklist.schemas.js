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
 *           example: b818e9a7-0eed-4556-89c0-d3c8b9352cfd
 *         name:
 *           type: string
 *           example: Task 2
 *         cardId:
 *           type: string
 *           format: uuid
 *           example: 449f8ab9-1f3a-4d7d-af3d-40be1a8958eb
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2025-04-12T02:37:49.832Z
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ChecklistItemWithMembers'

 *     ChecklistWithItemWithouMembers:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: b818e9a7-0eed-4556-89c0-d3c8b9352cfd
 *         name:
 *           type: string
 *           example: Task 2
 *         cardId:
 *           type: string
 *           format: uuid
 *           example: 449f8ab9-1f3a-4d7d-af3d-40be1a8958eb
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2025-04-12T02:37:49.832Z
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ChecklistItem'

 *     Checklist:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: b818e9a7-0eed-4556-89c0-d3c8b9352cfd
 *         name:
 *           type: string
 *           example: Task 2
 *         cardId:
 *           type: string
 *           format: uuid
 *           example: 449f8ab9-1f3a-4d7d-af3d-40be1a8958eb
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2025-04-12T02:37:49.832Z
 *
 *     cardWithChecklists:
 *       type: object
 *       properties:
 *         cardId:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *           example: Task 2
 *         checklists:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Checklist'
 */
