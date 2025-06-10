const boom = require('@hapi/boom');

const { checklistItemService } = require('../../application/services/index');

const getAllChecklistItems = async (req, res, next) => {
  try {
    const { checklistId } = req.params;

    const checklistItems =
      await checklistItemService.getAllChecklistItems(checklistId);

    res.status(200).json({ checklistItems });
  } catch (error) {
    next(error);
  }
};

const createChecklistItem = async (req, res, next) => {
  try {
    const { checklistId } = req.params;
    const checklistItemData = req.body;
    const requesterAsProjectMember = req.projectMember;

    const newChecklistItem = await checklistItemService.createChecklistItem(
      requesterAsProjectMember,
      { ...checklistItemData, checklistId },
    );

    res.status(201).json({ newChecklistItem });
  } catch (error) {
    next(error);
  }
};

const updateChecklistItem = async (req, res, next) => {
  try {
    const { checklistItemId } = req.params;
    const checklistItemData = req.body;
    const requesterAsProjectMember = req.projectMember;

    const updatedItem = await checklistItemService.updateChecklistItem(
      requesterAsProjectMember,
      checklistItemId,
      checklistItemData,
    );
    if (updatedItem === 0)
      throw boom.badRequest(
        'The update checklist item operation returns 0 rows affected',
      );

    res.status(200).json({
      message: 'The checklist item was successfully updated',
      updatedItem,
    });
  } catch (error) {
    next(error);
  }
};

const updateTheCheckOfItem = async (req, res, next) => {
  try {
    const { checklistItemId } = req.params;
    const { isChecked } = req.body;
    const requesterAsProjectMember = req.projectMember;

    const updatedItem = await checklistItemService.updateTheCheckOfItem(
      requesterAsProjectMember,
      checklistItemId,
      isChecked,
    );
    if (updatedItem === 0)
      throw boom.badRequest(
        'The update checklist item operation returns 0 rows affected',
      );

    res.status(200).json({
      message: 'The checklist item was successfully updated',
      updatedItem,
    });
  } catch (error) {
    next(error);
  }
};

const deleteChecklistItem = async (req, res, next) => {
  try {
    const { checklistItemId } = req.params;
    const requesterAsProjectMember = req.projectMember;

    const deletedItem = await checklistItemService.deleteChecklistItem(
      requesterAsProjectMember,
      checklistItemId,
    );

    res.status(200).json({
      message: 'The checklist item was successfully removed',
      deletedItem,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllChecklistItems,
  createChecklistItem,
  updateChecklistItem,
  updateTheCheckOfItem,
  deleteChecklistItem,
};
