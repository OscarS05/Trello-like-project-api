const express = require('express');
const router = express.Router();

const { validateSession } = require('../middlewares/authentication.handler');
const { validatorHandler } = require('../middlewares/validator.handler');
const { createUserSchema, userIdSchema } = require('../schemas/user.schema');

const userController = require('../controllers/user.controller');

/**
 * @swagger
 * /users/{email}:
 *   get:
 *     summary: Get a user by email
 *     tags: [user]
 *     parameters:
 *       - in: path
 *         name: email
 *         schema:
 *            type: string
 *         required: true
 *         description: The user's email
 *     responses:
 *       200:
 *         description: User data
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                  $ref: '#/components/schemas/UserResponse'
 *       404:
 *         description: Email not found.
 */
router.get('/:email',
  userController.getUserByEmail
);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [user]
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                  $ref: '#/components/schemas/UserResponse'
 */
router.get('/',
  userController.getUsers
);


/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a user
 *     tags: [user]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserCreationBody'
 *     responses:
 *       201:
 *         description: The user was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       404:
 *         description: The new user was not found to send the confirmation email.
 *       409:
 *         description: The new user's email already exists
 */
router.post('/',
  validatorHandler(createUserSchema, 'body'),
  userController.signUp
);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user
 *     description: |
 *       Deletes a user from the system.
 *
 *       If the user does not belong to any workspace, they will be deleted immediately without restrictions.
 *
 *       If the user is a member of one or more workspaces, the following rules apply:
 *       - Requires a valid Bearer access token.
 *       - If the user is the **only member** of a workspace, the system will delete the user along with the workspace and all its associated projects, teams, and resources.
 *       - If the workspace has **other members**, the system will:
 *         - Check all projects and teams associated with the user.
 *         - If any project or team has **no other members** (besides the user being deleted), the deletion will be **blocked**. The user must first assign a new member to those projects/teams or delete them manually.
 *         - If all projects and teams are correctly reassigned, the system will remove the user from the workspace and then delete the user from the system.
 *
 *       This ensures data integrity by preventing orphaned projects and teams without any active members.
 *     tags:
 *       - user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID of the user to delete
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       400:
 *         description: Deletion blocked due to orphaned resources
 *       401:
 *         description: Tokens not provided. You must log in to fix it.
 *       404:
 *         description: User not found
 */
router.delete('/:userId',
  validateSession,
  validatorHandler(userIdSchema, 'params'),
  userController.deleteAccount
);

module.exports = router;
