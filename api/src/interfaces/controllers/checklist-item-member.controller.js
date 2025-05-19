const {
  checklistItemMemberService,
  checklistItemService,
} = require('../../application/services/index');

const getAllChecklistItemMembers = async (req, res, next) => {
  try {
    const { checklistItemId } = req.params;
    const requesterAsProjectMember = req.projectMember;

    const checklistItemMembers =
      await checklistItemMemberService.getAllChecklistItemMembers(
        requesterAsProjectMember,
        checklistItemId,
      );

    res.status(200).json({ checklistItemMembers });
  } catch (error) {
    next(error);
  }
};

const addMemberToChecklistItem = async (req, res, next) => {
  try {
    const { checklistItemId } = req.params;
    const { projectMemberIds } = req.body;
    const requesterAsProjectMember = req.projectMember;

    const availableMembersToBeAddedIds =
      await checklistItemService.filterAssignableProjectMembers(
        requesterAsProjectMember,
        checklistItemId,
        projectMemberIds,
      );
    const checklistItemMemberAdded =
      await checklistItemMemberService.addMemberToChecklistItem(
        requesterAsProjectMember,
        checklistItemId,
        availableMembersToBeAddedIds,
      );

    res.status(201).json({ checklistItemMemberAdded });
  } catch (error) {
    next(error);
  }
};

const deleteChecklistItemMember = async (req, res, next) => {
  try {
    const { checklistItemId, projectMemberId } = req.params;
    const requesterAsProjectMember = req.projectMember;

    const deletedMember =
      await checklistItemMemberService.deleteChecklistItemMember(
        requesterAsProjectMember,
        checklistItemId,
        projectMemberId,
      );

    res.status(200).json({
      message: 'The checklist item member was successfully removed',
      deletedMember,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllChecklistItemMembers,
  addMemberToChecklistItem,
  deleteChecklistItemMember,
};
