const boom = require('@hapi/boom');

const { checklistService } = require('../../application/services/index');

const getAllChecklistsByProject = async (req, res, next) => {
  try {
    const { projectId } = req.params;

    const cards = await checklistService.getAllChecklistsByProject(projectId);

    res.status(200).json({ cards });
  } catch (error) {
    next(error);
  }
};

const getAllChecklistsByCard = async (req, res, next) => {
  try {
    const { cardId } = req.params;

    const checklists = await checklistService.getChecklistsByCard(cardId);

    res.status(200).json({ checklists });
  } catch (error) {
    next(error);
  }
};

const createChecklist = async (req, res, next) => {
  try {
    const { cardId } = req.params;
    const { name } = req.body;

    const newChecklist = await checklistService.createChecklist({
      name,
      cardId,
    });

    res.status(201).json({ newChecklist });
  } catch (error) {
    next(error);
  }
};

const createChecklistByCopyingItems = async (req, res, next) => {
  try {
    const { cardId, checklistId } = req.params;
    const { name } = req.body;
    const { projectId } = req.projectMember;

    const newChecklist = await checklistService.createChecklistByCopyingItems(
      projectId,
      checklistId,
      { name, cardId },
    );

    res.status(201).json({ newChecklist });
  } catch (error) {
    next(error);
  }
};

const updateChecklist = async (req, res, next) => {
  try {
    const { checklistId } = req.params;
    const checklistData = req.body;
    const { projectId } = req.projectMember;

    const updatedChecklist = await checklistService.updateChecklist(
      projectId,
      checklistId,
      checklistData,
    );
    if (updatedChecklist === 0)
      throw boom.badRequest(
        'The update checklist operation returns 0 rows affected',
      );

    res.status(200).json({
      message: 'The checklist was successfully updated',
      updatedChecklist,
    });
  } catch (error) {
    next(error);
  }
};

const deleteChecklist = async (req, res, next) => {
  try {
    const { checklistId } = req.params;
    const { projectId } = req.projectMember;

    const deletedCard = await checklistService.deleteChecklist(
      projectId,
      checklistId,
    );

    res
      .status(200)
      .json({ message: 'The checklist was successfully removed', deletedCard });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllChecklistsByCard,
  getAllChecklistsByProject,
  createChecklist,
  createChecklistByCopyingItems,
  updateChecklist,
  deleteChecklist,
};
