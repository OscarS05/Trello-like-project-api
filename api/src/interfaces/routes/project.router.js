const router = require('./workspace-members.router');

const { workspaceIdSchema } = require('../schemas/workspace.schema');
const { createProject, updateProject, projectIdSchema } = require('../schemas/project.schema');
const { checkWorkspaceMembership } = require('../middlewares/authorization/workspace.authorization');

const { uploadProjectBackgroundImage } = require('../middlewares/upload-files.handler');
const { validatorHandler } = require('../middlewares/validator.handler');
const { validateSession } = require('../middlewares/authentication.handler');
const { authorizationToCreateProject, checkAdminRole, checkOwnership } = require('../middlewares/authorization/project.authorization');

const projectControllers = require('../controllers/project.controller');

router.get('/:workspaceId/projects',
  validateSession,
  validatorHandler(workspaceIdSchema, 'params'),
  checkWorkspaceMembership,
  projectControllers.getProjectsByWorkspace,
);

router.post('/:workspaceId/projects',
  validateSession,
  validatorHandler(createProject, 'body'),
  checkWorkspaceMembership,
  authorizationToCreateProject,
  projectControllers.createProject,
);

router.patch('/:workspaceId/projects/:projectId',
  validateSession,
  validatorHandler(projectIdSchema, 'params'),
  validatorHandler(updateProject, 'body'),
  checkAdminRole,
  projectControllers.updateProject
);

router.patch('/:workspaceId/projects/:projectId/background',
  validateSession,
  validatorHandler(projectIdSchema, 'params'),
  checkAdminRole,
  uploadProjectBackgroundImage.single('background-image'),
  projectControllers.updateBackgroundProject
);

router.delete('/:workspaceId/projects/:projectId',
  validateSession,
  validatorHandler(projectIdSchema, 'params'),
  checkOwnership,
  projectControllers.deleteProject
);

module.exports = router;
