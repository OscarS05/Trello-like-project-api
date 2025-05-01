/**
 * @swagger
 * components:
 *   schemas:
 *     LabelWithVisibility:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: 28436f1c-b90e-4b0d-815f-0ad9016ce92b
 *         name:
 *           type: string
 *           example: Not started
 *         color:
 *           type: string
 *           example: "#FFFFFF"
 *         projectId:
 *           type: string
 *           format: uuid
 *           example: 9c8b7e8a-394a-4e47-8f8f-9e66fa4e3a6b
 *         isVisible:
 *           type: boolean
 *           example: true

 *     Label:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: 28436f1c-b90e-4b0d-815f-0ad9016ce92b
 *         name:
 *           type: string
 *           example: Not started
 *         color:
 *           type: string
 *           example: "#FFFFFF"
 *         projectId:
 *           type: string
 *           format: uuid
 *           example: 9c8b7e8a-394a-4e47-8f8f-9e66fa4e3a6b

 *     CreateLabel:
 *       type: object
 *       required:
 *         - name
 *         - color
 *       properties:
 *         name:
 *           type: string
 *           example: Urgent
 *         color:
 *           type: string
 *           example: "#FF0000"
 *
 *     updatedLabelVisibility:
 *       type: object
 *       properties:
 *         cardId:
 *           type: string
 *           format: uuid
 *           example: 28436f1c-b90e-4b0d-815f-0ad9016ce92b
 *         labelId:
 *           type: string
 *           format: uuid
 *           example: ef0f44dc-5f8e-46f2-a890-9ea39e26b97d
 *         isVisible:
 *           type: boolean
 *           example: true
 */
