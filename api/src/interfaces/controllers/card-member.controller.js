const { cardMemberService } = require('../../application/services/index');

const getAllCardMembers = async (req, res, next) => {
  try {
    const { cardId } = req.params;

    const cardMembers = await cardMemberService.getCardMembers(cardId);

    res.status(200).json({ cardMembers });
  } catch (error) {
    next(error);
  }
};

const addMemberToCard = async (req, res, next) => {
  try {
    const { cardId, projectMemberId } = req.params;
    const requesterAsProjectMember = req.projectMember;

    const newMember = await cardMemberService.addCardMember(
      cardId,
      projectMemberId,
      requesterAsProjectMember,
    );

    res.status(201).json({ newMember });
  } catch (error) {
    next(error);
  }
};

const deleteCardMember = async (req, res, next) => {
  try {
    const { cardId, projectMemberId } = req.params;
    const requesterAsProjectMember = req.projectMember;

    const deletedCard = await cardMemberService.delete(
      cardId,
      projectMemberId,
      requesterAsProjectMember,
    );

    res.status(200).json({
      message: 'The card member was successfully removed',
      deletedCard,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllCardMembers,
  addMemberToCard,
  deleteCardMember,
};
