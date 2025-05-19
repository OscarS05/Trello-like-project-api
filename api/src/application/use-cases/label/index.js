const dbRepositories = require('../../../infrastructure/repositories/db/index');

const GetAllLabelsUseCase = require('./GetAllLabelsUseCase');
const GetLabelsByCardUseCase = require('./GetLabelsByCardUseCase');
const CreateLabelUseCase = require('./CreateLabelUseCase');
const UpdateVisibilityUseCase = require('./UpdateVisibilityUseCase');
const UpdateLabelUseCase = require('./UpdateLabelUseCase');
const DeleteLabelUseCase = require('./DeleteLabelUseCase');

const getAllLabelsUseCase = new GetAllLabelsUseCase(dbRepositories);
const getLabelsByCardUseCase = new GetLabelsByCardUseCase(dbRepositories);
const createLabelUseCase = new CreateLabelUseCase(dbRepositories);
const updateVisibilityUseCase = new UpdateVisibilityUseCase(dbRepositories);
const updateLabelUseCase = new UpdateLabelUseCase(dbRepositories);
const deleteLabelUseCase = new DeleteLabelUseCase(dbRepositories);

module.exports = {
  getAllLabelsUseCase,
  getLabelsByCardUseCase,
  createLabelUseCase,
  updateVisibilityUseCase,
  updateLabelUseCase,
  deleteLabelUseCase,
};
