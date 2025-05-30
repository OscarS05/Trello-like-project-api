class DeleteChecklistItemUseCase {
  constructor({ checklistItemMemberRepository }) {
    this.checklistItemMemberRepository = checklistItemMemberRepository;
  }

  async execute(checklistItemId, projectMemberId) {
    if (!checklistItemId) throw new Error('checklistItemId was not provided');
    if (!projectMemberId) throw new Error('projectMemberId was not provided');

    const result = await this.checklistItemMemberRepository.delete(
      checklistItemId,
      projectMemberId,
    );

    if (result === 0) {
      throw new Error(
        'Something went wrong removing the checklist item member',
      );
    }

    return result;
  }
}

module.exports = DeleteChecklistItemUseCase;
