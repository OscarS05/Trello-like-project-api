const boom = require('@hapi/boom');

class DeleteChecklistItemUseCase {
  constructor({ checklistItemMemberRepository }) {
    this.checklistItemMemberRepository = checklistItemMemberRepository;
  }

  async execute(checklistItemId, projectMemberId) {
    if (!checklistItemId) {
      throw boom.badRequest('checklistItemId was not provided');
    }
    if (!projectMemberId) {
      throw boom.badRequest('projectMemberId was not provided');
    }

    const checklistItemMember =
      await this.checklistItemMemberRepository.findOne({
        checklistItemId,
        projectMemberId,
      });

    if (!checklistItemMember?.id) {
      throw boom.badData(
        'The checklistItemMember does not belong to the project',
      );
    }

    const result = await this.checklistItemMemberRepository.delete(
      checklistItemId,
      projectMemberId,
    );

    if (result === 0) {
      throw boom.badRequest(
        'Something went wrong removing the checklist item member',
      );
    }

    return result;
  }
}

module.exports = DeleteChecklistItemUseCase;
