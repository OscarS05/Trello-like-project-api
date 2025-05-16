const boom = require('@hapi/boom');

const { projectService } = require('../../application/services/index');

const { PROJECT_BACKGROUND_FOLDER } = require('../../../utils/constants');

const getAllprojectInformation = async (req, res, next) => {
  try {
    const { projectId } = req.params;

    const projectData = await projectService.getAllProjectInformation(
      projectId
    );
    if (!projectData.id)
      throw boom.notFound(
        'The operation to get all project information returns a null value'
      );

    res.status(200).json({ projectData });
  } catch (error) {
    next(error);
  }
};

const getProjectsByWorkspace = async (req, res, next) => {
  try {
    const { workspaceId } = req.params;

    const projects = await projectService.findAllByWorkspace(workspaceId);
    if (!projects)
      throw boom.notFound('Get projects by workspace operation returns null');

    res.status(200).json({ projects });
  } catch (error) {
    next(error);
  }
};

const createProject = async (req, res, next) => {
  try {
    const { name, visibility, backgroundUrl } = req.body;
    const workspaceMember = req.workspaceMember;
    const projectData = {
      name,
      visibility,
      backgroundUrl,
      workspaceId: workspaceMember.workspaceId,
      workspaceMemberId: workspaceMember.id,
    };

    const projectCreated = await projectService.create(projectData);
    if (!projectCreated?.id) throw boom.badRequest('Failed to update project');

    res
      .status(201)
      .json({ message: 'Project created successfully', projectCreated });
  } catch (error) {
    next(error);
  }
};

const updateProject = async (req, res, next) => {
  try {
    const { workspaceId, projectId } = req.params;
    const data = req.body;

    const updatedProject = await projectService.update(projectId, data);
    if (!updatedProject?.id)
      return boom.badRequest('Failed to create workspace');

    res
      .status(200)
      .json({ message: 'Project updated successfully', updatedProject });
  } catch (error) {
    next(error);
  }
};

const updateBackgroundProject = async (req, res, next) => {
  try {
    if (!req.file || !req.file.buffer) {
      throw boom.badRequest('Something went wrong loading the file in Multer');
    }

    const { projectId } = req.params;

    const addedJob = await projectService.loadBackgroundImage(
      projectId,
      req.file,
      PROJECT_BACKGROUND_FOLDER
    );

    if (!addedJob.id || !addedJob.name) {
      throw boom.badRequest(
        'Something went wrong loading the file in the queue'
      );
    }

    res
      .status(200)
      .json({ message: 'Project queued successfully', job: addedJob.id });
  } catch (error) {
    next(error);
  }
};

const deleteProject = async (req, res, next) => {
  try {
    const { projectId } = req.params;

    const response = await projectService.delete(projectId);
    if (response === 0) return boom.badRequest('Failed to delete project');

    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllprojectInformation,
  getProjectsByWorkspace,
  createProject,
  updateProject,
  updateBackgroundProject,
  deleteProject,
};
